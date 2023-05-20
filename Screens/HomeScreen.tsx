import React, { useState } from 'react'
import { View, Text, StyleSheet, ButtonProps, TouchableOpacity } from 'react-native'
import WalletState from "../states/WalletState";
import { observer } from 'mobx-react';
import { NavigationProp } from '@react-navigation/native';
import globalStyle from '../utils/globalStyles';
import { handleCopyToClipboard, showAlert } from '../utils/utils';
import TileButton from '../components/TileButton';
import Wallet from '../components/Wallet';
import priceStore from '../states/PriceStore';


const walletState = WalletState.getInstance()

interface HomeScreenProps {
    navigation: NavigationProp<any>;
}


const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {


    const showReceiveDialog = () => {
        showAlert('Wallet Address',
            walletState.wallet?.address,
            [
                { text: 'Copy', onPress: () => handleCopyToClipboard(walletState.wallet!.address!) },
                { text: 'Close' },
            ],
            { cancelable: true })
    }

    const BitcoinBlock = observer(() => (
        <View style={styles.tileCon}>
            <View style={styles.tile}>
                <Text>Bitcoin : {priceStore.btcPrice}</Text>
            </View>
        </View>
    ))

    const TetherBlock = observer(() => (
        <View style={styles.tileCon}>
            <View style={styles.tile}>
                <Text>USDT : {priceStore.usdtPrice}</Text>
            </View>
        </View>
    ))

    return (
        <View style={styles.container}>
            <Text style={globalStyle.logo}>Crypto Barn</Text>
            <Wallet walletState={walletState} />
            <View style={styles.tileCon}>
                <TileButton title='Send' onPress={() => {
                    navigation.navigate("SendCrypto")
                }} />
                <TileButton title='Receive' onPress={showReceiveDialog} />
            </View>
            <BitcoinBlock/>
            <TetherBlock/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
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
    tileCon: {
        marginTop: 10,
        flexDirection: 'row',
        gap: 10,
    },
    tile: {
        flex: 1,
        height: 60,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
})

export default HomeScreen