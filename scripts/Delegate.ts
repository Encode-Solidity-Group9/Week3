import { ethers, network } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import { Provider } from "@ethersproject/providers";
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
    // yarn run ts-node --files .\scripts\Delegate.ts 0 "0x01592c6e3d8eF0499D9E438Ca4a47e3709208202" "0xF9de83d41e68d3a15b98Cf3d4656eaf4CF3Aac8B"
    // yarn run ts-node --files .\scripts\Delegate.ts 1 "0x01592c6e3d8eF0499D9E438Ca4a47e3709208202" "0xF9de83d41e68d3a15b98Cf3d4656eaf4CF3Aac8B"
    // yarn run ts-node --files .\scripts\Delegate.ts 2 "0x087e1e59594b6f5fC4F3EBd44872ae3fB792653e" "0xF9de83d41e68d3a15b98Cf3d4656eaf4CF3Aac8B"
    
    let provider: Provider;

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
    
    let tokenContractFactory = new MyToken__factory(account);
    let tokenContract = tokenContractFactory.attach(tokenContractAddress);

    let balanceDelegator = await tokenContract.balanceOf(account.address);
    console.log(`Token Balance of the delegator: ${ethers.utils.formatEther(balanceDelegator)} - ${account.address}`);
    
    let balanceDelegated = await tokenContract.balanceOf(addressTo);
    console.log(`Token Balance of the delegated: ${ethers.utils.formatEther(balanceDelegated)} - ${addressTo}`);
    
    let votePower = await tokenContract.getVotes(addressTo);
    console.log(`Vote Power of the delegated before delegation: ${ethers.utils.formatEther(votePower)} - ${addressTo}`);

    let tx = await tokenContract.delegate(addressTo);
    console.log(`\nTransaction Hash: ${tx.hash}`);
    await tx.wait();
    console.log("Delegation tx finished.");

    votePower = await tokenContract.getVotes(addressTo);
    console.log(`\nVote Power of the delegated after delegation: ${ethers.utils.formatEther(votePower)} - ${addressTo}`);
}



main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});