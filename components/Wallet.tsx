import { Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react';
import walletState from '../states/WalletState';


const Wallet = observer(() => (
    <LinearGradient
        colors={['#FF9800', '#F44336']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.walletCard}
    >
        <Text style={styles.walletBallance}>{walletState.wallet?.balance}</Text>
        <Text style={styles.walletUnit}>MATIC</Text>
    </LinearGradient>
))

const styles = StyleSheet.create({
    walletCard: {
        marginTop: 10,
        width: "100%",
        aspectRatio: 3 / 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    walletBallance: {
        fontWeight: 'bold',
        fontSize: 64,
        color: "#fff"
    },
    walletUnit: {
        fontFamily: "RobotoMono",
        fontSize: 16,
        color: "#fff"
    },
})

export default Wallet