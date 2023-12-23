import { React, useState, useEffect } from 'react';
import { Button, View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const totalBalance = 1000;
  const [transactions, setTransactions] = useState([])
  // Baseball
  // const IP = '192.168.1.141'
  // York
  const IP = '192.168.0.169'
  const PORT = 3000

  const getData = () => {
    // Change hard code ip to function call
    fetch(`http://${IP}:${PORT}`)
      .then(response => {
        return response.text();
      })
      .then(data => {
        parsedData = JSON.parse(data)
        setTransactions(parsedData);
      });
  }

  const formatTime = (time) => {
    return moment.utc(time).format('MMM DD HH:mm')
  }

  useEffect(() => {
    getData();
  }, []);


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.contentArea}>
        <Text style={styles.title}>FYP Finance App</Text>
        <View style={styles.totalBalanceContainer}>
          <Text style={styles.totalBalanceText}>Total Balance: ${totalBalance}</Text>
        </View>
        <Text style={styles.recentTransactions}>Recent Transactions</Text>
        {transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionContainer}>
            <Text style={[styles.largeTransactionText, styles.topLeft,]}>{transaction.name}</Text>
            <Text style={[styles.largeTransactionText, styles.topRight,]}>${transaction.amount}</Text>
            <Text style={[styles.smallTransactionText, styles.bottomLeft,]}>{transaction.category}</Text>
            <Text style={[styles.smallTransactionText, styles.bottomRight]}>{formatTime(transaction.time)}</Text>
          </View>
        ))}
        <Button
          title="Go to Bubujai Detail Page"
          onPress={() =>
            navigation.navigate('Details', { name: 'BubuJai' })
          }
        />
        <Button title="refresh" onPress={() => getData()} />
      </View>
    </ScrollView>
  );
};
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const fontSize = Math.min(windowWidth, windowHeight) * 0.045;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  title: { fontSize: fontSize * 1.7, fontWeight: 'bold', marginBottom: 20, color: '#1AA7EC' },
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
    fontSize: fontSize * 1.2,
    fontWeight: 'bold',
  },
  recentTransactions: { fontSize: fontSize * 1.2, fontWeight: 'bold', marginBottom: 20, marginTop: 20 },
  transactionContainer: {
    position: 'static',
    alignSelf: 'center',
    width: '80%',
    height: windowHeight * 0.1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#00b4d8',
    borderRadius: 5,
  },
  largeTransactionText: {
    fontSize: fontSize,
    marginBottom: 5,
    fontWeight: 'bold',
    flexWrap: 'wrap',
  },
  smallTransactionText: {
    fontSize: fontSize * 0.9,
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
