import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Counter contract...");

  // Get the contract factory
  const Counter = await ethers.getContractFactory("Counter");

  // Deploy the contract
  const counter = await Counter.deploy();
  await counter.waitForDeployment();

  const address = await counter.getAddress();
  console.log(`✅ Counter contract deployed to: ${address}`);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployed by: ${deployer.address}`);

  // Test initial state
  console.log("\n🧪 Testing initial contract state...");
  
  // Check initial count (should be 0)
  const initialCount = await (counter as any).getCount();
  console.log(`   Initial count: ${initialCount}`);
  
  // Verify the count is 0
  if (initialCount.toString() === "0") {
    console.log("   ✅ Initial count is correct (0)");
  } else {
    console.log("   ❌ Initial count is incorrect");
  }

  // Test increment function
  console.log("\n🔄 Testing increment function...");
  
  // Increment once
  console.log("   Incrementing count by 1...");
  const incrementTx = await (counter as any).increment();
  const incrementReceipt = await incrementTx.wait();
  console.log(`   ✅ Increment transaction hash: ${incrementTx.hash}`);
  console.log(`   📊 Gas used: ${incrementReceipt?.gasUsed?.toString()}`);
  
  // Check count after increment
  const countAfterIncrement = await (counter as any).getCount();
  console.log(`   Count after increment: ${countAfterIncrement}`);
  
  if (countAfterIncrement.toString() === "1") {
    console.log("   ✅ Count incremented successfully to 1");
  } else {
    console.log("   ❌ Count increment failed");
  }

  // Test multiple increments
  console.log("\n🔄 Testing multiple increments...");
  
  for (let i = 0; i < 5; i++) {
    await (counter as any).increment();
    const currentCount = await (counter as any).getCount();
    console.log(`   Increment ${i + 2}: Count = ${currentCount}`);
  }

  // Final count
  const finalCount = await (counter as any).getCount();
  console.log(`\n📊 Final count: ${finalCount}`);

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Key Features:");
  console.log("• Simple counter with increment function");
  console.log("• Public count variable for direct access");
  console.log("• getCount() function for reading current value");
  console.log("• Gas-efficient increment operations");
  console.log("• Ready for interaction and testing");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
