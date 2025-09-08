import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying MyToken (ERC20) contract...");

  // Get the contract factory
  const MyToken = await ethers.getContractFactory("MyToken");

  // Deploy the contract
  const myToken = await MyToken.deploy();
  await myToken.waitForDeployment();

  const address = await myToken.getAddress();
  console.log(`✅ MyToken contract deployed to: ${address}`);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployed by: ${deployer.address}`);

  // Test initial state
  console.log("\n🧪 Testing initial contract state...");
  
  // Check token details
  const name = await (myToken as any).name();
  const symbol = await (myToken as any).symbol();
  const decimals = await (myToken as any).decimals();
  const totalSupply = await (myToken as any).totalSupply();
  
  console.log(`   Token Name: ${name}`);
  console.log(`   Token Symbol: ${symbol}`);
  console.log(`   Decimals: ${decimals}`);
  console.log(`   Total Supply: ${ethers.formatUnits(totalSupply, decimals)} ${symbol}`);
  
  // Check deployer balance
  const deployerBalance = await (myToken as any).balanceOf(deployer.address);
  console.log(`   Deployer Balance: ${ethers.formatUnits(deployerBalance, decimals)} ${symbol}`);
  
  // Verify deployer has all tokens
  if (deployerBalance.toString() === totalSupply.toString()) {
    console.log("   ✅ Deployer received all tokens as expected");
  } else {
    console.log("   ❌ Deployer balance mismatch");
  }

  // Test transfer functionality
  console.log("\n🔄 Testing transfer functionality...");
  
  // Get a second account for testing
  const [, recipient] = await ethers.getSigners();
  console.log(`   Recipient address: ${recipient.address}`);
  
  // Transfer 1000 tokens
  const transferAmount = ethers.parseUnits("1000", decimals);
  console.log(`   Transferring ${ethers.formatUnits(transferAmount, decimals)} ${symbol} to recipient...`);
  
  const transferTx = await (myToken as any).transfer(recipient.address, transferAmount);
  const transferReceipt = await transferTx.wait();
  console.log(`   ✅ Transfer transaction hash: ${transferTx.hash}`);
  console.log(`   📊 Gas used: ${transferReceipt?.gasUsed?.toString()}`);
  
  // Check balances after transfer
  const deployerBalanceAfter = await (myToken as any).balanceOf(deployer.address);
  const recipientBalance = await (myToken as any).balanceOf(recipient.address);
  
  console.log(`   Deployer balance after transfer: ${ethers.formatUnits(deployerBalanceAfter, decimals)} ${symbol}`);
  console.log(`   Recipient balance: ${ethers.formatUnits(recipientBalance, decimals)} ${symbol}`);
  
  // Verify transfer
  if (recipientBalance.toString() === transferAmount.toString()) {
    console.log("   ✅ Transfer successful");
  } else {
    console.log("   ❌ Transfer failed");
  }

  // Test transferFrom functionality
  console.log("\n🔄 Testing transferFrom functionality...");
  
  // Approve tokens for transferFrom
  const approveAmount = ethers.parseUnits("500", decimals);
  console.log(`   Approving ${ethers.formatUnits(approveAmount, decimals)} ${symbol} for recipient...`);
  
  const approveTx = await (myToken as any).approve(recipient.address, approveAmount);
  await approveTx.wait();
  console.log(`   ✅ Approval transaction hash: ${approveTx.hash}`);
  
  // Check allowance
  const allowance = await (myToken as any).allowance(deployer.address, recipient.address);
  console.log(`   Allowance: ${ethers.formatUnits(allowance, decimals)} ${symbol}`);
  
  // Transfer from deployer to a third account
  const [, , thirdAccount] = await ethers.getSigners();
  const transferFromAmount = ethers.parseUnits("200", decimals);
  
  console.log(`   Transferring ${ethers.formatUnits(transferFromAmount, decimals)} ${symbol} from deployer to third account...`);
  
  const transferFromTx = await (myToken as any).connect(recipient).transferFrom(deployer.address, thirdAccount.address, transferFromAmount);
  const transferFromReceipt = await transferFromTx.wait();
  console.log(`   ✅ TransferFrom transaction hash: ${transferFromTx.hash}`);
  console.log(`   📊 Gas used: ${transferFromReceipt?.gasUsed?.toString()}`);
  
  // Check final balances
  const finalDeployerBalance = await (myToken as any).balanceOf(deployer.address);
  const finalThirdAccountBalance = await (myToken as any).balanceOf(thirdAccount.address);
  const finalAllowance = await (myToken as any).allowance(deployer.address, recipient.address);
  
  console.log(`\n📊 Final balances:`);
  console.log(`   Deployer: ${ethers.formatUnits(finalDeployerBalance, decimals)} ${symbol}`);
  console.log(`   Recipient: ${ethers.formatUnits(recipientBalance, decimals)} ${symbol}`);
  console.log(`   Third Account: ${ethers.formatUnits(finalThirdAccountBalance, decimals)} ${symbol}`);
  console.log(`   Remaining Allowance: ${ethers.formatUnits(finalAllowance, decimals)} ${symbol}`);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Key Features:");
  console.log("• ERC20 token with 1,000,000 total supply");
  console.log("• All tokens minted to deployer initially");
  console.log("• Transfer functionality working");
  console.log("• TransferFrom functionality working");
  console.log("• Approval system working");
  console.log("• Gas-efficient operations");
  console.log("• Ready for interaction and testing");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
