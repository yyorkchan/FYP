import { React, useState, createRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import {
  commonStyles,
  windowHeight,
  fontSize,
  lightGray,
  darkGray,
  lightBlue,
  paleBlue,
} from "./style";
import { allTypes } from "./AddScreen";
import { filterTransactionCategory } from "./filterSort";
import moment from "moment";

const predictTimeTypes = [
  { key: "1", value: "1 Week" },
  { key: "2", value: "1 Month" },
  { key: "3", value: "3 Months" },
  { key: "4", value: "6 Months" },
  { key: "5", value: "1 Year" },
];

// Input: (1, 5), (2, 7), (3, 4) => times = [1, 2, 3], values = [5, 7, 4]
// Output: m, c => y = mx + c
const linearEstimator = (times, values) => {
  const n = times.length;
  const Sx = times.reduce((a, b) => a + b, 0);
  const Sy = values.reduce((a, b) => a + b, 0);
  const Sxy = times.reduce((a, b, i) => a + b * values[i], 0);
  const Sxx = times.reduce((a, b) => a + b * b, 0);
  const Syy = values.reduce((a, b) => a + b * b, 0);
  const m = (n * Sxy - Sx * Sy) / (n * Sxx - Sx * Sx);
  const c = (Sy - m * Sx) / n;
  const r =
    (n * Sxy - Sx * Sy) / Math.sqrt((n * Sxx - Sx * Sx) * (n * Syy - Sy * Sy));

  // Construct the linear estimator
  const linearFunction = (x) => m * x + c;

  console.log(`The best fit line: y = ${m}x + ${c}`);
  // Output the estimated value for each point
  times.forEach((time, i) =>
    console.log(
      `Estimated value for time ${time}: ${(m * time + c).toFixed(3)} vs actual value: ${values[i]}`,
    ),
  );
  console.log(`Correlation coefficient: ${r}\n`);
  return [linearFunction, r];
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

  const SSE = values.reduce(
    (a, b, i) => a + (b - c0 - c1 * times[i] - c2 * times[i] * times[i]) ** 2,
    0,
  );
  const SST = values.reduce((a, b) => a + (b - Sy / n) ** 2, 0);
  const r = 1 - SSE / SST;

  // Construct the quadratic estimator
  const quadraticFunction = (x) => c0 + c1 * x + c2 * x * x;

  console.log(`The best fit quadratic: y = ${c0} + ${c1}x + ${c2}x^2`);
  // Output the estimated value for each point
  times.forEach((time, i) =>
    console.log(
      `Estimated value for time ${time}: ${(c0 + c1 * time + c2 * time * time).toFixed(3)} vs actual value: ${values[i]}`,
    ),
  );
  console.log(`Correlation coefficient: ${r}\n`);
  return [quadraticFunction, r];
};

const encode = (transactions, timeScale, category) => {
  const unitTime = timeScale.value * timeScale.unitInDay * 60 * 60 * 24 * 1000;

  // Extract transactions for the category
  const relatedTransactions = filterTransactionCategory(transactions, category);
  if (relatedTransactions.length == 0) {
    return;
  }

  // Summerise transactions within unit time
  // time = (transaction.time - zeroTime) / unitTime rounded off
  // value = sum(transaction.amount) in the same time index
  const zeroTime = new Date(relatedTransactions[0].time);
  let times = [];
  let values = [];

  // Convert to times and values
  relatedTransactions.forEach((transaction) => {
    const unitTimeOffset = Math.round(
      (new Date(transaction.time) - zeroTime) / unitTime,
    );
    if (times.length == 0 || unitTimeOffset != times[times.length - 1]) {
      times.push(unitTimeOffset);
    }
    const timeIdx = times.indexOf(unitTimeOffset);
    if (values.length <= timeIdx) {
      values.push(0);
    }
    values[timeIdx] += transaction.amount;
  });

  console.log(`Times: ${times}`);
  console.log(`Values: ${values}`);
  console.log(`Sum of values: ${values.reduce((a, b) => a + b, 0)}`);

  return [times, values];
};

const decode = (transactions, timeScale) => {
  const unitTime = timeScale.value * timeScale.unitInDay * 60 * 60 * 24 * 1000;
  const currentTime = new Date();
  const zeroTime = new Date(transactions[0].time);
  const currentTimeUnit = Math.round((currentTime - zeroTime) / unitTime);
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
    return currentTime.add((time - currentTimeUnit) * value, unit).format(timeFormat);
  });
  // console.log(displayTimes);
  return [nextTimes, displayTimes];
}

const predict = (transactions, predictTo, category) => {
  const toTimeScale = {
    "1 Week": {"value": 1, "unit": 'd', "unitInDay": 1, "times": 7, "format": "DD/MM"},
    "1 Month": {"value": 7, "unit": 'd', "unitInDay": 1, "times": 4, "format": "DD/MM"},
    "3 Months": {"value": 14, "unit": 'd', "unitInDay": 1, "times": 6, "format": "DD/MM"},
    "6 Months": {"value": 1, "unit": 'M', "unitInDay": 30, "times": 6, "format": "MM/YY"},
    "1 Year": {"value": 2, "unit": 'M', "unitInDay": 30, "times": 6, "format": "MM/YY"},
  };

  // Encode transactions
  const timeScale = toTimeScale[predictTo];
  const [times, values] = encode(transactions, timeScale, category);
  if (times.length == 0) {
    console.log("No transactions in this category");
    return;
  }

  // Get estimators
  // times = [1, 2, 3, 4], values = [3, 9, 14, 18]
  const [linearFunction, r] = linearEstimator(times, values);
  const [quadraticFunction, r2] = quadraticEstimator(times, values);
  console.log(`Estimated value for 10 is ${linearFunction(10)}`);
  console.log(`Estimated value for 10 is ${quadraticFunction(10)}`);
  const bestEstimator = linearFunction;

  // Decode the next times to date for printing
  const [nextTimes, nextDisplayTimes] = decode(transactions, timeScale);
  console.log(`Next times: ${nextTimes}`);

  // Predict the next values
  const nextValues = nextTimes.map((time) => bestEstimator(time));
  console.log(`Next values: ${nextValues}`);
  console.log(`Next display times: ${nextDisplayTimes}`);
};

const TrendScreen = ({ navigation, transactions }) => {
  const [predictTo, setPredictTo] = useState("");
  const [category, setCategory] = useState("All");

  return (
    <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
      <View style={commonStyles.contentArea}>
        {/* Input field for prediction period */}
        <View style={commonStyles.inputBoxContainer}>
          <Text style={commonStyles.inputTitle}>Predict To Next</Text>
          <SelectList
            data={predictTimeTypes}
            save="value"
            setSelected={(value) => setPredictTo(value)}
            placeholder="Select prediction period"
            search={false}
            maxHeight={windowHeight * 0.2}
            inputStyles={commonStyles.inputField}
            dropdownTextStyles={commonStyles.inputTitle}
          />
        </View>
        {/* Input field for record type */}
        <View style={commonStyles.inputBoxContainer}>
          <Text style={commonStyles.inputTitle}>Record Type</Text>
          <SelectList
            data={allTypes}
            save="value"
            setSelected={(value) => setCategory(value)}
            placeholder="All"
            search={true}
            maxHeight={windowHeight * 0.2}
            inputStyles={commonStyles.inputField}
            dropdownTextStyles={commonStyles.inputTitle}
          />
        </View>
        {/* Predict button */}
        <TouchableOpacity
          onPress={() => predict(transactions, predictTo, category)}
        >
          <Text style={commonStyles.button}>Predict</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default TrendScreen;
