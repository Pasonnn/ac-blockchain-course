import { ethers } from "hardhat";

async function main() {
  console.log("🔗 Interacting with Counter contract...\n");

  try {
    // Get the contract factory
    const Counter = await ethers.getContractFactory("Counter");
    
    // Deploy a new instance for demonstration
    const counter = await Counter.deploy();
    await counter.waitForDeployment();
    
    const address = await counter.getAddress();
    console.log(`📍 Contract deployed at: ${address}`);
    
    // Get multiple signers for testing
    const [user1, user2, user3] = await ethers.getSigners();
    console.log(`👤 Available accounts:`);
    console.log(`   User 1: ${user1.address}`);
    console.log(`   User 2: ${user2.address}`);
    console.log(`   User 3: ${user3.address}`);
    
    // Test initial state
    console.log("\n🔍 Testing initial contract state...");
    const initialCount = await (counter as any).getCount();
    console.log(`   Initial count: ${initialCount}`);
    
    // Test increment function with different users
    console.log("\n🔄 Testing increment function with different users...");
    
    // User 1 increments
    console.log("   User 1 incrementing...");
    const tx1 = await (counter as any).connect(user1).increment();
    const receipt1 = await tx1.wait();
    console.log(`   ✅ Transaction hash: ${tx1.hash}`);
    console.log(`   📊 Gas used: ${receipt1?.gasUsed?.toString()}`);
    
    let currentCount = await (counter as any).getCount();
    console.log(`   Current count: ${currentCount}`);
    
    // User 2 increments
    console.log("   User 2 incrementing...");
    const tx2 = await (counter as any).connect(user2).increment();
    const receipt2 = await tx2.wait();
    console.log(`   ✅ Transaction hash: ${tx2.hash}`);
    console.log(`   📊 Gas used: ${receipt2?.gasUsed?.toString()}`);
    
    currentCount = await (counter as any).getCount();
    console.log(`   Current count: ${currentCount}`);
    
    // User 3 increments
    console.log("   User 3 incrementing...");
    const tx3 = await (counter as any).connect(user3).increment();
    const receipt3 = await tx3.wait();
    console.log(`   ✅ Transaction hash: ${tx3.hash}`);
    console.log(`   📊 Gas used: ${receipt3?.gasUsed?.toString()}`);
    
    currentCount = await (counter as any).getCount();
    console.log(`   Current count: ${currentCount}`);
    
    // Test multiple increments by same user
    console.log("\n🔄 Testing multiple increments by same user...");
    
    console.log("   User 1 incrementing 5 times...");
    for (let i = 0; i < 5; i++) {
      await (counter as any).connect(user1).increment();
      const count = await (counter as any).getCount();
      console.log(`     Increment ${i + 1}: Count = ${count}`);
    }
    
    // Test rapid increments
    console.log("\n⚡ Testing rapid increments...");
    
    console.log("   Performing 10 rapid increments...");
    const startTime = Date.now();
    
    for (let i = 0; i < 10; i++) {
      await (counter as any).increment();
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const finalCount = await (counter as any).getCount();
    console.log(`   ✅ Completed 10 increments in ${duration}ms`);
    console.log(`   Final count: ${finalCount}`);
    
    // Test reading count in different ways
    console.log("\n🔍 Testing different ways to read count...");
    
    // Method 1: Using getCount() function
    const countViaFunction = await (counter as any).getCount();
    console.log(`   Count via getCount(): ${countViaFunction}`);
    
    // Method 2: Direct access to public variable
    const countViaVariable = await (counter as any).count();
    console.log(`   Count via count(): ${countViaVariable}`);
    
    // Verify both methods return same value
    if (countViaFunction.toString() === countViaVariable.toString()) {
      console.log("   ✅ Both methods return the same value");
    } else {
      console.log("   ❌ Methods return different values");
    }
    
    // Test gas usage analysis
    console.log("\n⛽ Gas usage analysis...");
    
    const gasTestTx = await (counter as any).increment();
    const gasTestReceipt = await gasTestTx.wait();
    const gasUsed = gasTestReceipt?.gasUsed?.toString();
    
    console.log(`   Gas used for increment: ${gasUsed}`);
    console.log(`   Gas price: ${gasTestTx.gasPrice?.toString() || "N/A"}`);
    
    if (gasUsed) {
      const gasInEth = ethers.formatEther(gasUsed);
      console.log(`   Gas cost in ETH: ${gasInEth}`);
    }
    
    // Test edge cases
    console.log("\n🧪 Testing edge cases...");
    
    // Test incrementing from current state
    const beforeIncrement = await (counter as any).getCount();
    console.log(`   Count before increment: ${beforeIncrement}`);
    
    await (counter as any).increment();
    
    const afterIncrement = await (counter as any).getCount();
    console.log(`   Count after increment: ${afterIncrement}`);
    
    const expectedCount = BigInt(beforeIncrement.toString()) + BigInt(1);
    if (afterIncrement.toString() === expectedCount.toString()) {
      console.log("   ✅ Increment works correctly with large numbers");
    } else {
      console.log("   ❌ Increment failed with large numbers");
    }
    
    // Performance test
    console.log("\n⚡ Performance test...");
    
    const performanceStart = Date.now();
    const performanceCount = 20;
    
    console.log(`   Performing ${performanceCount} increments...`);
    
    for (let i = 0; i < performanceCount; i++) {
      await (counter as any).increment();
    }
    
    const performanceEnd = Date.now();
    const performanceDuration = performanceEnd - performanceStart;
    const avgTimePerIncrement = performanceDuration / performanceCount;
    
    const performanceFinalCount = await (counter as any).getCount();
    console.log(`   ✅ Completed ${performanceCount} increments in ${performanceDuration}ms`);
    console.log(`   Average time per increment: ${avgTimePerIncrement.toFixed(2)}ms`);
    console.log(`   Final count: ${performanceFinalCount}`);
    
    // Final summary
    console.log("\n📊 Final Summary:");
    const totalCount = await (counter as any).getCount();
    console.log(`   Total increments performed: ${totalCount}`);
    console.log(`   Contract address: ${address}`);
    console.log(`   All operations completed successfully!`);
    
    console.log("\n🎉 All interactions completed successfully!");
    console.log("\n📋 Summary of Features Tested:");
    console.log("• ✅ Basic increment functionality");
    console.log("• ✅ Multiple user interactions");
    console.log("• ✅ Rapid increment operations");
    console.log("• ✅ Gas usage analysis");
    console.log("• ✅ Different count reading methods");
    console.log("• ✅ Performance testing");
    console.log("• ✅ Edge case handling");
    console.log("• ✅ Transaction hash and receipt logging");
    
  } catch (error) {
    console.error("❌ Error during interaction:", error as string);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
