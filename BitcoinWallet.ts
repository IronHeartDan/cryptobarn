import '@ethersproject/shims';
import { networks, payments } from "bitcoinjs-lib";
import { ECPairFactory } from "ecpair";


export function generateBitcoinWallet(): { privateKey: string; publicKey: string; address: string } | void {
    console.log("Generating...");

    // const ecpair = ECPairFactory(ecc)

    // const keyPair = ECPair.makeRandom({ network: networks.bitcoin });
    // const { privateKey } = keyPair;
    // const publicKey = keyPair.publicKey;
    // const { address } = payments.p2pkh({ pubkey: publicKey, network: networks.bitcoin });

    // return {
    //     privateKey: privateKey.toString('hex'),
    //     publicKey: publicKey.toString('hex'),
    //     address: address || "",
    // };
}