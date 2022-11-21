import { ethers, network } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import { Provider } from "@ethersproject/providers";
import * as dotenv from 'dotenv'

dotenv.config()

async function main() {
    // yarn run ts-node --files .\scripts\DeployToken.ts 0

    let provider: Provider;
    const gasPrice = 11000000000;

    const args = process.argv;
    const accIndex = args[2];

    provider = ethers.provider;

    let account = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "", "m/44'/60'/0'/0/" + accIndex).connect(provider);
    await network.provider.send("hardhat_setBalance", [
            account.address,
            "0x1000000000000000",
          ]);

    let tokenContractFactory = new MyToken__factory(account);
    let tokenContract = await tokenContractFactory.deploy({gasPrice: gasPrice});
    await tokenContract.deployed();
    console.log(`\nThe contract is deployed.`);
    console.log(`Contract address: ${tokenContract.address}`);
    console.log(`Minter address: ${account.address}`);
}



main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});