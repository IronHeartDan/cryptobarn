import React, { useEffect, useState } from 'react'
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native'
import WalletState from "../WalletState";
import { observer } from 'mobx-react';
import { LinearGradient } from 'expo-linear-gradient';

interface WalletViewProps {
    walletState: WalletState;
}


const walletState = WalletState.getInstance()

export default function HomeScreen() {

    const [bitCoinPrice, setBitCoinPrice] = useState("")

    useEffect(() => {
        // Establish WebSocket connection
        const socket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');

        // Handle socket open event
        socket.onopen = () => {
            console.log('WebSocket connection established.');
        };

        // Handle incoming messages
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setBitCoinPrice(message.p)
        };

        // Handle socket close event
        socket.onclose = () => {
            console.log('WebSocket connection closed.');
        };

        // Clean up the WebSocket connection on component unmount
        return () => {
            socket.close();
        };
    }, []);


    const WalletView: React.FC<WalletViewProps> = observer(({ walletState }) => (
        <LinearGradient
            colors={['#FF9800', '#F44336']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.walletCard}
        >
            <Text style={styles.walletBallance}>Balance : {walletState.balance}</Text>
        </LinearGradient>
    ))


    return (
        <View style={styles.container}>
            <WalletView walletState={walletState} />
            <Text>Bitcoin : {bitCoinPrice}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
    },
    walletCard: {
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
