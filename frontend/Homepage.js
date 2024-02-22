import { React, useState, useEffect } from "react";
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
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getData,
  deleteRecord,
  formatShortDateTime,
  fontSize,
  windowHeight,
  windowWidth,
} from "./util";

const componentWidth = windowWidth * 0.8;

const HomeScreen = ({ navigation }) => {
  // Reactive states
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

  const filterAmountTypes = [
    { key: "1", value: "=" },
    { key: "2", value: "<" },
    { key: "3", value: ">" },
    { key: "4", value: "between" },
  ];

  const filterTransactionAmount = (
    transactions,
    filterAmountType,
    filterAmountValue,
    filterAmountMin,
    filterAmountMax,
  ) => {
    if (filterAmountType == null || filterAmountValue == null)
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
      setRecordNumber(50);
    } else if (recordNumber === 50) {
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
    setFilterAmountMin(null);
    setFilterAmountMax(null);
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
      sortedData = sortTransactions(filteredData, sortType, sortOrder);
      setDisplayTransactions(sortedData.slice(0, recordNumber));
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
  ]);

  // Update total balance when transactions are updated
  useEffect(() => {
    if (transactions != null) updateTotalBalance(transactions);
  }, [transactions]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      onScroll={() => {
        getData(setTransactions);
      }}
      scrollEventThrottle={500}
    >
      <View style={styles.contentArea}>
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
            <View style={styles.rowBar}>
              <Button
                title={sortType}
                onPress={() => {
                  nextSortType(sortType);
                }}
              />
              <Button
                title={recordNumber.toString()}
                onPress={() => {
                  nextRecordNumber(recordNumber);
                }}
              />
            </View>
            <View style={styles.rowBar}>
              <Button
                title={sortOrder}
                onPress={() => {
                  sortOrder === "Ascending"
                    ? setSortOrder("Descending")
                    : setSortOrder("Ascending");
                }}
              />
              {/* Toggle for filtering */}
              <TouchableOpacity
                onPress={() => {
                  setFilterOn(!filterOn);
                  resetFilter();
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
              <View style={styles.inputBoxContainer}>
                <View style={styles.rowBar}>
                  <SelectList
                    data={filterAmountTypes}
                    save="value"
                    setSelected={(value) => setFilterAmountType(value)}
                    placeholder="="
                    search={false}
                    maxHeight={windowHeight * 0.2}
                    inputStyles={styles.inputField}
                    dropdownTextStyles={styles.inputTitle}
                  />
                  {filterAmountType !== "between" && (
                    <TextInput
                      style={[styles.inputField, styles.underline]}
                      placeholder="Value"
                      onChangeText={(value) => setFilterAmountValue(value)}
                    />
                  )}
                </View>
                {filterAmountType === "between" && (
                  <View style={styles.rowBar}>
                    <TextInput
                      style={[styles.inputField, styles.underline]}
                      placeholder="Minimum"
                      onChangeText={(value) => setFilterAmountMin(value)}
                    />
                    <Text style={styles.inputTitle}>and</Text>
                    <TextInput
                      style={[styles.inputField, styles.underline]}
                      placeholder="Maximun"
                      onChangeText={(value) => setFilterAmountMax(value)}
                    />
                  </View>
                )}
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
  scrollContainer: {
    flexGrow: 1,
  },
  title: {
    fontSize: fontSize * 1.7,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1AA7EC",
  },
  contentArea: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
  },
  rowBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 10,
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
});

export default HomeScreen;
