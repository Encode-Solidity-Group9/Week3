import { ethers } from "hardhat";
import { Ballot__factory } from "../typechain-types";
import { Provider } from "@ethersproject/providers";
import * as dotenv from 'dotenv'

dotenv.config()

const TOKEN_MINT_VALUE = ethers.utils.parseEther("10");
const PROPOSALS = ["Raspberry", "Vanilla", "Pistacchio"]

async function main() {
    // yarn run ts-node --files .\scripts\DeployBallot.ts 0 "0xF9de83d41e68d3a15b98Cf3d4656eaf4CF3Aac8B"

    let provider: Provider;

    const args = process.argv;
    const accIndex = args[2];
    let tokenContractAddress = args[3];

    provider = ethers.getDefaultProvider("sepolia", {
            infura: process.env.INFURA_API_KEY,
            alchemy: process.env.ALCHEMY_API_KEY,
            etherscan: process.env.ETHERSCAN_API_KEY,
        });

    let account = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", "m/44'/60'/0'/0/" + accIndex).connect(provider);
    
    
    console.log("Proposals: ");

    PROPOSALS.forEach((element, index) => {
        console.log(`Proposal N. ${index + 1}: ${element}`);
    });

    let targetBlock = await provider.getBlockNumber();

    console.log("\nDeploying Ballot contract");
    const ballotContractFactory = new Ballot__factory(account);
    const ballotContract = await ballotContractFactory.deploy(
        PROPOSALS.map((prop) => ethers.utils.formatBytes32String(prop)), 
        tokenContractAddress,
        targetBlock);
    
    await ballotContract.deployed();
    console.log(`\nThe ballot contract is deployed.`);
    console.log(`\nBallot contract address: ${ballotContract.address}`);
    console.log(`\nTarget block of the ballot contract vote is: ${await ballotContract.targetBlock()}`);
    console.log("\nNow you can vote!");
}



main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});