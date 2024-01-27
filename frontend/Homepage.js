import { React, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { getData, deleteRecord, formatShortDateTime, fontSize, windowHeight } from "./util";

const HomeScreen = ({ navigation }) => {
  // Reactive states
  const [totalBalance, setTotalBalance] = useState(0);
  const [transactions, setTransactions] = useState(null);

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
      `Are you sure you want to delete the transaction: ${transaction.name}?`, buttons
    );
  };

  // Get records from database on page load
  useEffect(() => {
    getData(setTransactions);
    // console.log(transactions);
  }, []);

  // Update total balance when transactions are updated
  useEffect(() => {
    if (transactions != null) updateTotalBalance(transactions);
  }, [transactions]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      onScroll={() => getData(setTransactions)}
      scrollEventThrottle={500}
    >
      <View style={styles.contentArea}>
        <Text style={styles.title}>FYP Finance App</Text>
        {transactions == null ? (
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
            {/* Renders the most recent 5 transactions */}
            <Text style={styles.recentTransactions}>Recent Transactions</Text>
            {transactions.slice(-5).map((transaction, index) => (
              <TouchableOpacity key={index} style={styles.transactionContainer}
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
            {/* <Button */}
            {/*   title="Go to Bubujai Detail Page" */}
            {/*   onPress={() => */}
            {/*     navigation.navigate('Details', { name: 'BubuJai' }) */}
            {/*   } */}
            {/* /> */}
            {/* <Button title="refresh" onPress={() => {
              getData(setTransactions);
              updateTotalBalance(transactions);
            }} /> */}
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
