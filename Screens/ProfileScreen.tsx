import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, Button } from 'react-native'
import React, { useState } from 'react'
import PrimaryButton from '../components/PrimaryButton'
import globalStyle from '../utils/globalStyles'

import walletState from '../states/WalletState';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionListData } from 'react-native';
import { handleCopyToClipboard, showAlert } from '../utils/utils';
import { WalletHelper, WalletType } from '../wallets/Wallet';
import { observer } from 'mobx-react';
import { ScrollView } from 'react-native-gesture-handler';



const ProfileScreen = observer(() => {

  const [privateKey, setPrivateKey] = useState<string | null>(null)
  const [isKeyboardVisible, setKeyboardVisibility] = useState<boolean>(false)

  const handleCopy = async (text: string) => {
    let res = await handleCopyToClipboard(text)
    if (res) {
      showAlert('Copied to Clipboard', 'The text has been copied to the clipboard.')
    }
  };

  const handleSeePrivateKey = async () => {
    if (walletState.wallet) {
      const privateKey = await walletState.wallet.getPrivateKey() ?? "N/A"
      showAlert('Pivate Key',
        privateKey,
        [
          { text: 'Copy', onPress: () => handleCopy(privateKey) },
          { text: 'Close' },
        ],
        { cancelable: true })
    }
  };

  const switchToBitcoin = () => {
    importWallet(WalletType.Bitcoin)
  }

  const switchToPolygon = () => {
    importWallet(WalletType.Polygon)
  }


  const importWallet = (selectedWalletType: string) => {
    if (!privateKey) {
      showAlert("Please Enter Private Key")
      return;
    }

    const wallet = WalletHelper.importWallet(selectedWalletType, privateKey)
    if (wallet) {
      walletState.setWallet(wallet)
      showAlert("Wallet Switched")
      setPrivateKey("")
    } else {
      showAlert("Failed To Import Wallet")
    }
  }

  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardVisibility(true)
  })

  Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardVisibility(false)
  })

  return (
    <View style={styles.container}>
      <Text style={styles.settingsTitle}>Settings</Text>

      <ScrollView style={{ flex: 1 }}>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Wallet Information</Text>
          <View style={{ flexDirection: 'column', justifyContent: 'space-between', ...styles.itemContainer }}>
            <Text style={styles.itemTitle}>Wallet Address</Text>
            <Text style={styles.itemValue}>{walletState.wallet?.address ?? "N/A"}</Text>

            <Text style={styles.itemTitle}>Balance</Text>
            <Text style={styles.itemValue}>{walletState.wallet?.balance ?? "N/A"}</Text>
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Actions</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...styles.itemContainer }}>
            <Text style={styles.itemTitle}>See Private Key</Text>
            <TouchableOpacity onPress={handleSeePrivateKey}>
              <MaterialCommunityIcons name="eye" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Switch</Text>
          <View style={{ flexDirection: 'column', justifyContent: 'space-between', ...styles.itemContainer }}>
            {walletState.wallet?.type === WalletType.Bitcoin ? <Text style={styles.itemTitle}>Switch To Polygon</Text>
              : <Text style={styles.itemTitle}>Switch To Bitcoin</Text>}
            <TextInput value={privateKey || ""} placeholder='Enter Private Key' onChangeText={(text) => setPrivateKey(text)} style={{
              marginTop: 10,
              ...globalStyle.input,
            }} />
            {walletState.wallet?.type === WalletType.Bitcoin ?
              <PrimaryButton title='Switch' onPress={switchToPolygon} />
              : <PrimaryButton title='Switch' onPress={switchToBitcoin} />}
          </View>
        </View>

      </ScrollView>

      {!isKeyboardVisible ?
        <TouchableOpacity style={styles.logoutBtn} onPress={() => walletState.reset()} activeOpacity={0.7}>
          <Text style={styles.btntxt}>Logout</Text>
        </TouchableOpacity>
        : <></>}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 32,
    margin: 10,
  },
  section: {
    marginTop: 20,
    borderTopWidth: 0.5,
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    borderRadius: 5,
    marginVertical: 10,
  },
  itemTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  itemValue: {
    fontSize: 16,
    color: '#555',
  },
  logoutBtn: {
    width: "100%",
    marginVertical: 5,
    backgroundColor: "red",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  btntxt: {
    color: "white",
    textAlign: "center",
  }
});

export default ProfileScreen