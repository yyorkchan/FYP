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
  // Given times and values -> best estimator
  // times = [1, 2, 3, 4], values = [3, 9, 14, 18]
  const bestEstimator = getBestEstimator(times, values);
  if (bestEstimator == null) {
    console.log("Not enough data to predict");
    return;
  }

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
