import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import walletState from '../states/WalletState';
import globalStyle from '../utils/globalStyles';
import { observer } from 'mobx-react';
import { Transaction } from '../wallets/Wallet';



const Transactions = observer(() => {

  const [refreshing, setRefreshing] = useState(false);


  const loadTransactions = async () => {
    setRefreshing(true)
    await walletState.loadTransactions()
    setRefreshing(false)
  }

  useEffect(() => {
    loadTransactions()
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
        data={walletState.wallet?.transactions}
        keyExtractor={(item) => item.hash}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.transactionList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadTransactions} />
        }
      />
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