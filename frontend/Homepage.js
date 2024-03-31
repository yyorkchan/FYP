import { React, useState, useEffect, createRef } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { allTypes } from "./AddScreen";
import {
  getData,
  deleteRecord,
  formatDateTime,
  formatShortDateTime,
} from "../util/helper";
import {
  filterTransactionAmount,
  filterTransactionTime,
  filterTransactionCategory,
  filterTransactionName,
  sortTransactions,
} from "../util/filterSort";
import {
  commonStyles,
  windowHeight,
  fontSize,
  lightGray,
  darkGray,
  lightBlue,
  paleBlue,
} from "./style";

const HomeScreen = ({
  navigation,
  isRecordAdded,
  unsetRecordAdded,
  transactions,
  setTransactions,
}) => {

  const newType = [{ key: "1", value: "All" }]
  const homeTypes = newType.concat(allTypes)

  // Reactive states
  const filterValueRef = createRef();
  const filterNameRef = createRef();

  const [totalBalance, setTotalBalance] = useState(0);
  // External storage for displaying transactions
  const [displayTransactions, setDisplayTransactions] = useState(null);
  const [sortType, setSortType] = useState("Recent"); // ["Recent", "Amount", "Category"]
  const [sortOrder, setSortOrder] = useState("Ascending"); // ["Ascending", "Descending"]
  const [recordNumber, setRecordNumber] = useState(5);

  // States for filtering
  const [filterOn, setFilterOn] = useState(false);
  const [filterAmountType, setFilterAmountType] = useState("=");
  const [filterAmountValue, setFilterAmountValue] = useState(null);
  const [filterAmountMin, setFilterAmountMin] = useState(null);
  const [filterAmountMax, setFilterAmountMax] = useState(null);
  const [filterStartTime, setFilterStartTime] = useState(null);
  const [filterEndTime, setFilterEndTime] = useState(null);

  const [isFilterStartVisible, setFilterStartVisible] = useState(false);
  const [isFilterEndVisible, setFilterEndVisible] = useState(false);

  const [filterCategory, setFilterCategory] = useState(null);

  const [filterName, setFilterName] = useState(null);

  const handleFilterStart = (time) => {
    setFilterStartTime(time);
    setFilterStartVisible(false);
  };

  const handleFilterEnd = (time) => {
    setFilterEndTime(time);
    setFilterEndVisible(false);
  };

  const updateTotalBalance = (transactions) => {
    // Calculate total balance over all transactions
    total = transactions.reduce(
      (acc, transaction) => acc + transaction.amount,
      0,
    );
    setTotalBalance(total);
  };

  const handleDeleteTransaction = (transaction) => {
    const buttons = [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete This Record",
        style: "destructive",
        // Call deleteRecord function to delete the transaction
        onPress: () => {
          deleteRecord(transaction, setTransactions);
        },
      },
    ];

    if (transaction.is_recurring) {
      buttons.push({
        text: "Delete All Recurring Records",
        style: "destructive",
        // Call deleteRecord function to delete all recurring transaction
        onPress: () => {
          transaction.is_recurring = false; // Magic
          deleteRecord(transaction, setTransactions);
        },
      });
    }

    Alert.alert(
      "Delete Transaction",
      `Are you sure you want to delete the transaction: ${transaction.name}?`,
      buttons,
    );
  };

  const nextSortType = (sortType) => {
    if (sortType === "Recent") {
      setSortType("Amount");
    } else if (sortType === "Amount") {
      setSortType("Category");
    } else if (sortType === "Category") {
      setSortType("Recent");
    }
  };

  const nextRecordNumber = (recordNumber) => {
    if (recordNumber === 5) {
      setRecordNumber(10);
    } else if (recordNumber === 10) {
      setRecordNumber(20);
    } else if (recordNumber === 20) {
      setRecordNumber("all");
    } else if (recordNumber === "all") {
      setRecordNumber(5);
    }
  };

  const nextFilterAmountType = (filterAmountType) => {
    if (filterAmountType === "=") {
      setFilterAmountType("<");
    } else if (filterAmountType === "<") {
      setFilterAmountType(">");
    } else if (filterAmountType === ">") {
      setFilterAmountType("between");
    } else if (filterAmountType === "between") {
      setFilterAmountType("=");
    }
  };

  const resetFilter = () => {
    setFilterAmountType("=");
    setFilterAmountValue(null);
    if (filterValueRef.current != null) filterValueRef.current.clear();
    setFilterAmountMin(null);
    setFilterAmountMax(null);
    setFilterStartTime(null);
    setFilterEndTime(null);
    setFilterCategory(null);
    setFilterName(null);
    filterNameRef.current.clear();
  };

  // Get records from database on page load
  useEffect(() => {
    getData(setTransactions);
    // console.log(transactions);
  }, []);

  useEffect(() => {
    if (isRecordAdded) {
      // console.log("Record added");
      getData(setTransactions);
      unsetRecordAdded();
    }
  }, [isRecordAdded]);

  // Update displayTransactions when transactions are updated
  // Or sortType/sortOrder/recordNumber are changed
  useEffect(() => {
    if (transactions != null) {
      filteredData = filterTransactionAmount(
        transactions,
        filterAmountType,
        filterAmountValue,
        filterAmountMin,
        filterAmountMax,
      );
      filteredData = filterTransactionTime(
        filteredData,
        filterStartTime,
        filterEndTime,
      );
      filteredData = filterTransactionCategory(filteredData, filterCategory);
      filteredData = filterTransactionName(filteredData, filterName);
      sortedData = sortTransactions(filteredData, sortType, sortOrder);
      if (recordNumber == "all") {
        setDisplayTransactions(sortedData);
      } else {
        setDisplayTransactions(sortedData.slice(0, recordNumber));
      }
    }
  }, [
    transactions,
    sortType,
    sortOrder,
    recordNumber,
    filterOn,
    filterAmountType,
    filterAmountValue,
    filterAmountMin,
    filterAmountMax,
    filterStartTime,
    filterEndTime,
    filterCategory,
    filterName,
  ]);

  // Update total balance when transactions are updated
  useEffect(() => {
    if (transactions != null) updateTotalBalance(transactions);
  }, [transactions]);

  return (
    <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
      <View style={commonStyles.contentArea}>
        <Text style={commonStyles.title}>FYP Finance App</Text>
        {transactions == null || displayTransactions == null ? (
          <>
            {/* Renders the loading screen */}
            <ActivityIndicator size="large" color={lightBlue} />
            <Text style={commonStyles.title}>Loading...</Text>
          </>
        ) : (
          <>
            {/* Renders the total balance */}
            <View style={styles.totalBalanceContainer}>
              <Text style={styles.totalBalanceText}>
                Total Balance: ${totalBalance.toFixed(1)}
              </Text>
            </View>
            {/* Renders the 1st line of toolbar */}
            <View style={commonStyles.rowBar}>
              <Text style={commonStyles.inputTitle}>Sort by</Text>
              <TouchableOpacity
                onPress={() => {
                  nextSortType(sortType);
                }}
              >
                <Text style={commonStyles.button}>{sortType}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  sortOrder === "Ascending"
                    ? setSortOrder("Descending")
                    : setSortOrder("Ascending");
                }}
              >
                {sortOrder === "Ascending" ? (
                  <MaterialCommunityIcons
                    name="arrow-up"
                    size={fontSize * 2}
                    color={lightBlue}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="arrow-down"
                    size={fontSize * 2}
                    color={lightBlue}
                  />
                )}
              </TouchableOpacity>
            </View>
            {/* Render the 2nd line of toolbar*/}
            <View style={commonStyles.rowBar}>
              <Text style={commonStyles.inputTitle}>Number of records</Text>
              <TouchableOpacity
                onPress={() => {
                  nextRecordNumber(recordNumber);
                }}
              >
                <Text style={commonStyles.button}>
                  {recordNumber.toString()}
                </Text>
              </TouchableOpacity>
              {/* Toggle for filtering */}
              <TouchableOpacity
                onPress={() => {
                  setFilterOn(!filterOn);
                }}
              >
                <MaterialCommunityIcons
                  name="filter"
                  size={fontSize * 2}
                  color={lightBlue}
                />
              </TouchableOpacity>
            </View>
            {/* Input field for filter amount */}
            {filterOn && (
              <>
                <View style={commonStyles.rowBar}>
                  <Text style={commonStyles.inputTitle}>Amount</Text>
                  <TouchableOpacity
                    onPress={() => {
                      nextFilterAmountType(filterAmountType);
                    }}
                  >
                    <Text style={commonStyles.button}>{filterAmountType}</Text>
                  </TouchableOpacity>
                  {filterAmountType !== "between" ? (
                    <TextInput
                      ref={filterValueRef}
                      style={[commonStyles.inputField, commonStyles.underline]}
                      placeholder="Value"
                      onChangeText={(value) => setFilterAmountValue(value)}
                    />
                  ) : (
                    <>
                      <TextInput
                        style={[
                          commonStyles.inputField,
                          commonStyles.underline,
                        ]}
                        placeholder="MIN"
                        onChangeText={(value) => setFilterAmountMin(value)}
                      />
                      <TextInput
                        style={[
                          commonStyles.inputField,
                          commonStyles.underline,
                        ]}
                        placeholder="MAX"
                        onChangeText={(value) => setFilterAmountMax(value)}
                      />
                    </>
                  )}
                </View>
                {/* Input field for filter time */}
                <View style={commonStyles.rowBar}>
                  <Text style={commonStyles.inputTitle}>From</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setFilterStartVisible(true);
                    }}
                  >
                    <Text style={commonStyles.button}>
                      {filterStartTime == null
                        ? "Start time"
                        : formatDateTime(filterStartTime)}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isFilterStartVisible}
                    mode="datetime"
                    onConfirm={handleFilterStart}
                    onCancel={() => setFilterStartVisible(false)}
                    display="inline"
                  />
                </View>
                <View style={commonStyles.rowBar}>
                  <Text style={commonStyles.inputTitle}>To</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setFilterEndVisible(true);
                    }}
                  >
                    <Text style={commonStyles.button}>
                      {filterEndTime == null
                        ? "End time"
                        : formatDateTime(filterEndTime)}
                    </Text>
                  </TouchableOpacity>
                  <DateTimePickerModal
                    isVisible={isFilterEndVisible}
                    mode="datetime"
                    onConfirm={handleFilterEnd}
                    onCancel={() => setFilterEndVisible(false)}
                    display="inline"
                  />
                </View>
                {/* Input field for filter category */}
                <View style={commonStyles.inputBoxContainer}>
                  <Text style={commonStyles.inputTitle}>Filter type</Text>
                  <SelectList
                    data={homeTypes}
                    save="value"
                    setSelected={(value) => setFilterCategory(value)}
                    placeholder="All"
                    search={true}
                    maxHeight={windowHeight * 0.2}
                    inputStyles={commonStyles.inputField}
                    dropdownTextStyles={commonStyles.inputTitle}
                  />
                </View>
                {/* Input field for filter name */}
                <View style={commonStyles.inputBoxContainer}>
                  <Text style={commonStyles.inputTitle}>Filter name</Text>
                  <TextInput
                    ref={filterNameRef}
                    style={[commonStyles.inputField, commonStyles.underline]}
                    placeholder="Filter containing name"
                    onChangeText={(value) => setFilterName(value)}
                  />
                </View>
                {/* Reset button */}
                <TouchableOpacity onPress={resetFilter}>
                  <Text style={commonStyles.button}>Reset</Text>
                </TouchableOpacity>
              </>
            )}
            {/* Renders the display transactions */}
            {displayTransactions.map((transaction, index) => (
              <TouchableOpacity
                key={index}
                style={styles.transactionContainer}
                // Delete transaction on long press
                onLongPress={() => {
                  handleDeleteTransaction(transaction);
                }}
              >
                <View style={styles.topTransactionBar}>
                  <Text style={styles.largeTransactionText}>
                    {transaction.name}
                  </Text>
                  <Text style={styles.largeTransactionText}>
                    ${transaction.amount}
                  </Text>
                </View>
                <View style={styles.bottomTransactionBar}>
                  <Text style={styles.smallTransactionText}>
                    {transaction.category}
                  </Text>
                  <Text style={styles.smallTransactionText}>
                    {formatShortDateTime(transaction.time)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  totalBalanceContainer: {
    alignSelf: "center",
    alignItems: "center",
    width: "80%",
    padding: fontSize * 0.6,
    backgroundColor: lightGray,
    borderWidth: fontSize * 0.05,
    borderColor: paleBlue,
    borderRadius: fontSize * 0.5,
    marginBottom: fontSize * 0.5,
  },
  totalBalanceText: {
    fontSize: fontSize * 1.2,
    fontWeight: "bold",
  },
  recentTransactions: {
    fontSize: fontSize * 1.2,
    fontWeight: "bold",
    marginBottom: fontSize,
    marginTop: fontSize,
  },
  transactionContainer: {
    width: "80%",
    marginBottom: fontSize * 0.5,
    padding: fontSize * 0.5,
    backgroundColor: lightGray,
    borderWidth: fontSize * 0.05,
    borderColor: paleBlue,
    borderRadius: fontSize * 0.5,
  },
  topTransactionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: fontSize * 0.25,
  },
  bottomTransactionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginTop: fontSize * 0.25,
  },
  largeTransactionText: {
    fontSize: fontSize,
    fontWeight: "bold",
    flexWrap: "wrap",
    maxWidth: "80%",
  },
  smallTransactionText: {
    fontSize: fontSize * 0.9,
    fontWeight: "bold",
    flexWrap: "wrap",
    color: darkGray,
  },
});

export default HomeScreen;
