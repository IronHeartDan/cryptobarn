import { action, makeAutoObservable } from "mobx";
import Wallet, { WalletHelper, WalletType } from "../wallets/Wallet";
import * as SecureStore from 'expo-secure-store';

const PRIVATE_KEY_KEYCHAIN = 'CRYPRO-BARN-KEYCHAIN';

class WalletState {
    private static instance: WalletState | null = null
    wallet: Wallet | null = null;

    constructor() {
        makeAutoObservable(this)
        this.init()
    }

    public static getInstance(): WalletState {
        if (!WalletState.instance) {
            WalletState.instance = new WalletState();
        }
        return WalletState.instance;
    }

    private async init() {
        const data = await SecureStore.getItemAsync(PRIVATE_KEY_KEYCHAIN)
        if (data) {
            const { type, privateKey } = JSON.parse(data)
            const wallet = WalletHelper.importWallet(type, privateKey)

            if (wallet) {
                walletState.setWallet(wallet)
            }
        }
    }

    private saveKey() {
        SecureStore.setItemAsync(PRIVATE_KEY_KEYCHAIN, JSON.stringify({
            "type": this.wallet?.type,
            "privateKey": this.wallet?.getPrivateKey()!
        }))
    }

    private deleteKey() {
        SecureStore.deleteItemAsync(PRIVATE_KEY_KEYCHAIN)
    }

    setWallet = action((wallet: Wallet) => {
        this.wallet = wallet
        this.saveKey()
    })

    reset = action(() => {
        this.wallet = null
        this.deleteKey()
    })
}

const walletState = WalletState.getInstance()
export default walletState