import { ethers } from "hardhat";

// Số lượng token muốn mint (1000 MMT, nhớ kiểm tra decimals của token)
const AMOUNT_TO_MINT = ethers.parseUnits("1000", 18);

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address))
  );

  // Deploy the contract
  const MyMintableToken = await ethers.getContractFactory("MyMintableToken");
  const myMintableToken = await MyMintableToken.deploy();
  await myMintableToken.waitForDeployment();

  const contractAddress = await myMintableToken.getAddress();
  console.log("MyMintableToken deployed to:", contractAddress);

  // Mint token cho deployer
  const mintTx = await myMintableToken.mint(deployer.address, AMOUNT_TO_MINT);
  await mintTx.wait();
  console.log(
    `✔ Minted ${ethers.formatUnits(AMOUNT_TO_MINT, 18)} MMT to ${
      deployer.address
    }`
  );

  // Lấy balance mới
  const balance = await myMintableToken.balanceOf(deployer.address);
  console.log(`Deployer balance: ${ethers.formatUnits(balance, 18)} MMT`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
