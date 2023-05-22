import { networks, payments } from "bitcoinjs-lib";
import { ECPairFactory } from "ecpair";
import ecc from "@bitcoinerlab/secp256k1";

import Wallet, { Transaction, WalletType } from "./Wallet";

class BitcoinWallet implements Wallet {
    address: string | null = null
    type: string = WalletType.Bitcoin
    balance: string = ""
    transactions: Transaction[] = []

    createWallet(): void {
        try {
            const ECPair = ECPairFactory(ecc)
            const keyPair = ECPair.makeRandom({ network: networks.testnet });
            const { privateKey } = keyPair;
            const publicKey = keyPair.publicKey;
            const { address } = payments.p2pkh({ pubkey: publicKey, network: networks.testnet });

            console.log({
                privateKey: privateKey?.toString('hex'),
                publicKey: publicKey.toString('hex'),
                address: address || "",
            });

        } catch (error) {
            console.error(error);
        }
    }
    importWallet(): void {
        try {
            const ECPair = ECPairFactory(ecc)
            const privateKeyHex = 'fd4e1b29c5cdf713c8dd327f672ee6e42de2933c8e576c6d0254820e6efc999f';

            // Convert the private key from hexadecimal to a BitcoinJS private key object
            const privateKey = ECPair.fromPrivateKey(Buffer.from(privateKeyHex, 'hex'));

            // Get the public key associated with the private key
            const publicKey = privateKey.publicKey;

            // Create a Bitcoin address using the public key
            const { address } = payments.p2pkh({ pubkey: publicKey, network: networks.testnet });


            console.log({
                privateKey: privateKey,
                publicKey: publicKey,
                address: address,
            });

        } catch (error) {
            console.error(error);
        }
    }

    getAddress(): void {
        throw new Error("Method not implemented.");
    }
    getPrivateKey(): string {
        throw new Error("Method not implemented.");
    }
    getNmenomic(): void {
        throw new Error("Method not implemented.");
    }

    fetchBalance(): void {
        throw new Error("Method not implemented.");
    }
    async loadTransactions(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendCrypto(recipientAddress: string, amountToSend: string): void {
        throw new Error("Method not implemented.");
    }

}

export default BitcoinWallet;