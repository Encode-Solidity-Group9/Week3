import { ethers, network } from "hardhat";
import { Ballot__factory, MyToken__factory } from "../typechain-types";
import { Provider } from "@ethersproject/providers";
import * as dotenv from 'dotenv'
import { expect } from "chai";
import { assert } from "console";

dotenv.config()

async function main() {
    // yarn run ts-node --files .\scripts\Vote.ts 1 "0x62c6FC7a9f592A6f478E0091f4230770997E013f" 0 15
    // yarn run ts-node --files .\scripts\Vote.ts 1 "0x62c6FC7a9f592A6f478E0091f4230770997E013f" 1 5
    // yarn run ts-node --files .\scripts\Vote.ts 2 "0x62c6FC7a9f592A6f478E0091f4230770997E013f" 2 10

    let provider: Provider;

    const args = process.argv;
    const accIndex = args[2];
    const ballotContractAddress = args[3];
    const votedProposalIndex = args[4];
    const voteAmount = ethers.utils.parseUnits(args[5].toString(), "ether");
    
    console.log(`ballot address: ${ballotContractAddress}`);
    console.log(`votedProposalIndex: ${votedProposalIndex}`);
    console.log(`voteAmount: ${ethers.utils.formatEther(voteAmount)}`);


    provider = ethers.getDefaultProvider("sepolia", {
            infura: process.env.INFURA_API_KEY,
            alchemy: process.env.ALCHEMY_API_KEY,
            etherscan: process.env.ETHERSCAN_API_KEY,
        });

    let account = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", "m/44'/60'/0'/0/" + accIndex).connect(provider);
    
    console.log(`Account: ${account.address}`);

    const ballotContractFactory = new Ballot__factory(account);
    const ballotContract = ballotContractFactory.attach(ballotContractAddress);

    let votePowerBefore = await ballotContract.votePower(account.address);
    console.log(`\Vote power before: ${ethers.utils.formatEther(votePowerBefore)}`);

    const proposalName = ethers.utils.parseBytes32String((await ballotContract.proposals(votedProposalIndex)).name);
    console.log(`\nVoting for proposal: ${proposalName} which has the index: ${votedProposalIndex}`);
    console.log(`\nVoting with ${ethers.utils.formatEther(voteAmount)} token power`);

    if (voteAmount > votePowerBefore){
        throw new Error("You can't vote more than your vote power");
    }

    let voteTx = await ballotContract.vote(votedProposalIndex, voteAmount);
    console.log(`Vote transaction hash: ${voteTx.hash}`);
    await voteTx.wait();
    console.log("Voting confirmed");
    
    let votePowerAfter = await ballotContract.votePower(account.address);
    console.log(`\nVote power after: ${ethers.utils.formatEther(votePowerAfter)}`);

}



main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});