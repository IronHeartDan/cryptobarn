import { View, Text, SectionList, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import PrimaryButton from '../components/PrimaryButton'
import globalStyle from '../utils/globalStyles'

import walletState from '../states/WalletState';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SectionListData } from 'react-native';
import { handleCopyToClipboard, showAlert } from '../utils/utils';



export default function ProfileScreen() {


  interface SectionItem {
    title: string;
    value?: string;
    onPress?: () => void;
  }

  interface Section {
    title: string;
    data: SectionItem[];
  }

  const renderSectionHeader = ({ section: { title } }: { section: Section }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );


  const renderItem = ({ item }: { item: SectionItem }) => (
    <View style={{ flexDirection: item.value ? 'column' : 'row', justifyContent: 'space-between', ...styles.itemContainer }}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      {item.value && <Text style={styles.itemValue}>{item.value}</Text>}
      {item.onPress && <TouchableOpacity onPress={item.onPress}>
        <MaterialCommunityIcons name="eye" size={20} color="#000" />
      </TouchableOpacity>}
    </View>
  );

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

  const handleSeeMnemonic = () => {
    if (walletState.wallet) {
      walletState.wallet.getNmenomic()
      const mnemonic = "N/A"
      showAlert('Mnemonic',
        mnemonic,
        [
          { text: 'Copy', onPress: () => handleCopyToClipboard(mnemonic) },
          { text: 'Close' },
        ],
        { cancelable: true })
    }
  };

  const sections: SectionListData<SectionItem, Section>[] = [
    {
      title: 'Wallet Information',
      data: [
        { title: 'Wallet Address', value: walletState.wallet?.address ?? "N/A" },
        { title: 'Balance', value: walletState.wallet?.balance?.toString() || 'N/A' },
      ],
    },
    {
      title: 'Actions',
      data: [
        { title: 'See Private Key', onPress: handleSeePrivateKey },
      ],
    },
  ];


  return (
    <View style={globalStyle.container}>
      <Text style={styles.settingsTitle}>Settings</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
      />
      <PrimaryButton title='Logout' onPress={() => walletState.reset()} />
    </View>
  )
}

const styles = StyleSheet.create({
  settingsTitle: {
    fontSize: 32,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor:'#fff'
  },
  itemContainer: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  itemTitle: {
    fontSize: 16,
  },
  itemValue: {
    fontSize: 16,
    color: '#555',
  },
});