import { React, useState, createRef } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SelectList } from "react-native-dropdown-select-list";
import SwitchToggle from "react-native-switch-toggle";
import {
  createRecord,
  fontSize,
  formatDateTime,
  windowHeight,
  windowWidth,
} from "./util";

// Declare UI size constants
const componentWidth = windowWidth * 0.8;
const toggleWidth = componentWidth;
const toggleHeight = Math.max(windowHeight * 0.04, 40);

const AddScreen = ({ navigation }) => {
  // References to input fields for manipulating their values
  const nameRef = createRef();
  const amountRef = createRef();

  // Reactive states
  const [isIncome, setIsIncome] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

  const [time, setTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const [category, setCategory] = useState([]);
  const allTypes = [
    { key: "1", value: "Bills" },
    { key: "2", value: "Education" },
    { key: "3", value: "Entertainment" },
    { key: "4", value: "Family" },
    { key: "5", value: "Food" },
    { key: "6", value: "Grocery" },
    { key: "7", value: "Medical" },
    { key: "8", value: "Others" },
    { key: "9", value: "Transport" },
    { key: "10", value: "Travel" },
    { key: "11", value: "Shopping" },
  ];

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFreq, setRecurringFreq] = useState([]);
  const recurringFreqs = [
    { key: "1", value: "Daily" },
    { key: "2", value: "Weekly" },
    { key: "3", value: "Monthly" },
    { key: "4", value: "Yearly" },
  ];

  const handleConfirm = (time) => {
    setTime(time);
    setDatePickerVisible(false);
  };

  // Clear input fields after submitting a record
  const resetValues = () => {
    setIsIncome(false);
    nameRef.current.clear();
    amountRef.current.clear();
    setTime(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.contentArea}>
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
        <View style={[styles.inputBoxContainer, styles.underline]}>
          <Text style={styles.inputTitle}>Name</Text>
          <TextInput
            ref={nameRef}
            style={styles.inputField}
            placeholder="Press to enter name"
            onChangeText={(name) => setName(name)}
          />
        </View>
        {/* Input field for amount */}
        <View style={[styles.inputBoxContainer, styles.underline]}>
          <Text style={styles.inputTitle}>Amount</Text>
          <TextInput
            ref={amountRef}
            style={styles.inputField}
            keyboardType="numeric"
            placeholder="Press to enter amount"
            onChangeText={(amount) => setAmount(amount)}
          />
        </View>
        {/* Input field for date and time */}
        <View style={styles.inputBoxContainer}>
          <Text style={styles.inputTitle}>Time & Date</Text>
          <Button
            title={
              time == null
                ? "Press to select Time & Date"
                : formatDateTime(time)
            }
            onPress={() => setDatePickerVisible(true)}
          />
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={() => setDatePickerVisible(false)}
            display="inline"
          />
        </View>
        {/* Input field for transaction type */}
        <View style={styles.inputBoxContainer}>
          <Text style={styles.inputTitle}>Type</Text>
          <SelectList
            data={allTypes}
            save="value"
            setSelected={(value) => setCategory(value)}
            placeholder="Press to select type"
            search={false}
            maxHeight={windowHeight * 0.2}
            inputStyles={styles.inputField}
            dropdownTextStyles={styles.inputTitle}
          />
        </View>
        {/* Input field for recurring transaction */}
        <View style={[styles.inputBoxContainer, styles.row]}>
          <Text style={styles.inputTitle}>Recurring Record</Text>
          <Switch
            onValueChange={() => setIsRecurring(!isRecurring)}
            value={isRecurring}
          />
        </View>
        {/* Input field for recurring type */}
        {isRecurring && (
          <View style={styles.inputBoxContainer}>
            <Text style={styles.inputTitle}>Recurring Frequency</Text>
            <SelectList
              data={recurringFreqs}
              save="value"
              setSelected={(value) => setRecurringFreq(value)}
              placeholder="Press to select frequency"
              search={false}
              maxHeight={windowHeight * 0.2}
              inputStyles={styles.inputField}
              dropdownTextStyles={styles.inputTitle}
            />
          </View>
        )}
        {/* Button to add transaction */}
        <View>
          <Button
            title="Add Record"
            onPress={() => {
              createRecord(name, category, amount, time, isIncome);
              resetValues();
            }}
          />
        </View>
        {/* Debug */}
        {/* <View style={styles.inputBoxContainer}> */}
        {/*   <Text style={styles.inputTitle}>Debug</Text> */}
        {/*   <Text style={styles.inputTitle}> */}
        {/*     It is {isIncome ? "Income" : "Expense"} */}
        {/*   </Text> */}
        {/*   <Text style={styles.inputTitle}>name = {name}</Text> */}
        {/*   <Text style={styles.inputTitle}> */}
        {/*     amount = {amount * (2 * isIncome - 1)} */}
        {/*   </Text> */}
        {/*   <Text style={styles.inputTitle}> */}
        {/*     date time = {formatDateTime(time)} */}
        {/*   </Text> */}
        {/*   <Text style={styles.inputTitle}>type = {category}</Text> */}
        {/* </View> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentArea: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
  },
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
  },
  inputBoxContainer: {
    width: componentWidth,
    marginVertical: windowHeight * 0.01,
  },
  underline: {
    borderBottomWidth: 1,
  },
  inputTitle: {
    fontSize: fontSize,
    color: "black",
    marginVertical: 5,
  },
  inputField: {
    fontSize: fontSize * 1.2,
    color: "black",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default AddScreen;
