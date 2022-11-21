import { ethers, network } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import { Provider } from "@ethersproject/providers";
import * as dotenv from 'dotenv'

dotenv.config()

const TOKEN_MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    // yarn run ts-node --files .\scripts\DistributeTokens.ts 0 "0x01592c6e3d8eF0499D9E438Ca4a47e3709208202" "0xF9de83d41e68d3a15b98Cf3d4656eaf4CF3Aac8B"
    // yarn run ts-node --files .\scripts\DistributeTokens.ts 0 "0x087e1e59594b6f5fC4F3EBd44872ae3fB792653e" "0xF9de83d41e68d3a15b98Cf3d4656eaf4CF3Aac8B"
    // yarn run ts-node --files .\scripts\DistributeTokens.ts 0 "0x1fAA864C0bf78E7fEF5eAfBE0A33Fa7c2586Bdde" "0xF9de83d41e68d3a15b98Cf3d4656eaf4CF3Aac8B"

    let provider: Provider;
    const gasPrice = 2100000000;

    const args = process.argv;
    const accIndex = args[2];
    const addressTo = args[3];
    const tokenContractAddress = args[4];

    provider = ethers.getDefaultProvider("sepolia", {
            alchemy: process.env.ALCHEMY_API_KEY,
            infura: process.env.INFURA_API_KEY,
            etherscan: process.env.ETHERSCAN_API_KEY,
        });

    let account = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", "m/44'/60'/0'/0/" + accIndex).connect(provider);
    
    console.log("Using the account:", account.address);
    
    let tokenContractFactory = new MyToken__factory(account);
    let tokenContract = tokenContractFactory.attach(tokenContractAddress);

    let balanceBefore = await tokenContract.balanceOf(addressTo);
    console.log(`\nToken Balance of the address before minting: ${ethers.utils.formatEther(balanceBefore)} - ${addressTo}`);

    console.log(`\nMinting ${ethers.utils.formatEther(TOKEN_MINT_VALUE)} Tokens to address: ${addressTo}`);
    let tx = await tokenContract.mint(addressTo, TOKEN_MINT_VALUE);
    console.log(`\nTransaction Hash: ${tx.hash}`);
    await tx.wait();
    
    let balanceAfter = await tokenContract.balanceOf(addressTo);
    console.log(`\nToken Balance of the address after minting: ${ethers.utils.formatEther(balanceAfter)} - ${addressTo}`);
}



main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});