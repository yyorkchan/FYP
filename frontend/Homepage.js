import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const totalBalance = 1000;
  const recentTransactions = [
    { name: 'Transaction 1', category: 'Food', amount: 10, time: '10:00 AM' },
    { name: 'Transaction 2', category: 'Transportation', amount: 20, time: '11:00 AM' },
    { name: 'Transaction 3', category: 'Shopping', amount: 30, time: '12:00 PM' },
  ];

  return (
    <View style={styles.contentArea}>
      <Text style={styles.title}>FYP Finance App</Text>
      <View style={styles.totalBalanceContainer}>
        <Text style={styles.totalBalanceText}>Total Balance: ${totalBalance}</Text>
      </View>
      <Text style={styles.recentTransactions}>Recent Transactions</Text>
      {recentTransactions.map((transaction, index) => (
        <View key={index} style={styles.transactionContainer}>
          <Text style={[styles.largeTransactionText, styles.topLeft,]}>{transaction.name}</Text>
          <Text style={[styles.largeTransactionText, styles.topRight,]}>${transaction.amount}</Text>
          <Text style={[styles.smallTransactionText, styles.bottomLeft,]}>{transaction.category}</Text>
          <Text style={[styles.smallTransactionText, styles.bottomRight]}>{transaction.time}</Text>
        </View>
      ))}
      <Button
        title="Go to Bubujai Detail Page"
        onPress={() =>
          navigation.navigate('Details', { name: 'BubuJai' })
        }
      />
    </View>
  );
};


const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#1AA7EC' },
  contentArea: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 30,
  },
  totalBalanceContainer: {
    alignSelf: 'center',
    width: '80%',
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#00b4d8',
    borderRadius: 5,
  },
  totalBalanceText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  recentTransactions: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
  transactionContainer: {
    position: 'static',
    alignSelf: 'center',
    width: '80%',
    height: 110,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#00b4d8',
    borderRadius: 5,
  },
  largeTransactionText: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  smallTransactionText: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: 'bold',
    flexWrap: 'wrap',
    color: '#808080',
  },
  topLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  topRight: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});



export default HomeScreen;