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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SelectList } from "react-native-dropdown-select-list";
import SwitchToggle from "react-native-switch-toggle";
import { createRecord, formatDateTime } from "./util";
import {
  commonStyles,
  lightBlue,
  windowHeight,
  windowWidth,
  fontSize,
} from "./style";

// Declare UI size constants
const toggleWidth = Math.min(windowWidth, windowHeight) * 0.8;
const toggleHeight = toggleWidth * 0.1;

export const allTypes = [
  { key: "0", value: "All" },
  { key: "1", value: "Bills" },
  { key: "2", value: "Education" },
  { key: "3", value: "Entertainment" },
  { key: "4", value: "Family" },
  { key: "5", value: "Food" },
  { key: "6", value: "Grocery" },
  { key: "7", value: "Housing" },
  { key: "8", value: "Insurance" },
  { key: "9", value: "Medical" },
  { key: "10", value: "Others" },
  { key: "11", value: "Pet" },
  { key: "12", value: "Saving" },
  { key: "13", value: "Shopping" },
  { key: "14", value: "Salary" },
  { key: "15", value: "Sport" },
  { key: "16", value: "Taxes" },
  { key: "17", value: "Transport" },
  { key: "18", value: "Travel" },
];

const AddScreen = ({ navigation, setRecordAdded }) => {
  // References to input fields for manipulating their values
  const nameRef = createRef();
  const amountRef = createRef();

  // Reactive states
  const [isIncome, setIsIncome] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

  const [time, setTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [category, setCategory] = useState(null);

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFreq, setRecurringFreq] = useState(null);
  const recurringFreqs = [
    { key: "1", value: "Daily" },
    { key: "2", value: "Weekly" },
    { key: "3", value: "Monthly" },
    { key: "4", value: "Yearly" },
  ];

  const [recurringEndTime, setRecurringEndTime] = useState(null);
  const [isRecurrPickerVisible, setRecurrPickerVisible] = useState(false);

  // Display a loading wheel when the data is being processed
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = (time) => {
    setTime(time);
    setDatePickerVisible(false);
  };

  const handleRecurrConfirm = (time) => {
    setRecurringEndTime(time);
    setRecurrPickerVisible(false);
  };

  const handleAddRecord = (
    name,
    category,
    amount,
    time,
    isIncome,
    isRecurring,
    recurringFreq,
    recurringEndTime,
  ) => {
    if (name == "") {
      Alert.alert("Please fill in name");
      return;
    } else if (amount == 0) {
      Alert.alert("Please fill in a correct amount");
      return;
    } else if (time == null) {
      Alert.alert("Please fill in time");
      return;
    } else if (category == null) {
      Alert.alert("Please fill in category");
      return;
    } else if (isRecurring && recurringFreq == null) {
      Alert.alert("Please fill in recurring frequency");
      return;
    } else if (isRecurring && recurringEndTime == null) {
      Alert.alert("Please fill in recurring end time");
      return;
    } else {
      createRecord(
        name,
        category,
        amount,
        time,
        isIncome,
        isRecurring,
        recurringFreq,
        recurringEndTime,
        setRecordAdded,
        setIsProcessing,
      );
      resetValues();
    }
  };

  // Clear input fields after submitting a record
  const resetValues = () => {
    setIsIncome(false);
    nameRef.current.clear();
    setName("");
    amountRef.current.clear();
    setAmount(0);
    setTime(null);
    setRecurringEndTime(null);
  };

  return (
    <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
      <View style={commonStyles.contentArea}>
        {isProcessing == true ? (
          <>
            {/* Renders the loading screen */}
            <ActivityIndicator size="large" color={lightBlue} />
            <Text style={commonStyles.title}>Loading...</Text>
          </>
        ) : (
          <>
            {/* Switch for choosing income or expense */}
            <SwitchToggle
              switchOn={isIncome}
              onPress={() => setIsIncome(!isIncome)}
              backgroundColorOn="lightblue"
              backgroundColorOff="lightblue"
              containerStyle={styles.toggleContainer}
              circleStyle={styles.toggleCircle}
              circleColorOn="green"
              circleColorOff="red"
              buttonTextStyle={styles.toggleText}
              buttonText={isIncome ? "Income" : "Expense"}
            />
            {/* Input field for name */}
            <View
              style={[commonStyles.inputBoxContainer, commonStyles.underline]}
            >
              <Text style={commonStyles.inputTitle}>Name</Text>
              <TextInput
                ref={nameRef}
                style={commonStyles.inputField}
                placeholder="Press to enter name"
                onChangeText={(name) => setName(name)}
              />
            </View>
            {/* Input field for amount */}
            <View
              style={[commonStyles.inputBoxContainer, commonStyles.underline]}
            >
              <Text style={commonStyles.inputTitle}>Amount</Text>
              <TextInput
                ref={amountRef}
                style={commonStyles.inputField}
                keyboardType="numeric"
                placeholder="Press to enter amount"
                onChangeText={(amount) => setAmount(amount)}
              />
            </View>
            {/* Input field for date and time */}
            <Text
              style={[commonStyles.inputTitle, commonStyles.inputBoxContainer]}
            >
              Time & Date
            </Text>
            <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
              <Text style={commonStyles.button}>
                {time == null ? "Select Time & Date" : formatDateTime(time)}
              </Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={() => setDatePickerVisible(false)}
              display="inline"
            />
            {/* Input field for transaction type */}
            <View style={commonStyles.inputBoxContainer}>
              <Text style={commonStyles.inputTitle}>Type</Text>
              <SelectList
                data={allTypes.slice(1)}
                save="value"
                setSelected={(value) => setCategory(value)}
                placeholder="Select type"
                search={true}
                maxHeight={windowHeight * 0.2}
                inputStyles={commonStyles.inputField}
                dropdownTextStyles={commonStyles.inputTitle}
              />
            </View>
            {/* Input field for recurring transaction */}
            <View style={[commonStyles.inputBoxContainer, commonStyles.rowBar]}>
              <Text style={commonStyles.inputTitle}>Recurring Record</Text>
              <Switch
                onValueChange={() => {
                  setIsRecurring(!isRecurring);
                  setRecurringFreq(null);
                }}
                value={isRecurring}
              />
            </View>
            {/* Input field for recurring type */}
            {isRecurring && (
              <>
                <View style={commonStyles.inputBoxContainer}>
                  <Text style={commonStyles.inputTitle}>
                    Recurring Frequency
                  </Text>
                  <SelectList
                    data={recurringFreqs}
                    save="value"
                    setSelected={(value) => setRecurringFreq(value)}
                    placeholder="Select frequency"
                    search={false}
                    maxHeight={windowHeight * 0.2}
                    inputStyles={commonStyles.inputField}
                    dropdownTextStyles={commonStyles.inputTitle}
                  />
                </View>
                {/* Input field for recurring end time */}
                <Text
                  style={[
                    commonStyles.inputTitle,
                    commonStyles.inputBoxContainer,
                  ]}
                >
                  Recurring End Time
                </Text>
                <TouchableOpacity onPress={() => setRecurrPickerVisible(true)}>
                  <Text style={commonStyles.button}>
                    {recurringEndTime == null
                      ? "Select recurring end time"
                      : formatDateTime(recurringEndTime)}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isRecurrPickerVisible}
                  mode="datetime"
                  onConfirm={handleRecurrConfirm}
                  onCancel={() => setRecurrPickerVisible(false)}
                  display="inline"
                />
              </>
            )}
            {/* Button to add transaction */}
            <TouchableOpacity
              onPress={() =>
                handleAddRecord(
                  name,
                  category,
                  amount,
                  time,
                  isIncome,
                  isRecurring,
                  recurringFreq,
                  recurringEndTime,
                )
              }
            >
              <Text style={commonStyles.button}>Add Record</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    width: toggleWidth,
    height: toggleHeight,
    borderRadius: toggleHeight / 2,
    marginVertical: windowHeight * 0.01,
  },
  toggleCircle: {
    width: toggleWidth / 2,
    height: toggleHeight,
    borderRadius: toggleHeight / 2,
    justifyContent: "center",
  },
  toggleText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: fontSize * 0.8,
  },
});

export default AddScreen;
