import { React, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { commonStyles, windowHeight } from "./style";
import { allTypes } from "./AddScreen";
import { filterTransactionCategory } from "./filterSort";
import { getBestEstimator } from "./estimator";
import moment from "moment";

const predictTimeTypes = [
  { key: "1", value: "1 Week" },
  { key: "2", value: "1 Month" },
  { key: "3", value: "3 Months" },
  { key: "4", value: "6 Months" },
  { key: "5", value: "1 Year" },
];

const encode = (transactions, timeScale, category) => {
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

  // Convert to values which is the total balance at each time
  let values = [];
  let sum = 0;
  deltaIncome.forEach((deltaValue) => {
    sum += deltaValue;
    values.push(sum);
  });

  console.log(`Times: ${times}`);
  console.log(`Values: ${values}`);
  return [times, values];
};

const decode = (transactions, timeScale) => {
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

const predict = (transactions, predictTo, category) => {
  const toTimeScale = {
    "1 Week": { value: 1, unit: "d", unitInDay: 1, times: 7, format: "DD/MM" },
    "1 Month": { value: 7, unit: "d", unitInDay: 1, times: 4, format: "DD/MM" },
    "3 Months": {
      value: 14,
      unit: "d",
      unitInDay: 1,
      times: 6,
      format: "DD/MM",
    },
    "6 Months": {
      value: 1,
      unit: "M",
      unitInDay: 30,
      times: 6,
      format: "MM/YY",
    },
    "1 Year": { value: 2, unit: "M", unitInDay: 30, times: 6, format: "MM/YY" },
  };

  // Encode transactions
  if (predictTo == null) {
    Alert.alert("Please select a prediction period");
    return;
  }
  const timeScale = toTimeScale[predictTo];
  const [times, values] = encode(transactions, timeScale, category);
  if (times.length == 0) {
    Alert.alert("No transactions in the selected record type");
    return;
  }

  // Decode the next times to date for printing
  const [nextTimes, nextDisplayTimes, latestTimeUnit] = decode(
    transactions,
    timeScale,
  );
  console.log(`Next times: ${nextTimes}`);

  // Get estimators
  const bestEstimator = getBestEstimator(times, values, latestTimeUnit);
  if (bestEstimator == null) {
    Alert.alert("Not enough data to predict");
    return;
  }

  // Predict the next values
  const nextValues = nextTimes.map((time) => parseInt(bestEstimator(time)));
  console.log(`Next values: ${nextValues}`);
  console.log(`Next display times: ${nextDisplayTimes}`);

  return [nextDisplayTimes, nextValues];
};

const TrendScreen = ({ navigation, transactions }) => {
  const [predictTo, setPredictTo] = useState(null);
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
