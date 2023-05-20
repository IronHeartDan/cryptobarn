import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import WalletState, { Transaction } from '../WalletState';
import globalStyle from '../globalStyles';
import PrimaryButton from '../components/PrimaryButton';
import { observer } from 'mobx-react';

const walletState = WalletState.getInstance()


const Transactions = observer(() => {

  useEffect(() => {
    walletState.fetchTransactionDetails()
  }, [])



  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.transactionAmount}>Amount - {item.value.toString()}</Text>

      <View style={styles.transactionDetails}>
        <Text style={styles.transactionPre}>To - </Text>
        <Text style={styles.transactionTo}>{item.to}</Text>
      </View>

      <View style={styles.transactionDetails}>
        <Text style={styles.transactionPre}>Hash - </Text>
        <Text style={styles.transactionHash}>Hash - {item.hash}</Text>
      </View>

      <Text style={styles.transactionDate}>Time : {item.timestamp}</Text>
    </View>
  );


  return (
    <View style={globalStyle.container}>
      <Text style={styles.transactionTitle}>Transactions</Text>
      <FlatList
        data={walletState.transactions}
        keyExtractor={(item) => item.hash}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.transactionList}
      />
      <PrimaryButton title='Refresh' onPress={() => walletState.loadTransactions()} />
    </View>
  )
})

const styles = StyleSheet.create({
  transactionTitle: {
    fontSize: 32,
    marginBottom: 20,
  },
  transactionList: {
    flexGrow: 1,
  },
  transactionItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  transactionAmount: {
    fontSize: 24,
    marginBottom: 10,
  },
  transactionDetails: {
    marginBottom: 20,
  },
  transactionPre: {
    fontSize: 16,
    marginBottom: 5,
  },
  transactionTo: {
    fontSize: 16,
    color: '#999',
  },
  transactionHash: {
    fontSize: 16,
    color: '#999',
  },
  transactionDate: {
    fontSize: 12,
  },
});

export default Transactions