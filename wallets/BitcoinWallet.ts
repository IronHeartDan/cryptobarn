import { networks, payments, Transaction as BitcoinTransaction, Psbt } from "bitcoinjs-lib";
import { ECPairFactory } from "ecpair";
import ecc from "@bitcoinerlab/secp256k1";

import Wallet, { Transaction, WalletType } from "./Wallet";
import { action, makeAutoObservable } from "mobx";
import axios from "axios";

interface BtcWallet {
    address: string;
    privateKey: string;
    publicKey: string;
}


class BitcoinWallet implements Wallet {

    wallet: BtcWallet | null = null

    type: string = WalletType.Bitcoin
    address: string | null = null
    balance: string | null = null
    transactions: Transaction[] = []


    constructor(wallet: BtcWallet) {
        makeAutoObservable(this)
        this.wallet = wallet
        this.address = wallet.address
        this.fetchBalance()
    }

    static createWallet = action((): BtcWallet | null => {
        try {
            const ECPair = ECPairFactory(ecc)
            const keyPair = ECPair.makeRandom({ network: networks.testnet })
            const { privateKey, publicKey } = keyPair
            const { address } = payments.p2pkh({ pubkey: publicKey, network: networks.testnet })

            const wallet = {
                privateKey: privateKey?.toString('hex') || 'N/A',
                publicKey: publicKey.toString('hex') || 'N/A',
                address: address || 'N/A',
            }
            
            return wallet

        } catch (error) {
            console.error("Failed to create wallet:", error)
            return null
        }
    })

    static importWallet = action((privateKeyHex: string): BtcWallet | null => {
        try {

            const ECPair = ECPairFactory(ecc)
            const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKeyHex, 'hex'), { network: networks.testnet });
            const { privateKey, publicKey } = keyPair

            // Create a Bitcoin address using the public key
            const { address } = payments.p2pkh({ pubkey: publicKey, network: networks.testnet });



            const wallet = {
                privateKey: privateKey?.toString('hex') || 'N/A',
                publicKey: publicKey.toString('hex') || 'N/A',
                address: address || 'N/A',
            }


            return wallet

        } catch (error) {
            console.error("Failed to import wallet:", error);
            return null
        }
    })

    getAddress(): void {
        this.address = this.wallet!.address
    }
    getPrivateKey(): string {
        return this.wallet!.privateKey
    }
    getNmenomic(): void {

    }

    async fetchBalance() {
        try {
            console.log("Fetching");
            const response = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${this.address}/balance`);
            const balance = response.data.balance / 1e8; // Convert satoshis to BTC
            this.balance = balance.toString()
            console.log(`Wallet balance: ${balance} BTC`);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    }

    async loadTransactions() {
        try {
            const response = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${this.address}/full`);
            this.transactions = response.data.txs.map((tx: any) => {
                const index = tx.outputs.findIndex((output: any) => output.addresses.includes(this.address))
                return {
                    hash: tx.hash,
                    value: (tx.outputs[index].value / 1e8).toString(),
                    timestamp: tx.received,
                }
            });
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    }

    async sendCrypto(recipientAddress: string, amount: string): Promise<string | null> {

        const txb = new Psbt({ network: networks.testnet })

        const ECPair = ECPairFactory(ecc)

        const keyPair = ECPair.fromPrivateKey(Buffer.from(this.wallet!.privateKey, 'hex'));

        // const payment = payments.p2sh({ redeem: payments.p2wpkh({ pubkey: keyPair.publicKey, network: networks.testnet }) });
        // const redeemScript = payment.redeem?.output;
        // if (!redeemScript || !address) return null;

        const payment = payments.p2pkh({ pubkey: keyPair.publicKey, network: networks.testnet });

        const { address } = payment;

        if (!address) return null


        const response = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${address}/full`);

        const utxos = []
        const tnxs = response.data.txs

        for (let i = 0; i < tnxs.length; i++) {
            const tnx = tnxs[i];


            for (let j = 0; j < tnx.outputs.length; j++) {
                const output = tnx.outputs[j];
                const utxo = {
                    txid: tnx.hash,
                    vout: j,
                    scriptPubKey: output.script,
                    amount: output.value,
                };

                if (!output.spent_by && output.addresses.includes(address!)) {
                    utxos.push(utxo)
                }
            }

        }


        for (const element of utxos) {
            const response = await axios.get(`https://api.blockcypher.com/v1/btc/test3/txs/${element.txid}?includeHex=true`);
            const previousTx = response.data.hex;
            txb.addInput({
                hash: element.txid,
                index: element.vout,
                nonWitnessUtxo: Buffer.from(previousTx, 'hex')
            });
        }

        const senderTotalBalance = response.data.balance

        // const amountToSend = 0.001 * 100000000 // BTC to Satoshis
        const amountToSend = Number.parseFloat(amount) * 100000000 // BTC to Satoshis
        const fee = 0.00001 * 100000000
        const deductions = (amountToSend + fee)
        const change = senderTotalBalance - deductions


        txb.addOutput({
            address: recipientAddress,
            value: amountToSend
        });

        txb.addOutput({
            address: address!,
            value: change
        });


        try {

            txb.signAllInputs(keyPair)
            txb.finalizeAllInputs()

            const rawHex = txb.extractTransaction().toHex();
            console.log("Raw Hex");
            console.log(rawHex);

            const txnResult = await axios.post("https://api.blockcypher.com/v1/btc/test3/txs/push", {
                tx: rawHex
            })

            return txnResult.data.tx.hash

        } catch (error) {
            console.error(error);
            return null
        }

    }

}

export default BitcoinWallet;