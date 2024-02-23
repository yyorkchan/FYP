import { React, useState, useEffect, createRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
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
} from "./util";
import { commonStyles, windowHeight, fontSize } from "./style";

const HomeScreen = ({ navigation }) => {
  // Reactive states
  const filterValueRef = createRef();
  const filterNameRef = createRef();

  const [totalBalance, setTotalBalance] = useState(0);
  // Internal storage for all transactions
  const [transactions, setTransactions] = useState(null);
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

  const filterAmountTypes = [
    { key: "1", value: "=" },
    { key: "2", value: "<" },
    { key: "3", value: ">" },
    { key: "4", value: "between" },
  ];

  const handleFilterStart = (time) => {
    setFilterStartTime(time);
    setFilterStartVisible(false);
  };

  const handleFilterEnd = (time) => {
    setFilterEndTime(time);
    setFilterEndVisible(false);
  };

  const filterTransactionAmount = (
    transactions,
    filterAmountType,
    filterAmountValue,
    filterAmountMin,
    filterAmountMax,
  ) => {
    if (
      filterAmountType == null ||
      (filterAmountType !== "between" && filterAmountValue == null) ||
      (filterAmountType === "between" &&
        (filterAmountMin == null || filterAmountMax == null))
    )
      return transactions;
    else if (filterAmountType === "=") {
      return transactions.filter(
        (transaction) => transaction.amount == filterAmountValue,
      );
    } else if (filterAmountType === "<") {
      return transactions.filter(
        (transaction) => transaction.amount < filterAmountValue,
      );
    } else if (filterAmountType === ">") {
      return transactions.filter(
        (transaction) => transaction.amount > filterAmountValue,
      );
    } else if (filterAmountType === "between") {
      return transactions.filter(
        (transaction) =>
          transaction.amount >= filterAmountMin &&
          transaction.amount <= filterAmountMax,
      );
    }
  };

  const filterTransactionTime = (
    transactions,
    filterStartTime,
    filterEndTime,
  ) => {
    if (filterStartTime == null || filterEndTime == null) return transactions;
    return transactions.filter(
      (transaction) =>
        new Date(transaction.time) >= filterStartTime &&
        new Date(transaction.time) <= filterEndTime,
    );
  };

  const filterTransactionCategory = (transactions, filterCategory) => {
    if (filterCategory == null) return transactions;
    return transactions.filter(
      (transaction) => transaction.category === filterCategory,
    );
  };

  const filterTransactionName = (transactions, filterName) => {
    if (filterName == null) return transactions;
    return transactions.filter((transaction) =>
      transaction.name.toLowerCase().includes(filterName.toLowerCase()),
    );
  };

  const updateTotalBalance = (transactions) => {
    let total = 0;
    for (let transaction of transactions) {
      total += transaction.amount;
    }
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

  const sortTransactions = (transactions, sortType, sortOrder) => {
    if (sortType === "Recent") {
      sortedData = [...transactions].sort((a, b) => {
        return sortOrder === "Ascending"
          ? new Date(a.time) - new Date(b.time)
          : new Date(b.time) - new Date(a.time);
      });
    } else if (sortType === "Amount") {
      sortedData = [...transactions].sort((a, b) => {
        return sortOrder === "Ascending"
          ? a.amount - b.amount
          : b.amount - a.amount;
      });
    } else if (sortType === "Category") {
      sortedData = [...transactions].sort((a, b) => {
        return sortOrder === "Ascending"
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      });
    }
    return sortedData;
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
    <ScrollView
      contentContainerStyle={commonStyles.scrollContainer}
      onScroll={() => {
        getData(setTransactions);
      }}
      scrollEventThrottle={500}
    >
      <View style={commonStyles.contentArea}>
        <Text style={styles.title}>FYP Finance App</Text>
        {displayTransactions == null ? (
          <>
            {/* Renders the loading screen */}
            <ActivityIndicator size="large" color="#add8e6" />
            <Text style={styles.title}>Loading...</Text>
          </>
        ) : (
          <>
            {/* Renders the total balance */}
            <View style={styles.totalBalanceContainer}>
              <Text style={styles.totalBalanceText}>
                Total Balance: ${totalBalance.toFixed(1)}
              </Text>
            </View>
            {/* Renders the toolbar */}
            <View style={commonStyles.rowBar}>
              <Text style={commonStyles.inputTitle}>Sort by</Text>
              <Button
                title={sortType}
                onPress={() => {
                  nextSortType(sortType);
                }}
              />
              <Button
                title={sortOrder}
                onPress={() => {
                  sortOrder === "Ascending"
                    ? setSortOrder("Descending")
                    : setSortOrder("Ascending");
                }}
              />
            </View>
            <View style={commonStyles.rowBar}>
              <Text style={commonStyles.inputTitle}>Number of records</Text>
              <Button
                title={recordNumber.toString()}
                onPress={() => {
                  nextRecordNumber(recordNumber);
                }}
              />
              {/* Toggle for filtering */}
              <TouchableOpacity
                onPress={() => {
                  setFilterOn(!filterOn);
                }}
              >
                <MaterialCommunityIcons
                  name="filter"
                  size={fontSize * 2}
                  color="blue"
                />
              </TouchableOpacity>
            </View>
            {/* Input field for filter amount */}
            {filterOn && (
              <View style={commonStyles.inputBoxContainer}>
                <View style={commonStyles.rowBar}>
                  <SelectList
                    data={filterAmountTypes}
                    save="value"
                    setSelected={(value) => setFilterAmountType(value)}
                    placeholder="="
                    search={false}
                    maxHeight={windowHeight * 0.2}
                    inputStyles={commonStyles.inputField}
                    dropdownTextStyles={commonStyles.inputTitle}
                  />
                  {filterAmountType !== "between" && (
                    <TextInput
                      ref={filterValueRef}
                      style={commonStyles.inputField}
                      placeholder="Amount value"
                      onChangeText={(value) => setFilterAmountValue(value)}
                    />
                  )}
                </View>
                {filterAmountType === "between" && (
                  <View style={commonStyles.rowBar}>
                    <TextInput
                      style={commonStyles.inputField}
                      placeholder="Minimum"
                      onChangeText={(value) => setFilterAmountMin(value)}
                    />
                    <TextInput
                      style={commonStyles.inputField}
                      placeholder="Maximun"
                      onChangeText={(value) => setFilterAmountMax(value)}
                    />
                  </View>
                )}
                {/* Input field for filter time */}
                <View style={commonStyles.inputBoxContainer}>
                  <Text style={commonStyles.inputTitle}>From</Text>
                  <Button
                    title={
                      filterStartTime == null
                        ? "Filter start time"
                        : formatDateTime(filterStartTime)
                    }
                    onPress={() => setFilterStartVisible(true)}
                  />
                  <DateTimePickerModal
                    isVisible={isFilterStartVisible}
                    mode="datetime"
                    onConfirm={handleFilterStart}
                    onCancel={() => setFilterStartVisible(false)}
                    display="inline"
                  />
                  <Text style={commonStyles.inputTitle}>To</Text>
                  <Button
                    title={
                      filterEndTime == null
                        ? "Filter end time"
                        : formatDateTime(filterEndTime)
                    }
                    onPress={() => setFilterEndVisible(true)}
                  />
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
                    data={allTypes}
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
                    style={commonStyles.inputField}
                    placeholder="Filter containing name"
                    onChangeText={(value) => setFilterName(value)}
                  />
                </View>
                {/* Reset button */}
                <Button title="Reset" onPress={resetFilter} />
              </View>
            )}
            {/* Renders the display transactions */}
            <Text style={styles.recentTransactions}>Transactions</Text>
            {displayTransactions.map((transaction, index) => (
              <TouchableOpacity
                key={index}
                style={styles.transactionContainer}
                // Delete transaction on long press
                onLongPress={() => {
                  handleDeleteTransaction(transaction);
                }}
              >
                <Text style={[styles.largeTransactionText, styles.topLeft]}>
                  {transaction.name}
                </Text>
                <Text style={[styles.largeTransactionText, styles.topRight]}>
                  ${transaction.amount}
                </Text>
                <Text style={[styles.smallTransactionText, styles.bottomLeft]}>
                  {transaction.category}
                </Text>
                <Text style={[styles.smallTransactionText, styles.bottomRight]}>
                  {formatShortDateTime(transaction.time)}
                </Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fontSize * 1.7,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1AA7EC",
  },
  totalBalanceContainer: {
    alignSelf: "center",
    width: "80%",
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#00b4d8",
    borderRadius: 5,
  },
  totalBalanceText: {
    fontSize: fontSize * 1.2,
    fontWeight: "bold",
  },
  recentTransactions: {
    fontSize: fontSize * 1.2,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  transactionContainer: {
    position: "static",
    alignSelf: "center",
    width: "80%",
    height: Math.max(windowHeight * 0.1, 75),
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderWidth: 1,
    borderColor: "#00b4d8",
    borderRadius: 5,
  },
  largeTransactionText: {
    fontSize: fontSize,
    marginBottom: 5,
    fontWeight: "bold",
    flexWrap: "wrap",
  },
  smallTransactionText: {
    fontSize: fontSize * 0.9,
    marginBottom: 5,
    fontWeight: "bold",
    flexWrap: "wrap",
    color: "#808080",
  },
  topLeft: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  topRight: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  bottomLeft: {
    position: "absolute",
    bottom: 10,
    left: 10,
  },
  bottomRight: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default HomeScreen;
