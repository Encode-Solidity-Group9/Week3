import { ethers, network } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import { Provider } from "@ethersproject/providers";
import * as dotenv from 'dotenv'

dotenv.config()

const TOKEN_MINT_VALUE = ethers.utils.parseEther("10");

async function main() {
    // yarn run ts-node --files .\scripts\Delegate.ts 0 "0x01592c6e3d8eF0499D9E438Ca4a47e3709208202" ""

    let provider: Provider;
    const gasPrice = 11000000000;

    const args = process.argv;
    const accIndex = args[2];
    const addressTo = args[3];
    const tokenContractAddress = args[4];

    provider = ethers.provider;

    let account = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", "m/44'/60'/0'/0/" + accIndex).connect(provider);
    await network.provider.send("hardhat_setBalance", [
            account.address,
            "0x1000000000000000",
          ]);
    console.log(account.address);

    // DELETE LATER ON - ONLY FOR TESTING
    // USE tokenContractFactory.attach() INSTEAD
    let tokenContractFactory = new MyToken__factory(account);
    let tokenContract = await tokenContractFactory.deploy({gasPrice: gasPrice});
    await tokenContract.deployed();
    console.log(`\nThe contract is deployed.`);
    console.log(`Contract address: ${tokenContract.address}`);
    console.log(`Minter address: ${account.address}`);

    console.log(`\nMinting ${ethers.utils.formatEther(TOKEN_MINT_VALUE)} Tokens to address: ${account.address}`);
    let mintTx = await tokenContract.mint(account.address, TOKEN_MINT_VALUE);
    await mintTx.wait();
    console.log("Minting done");
    // END OF DELETE

    let balanceDelegator = await tokenContract.balanceOf(account.address);
    console.log(`\nToken Balance of the delegator: ${ethers.utils.formatEther(balanceDelegator)} - ${account.address}`);
    
    let balanceDelegated = await tokenContract.balanceOf(addressTo);
    console.log(`\nToken Balance of the delegated: ${ethers.utils.formatEther(balanceDelegated)} - ${addressTo}`);
    
    let votePower = await tokenContract.getVotes(addressTo);
    console.log(`\nVote Power of the delegated before delegation: ${ethers.utils.formatEther(votePower)} - ${addressTo}`);

    let tx = await tokenContract.delegate(addressTo);
    await tx.wait();
    console.log("Delegation tx finished.");

    votePower = await tokenContract.getVotes(addressTo);
    console.log(`\nVote Power of the delegated after delegation: ${ethers.utils.formatEther(votePower)} - ${addressTo}`);
}



main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});