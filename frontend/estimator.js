import { filterTransactionCategory } from "./filterSort";
import moment from "moment";

export const encode = (transactions, timeScale, category) => {
  const unitTime = timeScale.value * timeScale.unitInDay * 60 * 60 * 24 * 1000;

  // Extract transactions for the category
  const relatedTransactions = filterTransactionCategory(transactions, category);
  if (relatedTransactions.length == 0) {
    return [[], []];
  }

  // Summerise transactions within unit time
  // time = (transaction.time - zeroTime) / unitTime rounded off
  // value = total balance at a unit time
  const zeroTime = new Date(relatedTransactions[0].time);
  let times = [];
  // deltaIncome is the change in balance
  // Which will be converted to total balance
  let deltaIncome = [];

  // Convert to times and deltaIncome
  relatedTransactions.forEach((transaction) => {
    const unitTimeOffset = Math.round(
      (new Date(transaction.time) - zeroTime) / unitTime,
    );
    if (times.length == 0 || unitTimeOffset != times[times.length - 1]) {
      times.push(unitTimeOffset);
    }
    const timeIdx = times.indexOf(unitTimeOffset);
    if (deltaIncome.length <= timeIdx) {
      deltaIncome.push(0);
    }
    deltaIncome[timeIdx] += transaction.amount;
  });

  // If we want to predict change in balance
  if (category != "Total Balance") {
    // console.log(`Times: ${times}`);
    // console.log(`Delta Income: ${deltaIncome}`);
    return [times, deltaIncome];
  }

  // If we want to predict total balance
  let values = [];
  let sum = 0;
  deltaIncome.forEach((deltaValue) => {
    sum += deltaValue;
    values.push(sum);
  });

  // console.log(`Times: ${times}`);
  // console.log(`Values: ${values}`);
  return [times, values];
};

export const decode = (transactions, timeScale) => {
  const unitTime = timeScale.value * timeScale.unitInDay * 60 * 60 * 24 * 1000;
  const currentTime = new Date();
  const zeroTime = new Date(transactions[0].time);
  const currentTimeUnit = Math.round((currentTime - zeroTime) / unitTime);
  const latestTimeUnit = Math.round(
    (new Date(transactions[transactions.length - 1].time) - zeroTime) /
      unitTime,
  );
  const duration = timeScale.times;

  // Get the next times
  const nextTimes = [];
  for (let i = 1; i <= duration; i++) {
    nextTimes.push(currentTimeUnit + i);
  }

  // Get the display times
  const value = timeScale.value;
  const unit = timeScale.unit;
  const timeFormat = timeScale.format;
  const displayTimes = nextTimes.map((time) => {
    const currentTime = new moment();
    return currentTime
      .add((time - currentTimeUnit) * value, unit)
      .format(timeFormat);
  });
  // console.log(displayTimes);
  return [nextTimes, displayTimes, latestTimeUnit];
};

const linearEstimator = (times, values) => {
  const n = times.length;
  const Sx = times.reduce((a, b) => a + b, 0);
  const Sy = values.reduce((a, b) => a + b, 0);
  const Sxy = times.reduce((a, b, i) => a + b * values[i], 0);
  const Sxx = times.reduce((a, b) => a + b * b, 0);
  const Syy = values.reduce((a, b) => a + b * b, 0);
  const m = (n * Sxy - Sx * Sy) / (n * Sxx - Sx * Sx);
  const c = (Sy - m * Sx) / n;

  // Construct the linear estimator
  const linearFunction = (x) => m * x + c;

  // console.log(`The best fit line: y = ${m}x + ${c}`);
  return linearFunction;
};

const quadraticEstimator = (times, values) => {
  const n = times.length;
  const Sx = times.reduce((a, b) => a + b, 0);
  const Sxx = times.reduce((a, b) => a + b * b, 0);
  const Sxxx = times.reduce((a, b) => a + b * b * b, 0);
  const Sxxxx = times.reduce((a, b) => a + b * b * b * b, 0);
  const Sy = values.reduce((a, b) => a + b, 0);
  const Sxy = times.reduce((a, b, i) => a + b * values[i], 0);
  const Sxxy = times.reduce((a, b, i) => a + b * b * values[i], 0);

  const Mxx = Sxx - (Sx * Sx) / n;
  const Mxy = Sxy - (Sx * Sy) / n;
  const Mxx2 = Sxxx - (Sxx * Sx) / n;
  const Mx2x2 = Sxxxx - (Sxx * Sxx) / n;
  const Mx2y = Sxxy - (Sxx * Sy) / n;

  const c2 = (Mx2y * Mxx - Mxy * Mxx2) / (Mx2x2 * Mxx - Mxx2 * Mxx2);
  const c1 = (Mxy - c2 * Mxx2) / Mxx;
  const c0 = (Sy - c1 * Sx - c2 * Sxx) / n;

  // Construct the quadratic estimator
  const quadraticFunction = (x) => c0 + c1 * x + c2 * x * x;

  // console.log(`The best fit quadratic: y = ${c0} + ${c1}x + ${c2}x^2`);
  return quadraticFunction;
};

const expEstimator = (times, values) => {
  // Make sure values are positive
  const h = Math.min(...values) - 1;
  const positiveValues = values.map((value) => value - h);

  const n = times.length;
  const Sxlogy = times.reduce(
    (a, b, i) => a + b * Math.log(positiveValues[i]),
    0,
  );
  const Slogy = positiveValues.reduce((a, b) => a + Math.log(b), 0);
  const Sx = times.reduce((a, b) => a + b, 0);
  const Sx2 = times.reduce((a, b) => a + b * b, 0);

  const m = (n * Sxlogy - Sx * Slogy) / (n * Sx2 - Sx * Sx);
  const c = Math.exp((Slogy - m * Sx) / n);

  // Construct the exp estimator
  const expFunction = (x) => c * Math.exp(m * x) + h;

  // console.log(`The best fit exp: y = ${c} * e^(${m}x) + ${h}`);
  return expFunction;
};

const getLogError = (times, labels, estimator) => {
  const n = times.length;
  const error = labels.reduce(
    (a, b, i) => a + (b - estimator(times[i])) ** 2,
    0,
  );
  // Avoid -Infinity
  return Math.log(error / n + 1);
};

export const getBestEstimator = (times, values, latestTimeUnit) => {
  const linearFunction = linearEstimator(times, values);
  const quadraticFunction = quadraticEstimator(times, values);
  const expFunction = expEstimator(times, values);

  const functions = [linearFunction, quadraticFunction, expFunction];
  const valueOffsets = functions.map(
    (func) => func(latestTimeUnit) - values[values.length - 1],
  );
  const tunedFunctions = functions.map(
    (func, i) => (x) => func(x) - valueOffsets[i],
  );
  const errors = tunedFunctions.map((func) => getLogError(times, values, func));

  // Debug output
  // Output the estimated value for each point
  // tunedFunctions.forEach((func, j) => {
  //   times.forEach((time, i) => {
  //     console.log(
  //       `[F${j}] Estimated ${time}: ${func(time).toFixed(3)} vs Actual: ${values[i]}`,
  //     );
  //   });
  //     console.log(`Log error for [F${j}]: ${errors[j]}`);
  //     console.log("\n");
  // });

  const bestIndex = errors.indexOf(Math.min(...errors));
  // console.log(`The best estimator is: ${bestIndex}`);
  return tunedFunctions[bestIndex];
};
