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

  console.log(`The best fit line: y = ${m}x + ${c}`);
  // Output the estimated value for each point
  times.forEach((time, i) =>
    console.log(
      `Estimated value for time ${time}: ${linearFunction(time).toFixed(3)} vs actual value: ${values[i]}`,
    ),
  );
  console.log("\n");
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

  console.log(`The best fit quadratic: y = ${c0} + ${c1}x + ${c2}x^2`);
  // Output the estimated value for each point
  times.forEach((time, i) =>
    console.log(
      `Estimated value for time ${time}: ${quadraticFunction(time).toFixed(3)} vs actual value: ${values[i]}`,
    ),
  );
  console.log("\n");
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

  console.log(`The best fit exp: y = ${c} * e^(${m}x) + ${h}`);
  // Output the estimated value for each point
  times.forEach((time, i) =>
    console.log(
      `Estimated value for time ${time}: ${expFunction(time).toFixed(3)} vs actual value: ${values[i]}`,
    ),
  );
  console.log("\n");
  return expFunction;
};

const getSquareError = (times, labels, estimator) => {
  const n = times.length;
  const error = labels.reduce(
    (a, b, i) => a + (b - estimator(times[i])) ** 2,
    0,
  );
  return error / n;
};

export const getBestEstimator = (times, values) => {
  const linearFunction = linearEstimator(times, values);
  const quadraticFunction = quadraticEstimator(times, values);
  const expFunction = expEstimator(times, values);

  const functions = [linearFunction, quadraticFunction, expFunction];
  const errors = functions.map((func) => getSquareError(times, values, func));
  console.log(`Square error for linear: ${errors[0]}`);
  console.log(`Square error for quadratic: ${errors[1]}`);
  console.log(`Square error for exp: ${errors[2]}`);
  console.log("\n");

  const bestIndex = errors.indexOf(Math.min(...errors));
  console.log(`The best estimator is: ${bestIndex}`);
  return functions[bestIndex];
};
