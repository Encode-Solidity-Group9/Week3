import { ethers, network } from "hardhat";
import { Ballot__factory, MyToken__factory } from "../typechain-types";
import { Provider } from "@ethersproject/providers";
import * as dotenv from 'dotenv'
import { expect } from "chai";
import { assert } from "console";

dotenv.config()

async function main() {
    // yarn run ts-node --files .\scripts\FinalizeBallot.ts "0x62c6FC7a9f592A6f478E0091f4230770997E013f"


    let provider: Provider;

    const args = process.argv;
    const ballotContractAddress = args[2];

    const accIndex = 0;
    console.log(`ballot address: ${ballotContractAddress}`);

    provider = ethers.getDefaultProvider("sepolia", {
            infura: process.env.INFURA_API_KEY,
            alchemy: process.env.ALCHEMY_API_KEY,
            etherscan: process.env.ETHERSCAN_API_KEY,
        });

    let account = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", "m/44'/60'/0'/0/" + accIndex).connect(provider);
    
    const ballotContractFactory = new Ballot__factory(account);
    const ballotContract = ballotContractFactory.attach(ballotContractAddress);

    let winnerName = await ballotContract.winnerName();
    console.log(`\nWinner is: ${ethers.utils.parseBytes32String(winnerName)}`);
}



main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});