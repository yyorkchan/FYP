import { React, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import SwitchToggle from "react-native-switch-toggle";
import { SelectList } from "react-native-dropdown-select-list";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateTime, createRecord } from './util'

// Declare UI size constants
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const componentWidth = windowWidth * 0.8;
const toggleWidth = componentWidth;
const toggleHeight = Math.max(windowHeight * 0.04, 40);

const fontSize = Math.min(windowWidth, windowHeight) * 0.045;

const AddScreen = ({ navigation }) => {
  // Switch on = income, off = expense
  const [isIncome, setIsIncome] = useState(false);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);

  const [time, setTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleConfirm = (time) => {
    setTime(time);
    setDatePickerVisible(false);
  };

  const [category, setCategory] = useState([]);
  const allTypes = [
    { key: "1", value: "Entertainment" },
    { key: "2", value: "Education" },
    { key: "3", value: "Food" },
    { key: "4", value: "Transport" },
    { key: "5", value: "Travel" },
    { key: "6", value: "Shopping" },
    { key: "7", value: "Others" },
  ];

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
            style={styles.inputField}
            placeholder="Press to enter name"
            onChangeText={(name) => setName(name)}
          />
        </View>
        {/* Input field for amount */}
        <View style={[styles.inputBoxContainer, styles.underline]}>
          <Text style={styles.inputTitle}>Amount</Text>
          <TextInput
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
        {/* Button to add transaction */}
        <View>
          <Button
            title="Add Record"
            onPress={() => createRecord(name, category, amount, time, isIncome)}
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
  scrollContainer: {
    flexGrow: 1,
  },
});

export default AddScreen;
