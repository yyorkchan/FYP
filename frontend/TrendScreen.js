import { React, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { commonStyles, windowHeight, windowWidth } from "./style";
import { allTypes } from "./AddScreen";
import { encode, decode, getBestEstimator } from "../util/estimator";
import { filterTransactionCategory } from "../util/filterSort";
import { LineChart } from "react-native-chart-kit";

const predictTimeTypes = [
  { key: "1", value: "4 Days" },
  { key: "2", value: "4 Weeks" },
  { key: "3", value: "2 Months" },
  { key: "4", value: "4 Months" },
  { key: "5", value: "1 Year" },
];

const predict = (transactions, predictTo, category) => {
  // console.log(`Transactions: ${transactions.map((t) => t.amount)}`)
  const toTimeScale = {
    "4 Days": { value: 1, unit: "d", unitInDay: 1, format: "DD/MM" },
    "4 Weeks": { value: 7, unit: "d", unitInDay: 1, format: "DD/MM" },
    "2 Months": { value: 15, unit: "d", unitInDay: 1, format: "DD/MM" },
    "4 Months": { value: 1, unit: "M", unitInDay: 30, format: "MM/YY" },
    "1 Year": { value: 3, unit: "M", unitInDay: 30, format: "MM/YY" },
  };
  // Perform checks
  const filteredTransactions = filterTransactionCategory(
    transactions,
    category,
  );
  if (predictTo == null) {
    Alert.alert("Please select a prediction period");
    return;
  }
  if (filteredTransactions.length == 0) {
    Alert.alert("No transactions in the selected record type");
    return;
  }

  // Encode transactions
  const timeScale = toTimeScale[predictTo];
  console.log(`Fitered Transactions: ${filteredTransactions.map((t) => t.amount)}`);
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
  console.log(`Current Values: ${values}`);
  console.log(`\n`);
  return [nextDisplayTimes, nextValues];
};

const TrendScreen = ({ navigation, transactions }) => {
  const [predictTo, setPredictTo] = useState(null);
  const [category, setCategory] = useState("Total Balance");
  const [nextValues, setNextValues] = useState(null);
  const [nextDisplayTimes, setNextDisplayTimes] = useState(null);

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
          onPress={() => {
            temp = predict(transactions, predictTo, category)
            if (temp == null) {
              return;
            }
            setNextDisplayTimes(temp[0])
            setNextValues(temp[1])
          }}
        >
          <Text style={commonStyles.button}>Predict</Text>
        </TouchableOpacity>
        {/* Line chart */}
        {/* title */}

        {nextValues && (<Text style={commonStyles.graphTitle}>Trend Prediction</Text>)}
        {nextValues && (
          <LineChart
            data={{
              labels: nextDisplayTimes,
              datasets: [{ data: nextValues }],
            }}
            width={windowWidth * 0.95}
            height={200}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0, 110, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(30, 30, 30, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            getDotColor={(dataPoint, dataPointIndex) => { return dataPointIndex >= nextValues.length - 4 ? 'orange' : 'green' }}
            bezier
          />
        )}
      </View>
    </ScrollView>
  );
};

export default TrendScreen;
