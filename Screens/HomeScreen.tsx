import React from 'react'
import { View, Text, StyleSheet, ButtonProps, TouchableOpacity } from 'react-native'
import walletState from "../states/WalletState";
import { observer } from 'mobx-react';
import { NavigationProp } from '@react-navigation/native';
import globalStyle from '../utils/globalStyles';
import { handleCopyToClipboard, showAlert } from '../utils/utils';
import TileButton from '../components/TileButton';
import Wallet from '../components/Wallet';
import priceStore from '../states/PriceStore';



interface HomeScreenProps {
    navigation: NavigationProp<any>;
}


const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {


    const showReceiveDialog = () => {
        const addresss = walletState.wallet?.address ?? "N/A"
        showAlert('Wallet Address',
            addresss,
            [
                { text: 'Copy', onPress: () => handleCopyToClipboard(addresss) },
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
            <Wallet />
            <View style={{ width: "100%", ...globalStyle.container }}>
                <View style={styles.tileCon}>
                    <TileButton title='Send' onPress={() => {
                        navigation.navigate("SendCrypto")
                    }} />
                    <TileButton title='Receive' onPress={showReceiveDialog} />
                </View>
                <BitcoinBlock />
                <TetherBlock />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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