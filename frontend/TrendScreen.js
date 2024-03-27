import { React, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { commonStyles, windowHeight } from "./style";
import { allTypes } from "./AddScreen";
import { encode, decode, getBestEstimator } from "../util/estimator";
import { filterTransactionCategory } from "../util/filterSort";

const predictTimeTypes = [
  { key: "1", value: "1 Week" },
  { key: "2", value: "1 Month" },
  { key: "3", value: "3 Months" },
  { key: "4", value: "6 Months" },
  { key: "5", value: "1 Year" },
];

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
  const filteredTransactions = filterTransactionCategory(transactions, category);
  if (filteredTransactions.length == 0) {
    Alert.alert("No transactions in the selected record type");
    return;
  }
  const timeScale = toTimeScale[predictTo];
  const [times, values] = encode(filteredTransactions, timeScale, category);

  // Decode the next times to date for printing
  const [nextTimes, nextDisplayTimes, latestTimeUnit] = decode(
    filteredTransactions,
    timeScale,
  );
  // console.log(`Next times: ${nextTimes}`);

  // Get estimator
  const bestEstimator = getBestEstimator(times, values, latestTimeUnit);
  if (bestEstimator == null) {
    Alert.alert("Not enough data to predict");
    return;
  }

  // Predict the next values
  const nextValues = nextTimes.map((time) => parseInt(bestEstimator(time)));
  console.log(`Next display times: ${nextDisplayTimes}`);
  console.log(`Next values: ${nextValues}`);

  return [nextDisplayTimes, nextValues];
};

const TrendScreen = ({ navigation, transactions }) => {
  const [predictTo, setPredictTo] = useState(null);
  const [category, setCategory] = useState("Total Balance");

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
            placeholder="Total Balance"
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
