import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';
import { observer } from 'mobx-react';
import WalletState from '../states/WalletState';

export interface WalletViewProps {
    walletState: WalletState;
}

const Wallet: React.FC<WalletViewProps> = observer(({ walletState }) => (
    <LinearGradient
        colors={['#FF9800', '#F44336']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.walletCard}
    >
        <Text style={styles.walletBallance}>Balance : {walletState.balance}</Text>
        <Text>MATIC</Text>
    </LinearGradient>
))

const styles = StyleSheet.create({
    walletCard: {
        marginTop: 10,
        width: "100%",
        aspectRatio: 3 / 2,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    walletBallance: {
        fontFamily: "RobotoMono",
        fontSize: 24,
    },
})

export default Wallet