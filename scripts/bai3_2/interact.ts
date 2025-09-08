import { ethers } from "hardhat";

async function main() {
  console.log("🔗 Interacting with VotingEligibility contract...\n");

  try {
    // Get the contract factory
    const VotingEligibility = await ethers.getContractFactory("VotingEligibility");
    
    // Deploy a new instance for demonstration
    const votingEligibility = await VotingEligibility.deploy();
    await votingEligibility.waitForDeployment();
    
    const address = await votingEligibility.getAddress();
    console.log(`📍 Contract deployed at: ${address}`);
    
    // Get deployer info
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Deployer: ${deployer.address}`);
    
    // Check initial minimum age
    let minAge = await (votingEligibility as any).minAge();
    console.log(`📊 Initial minimum age: ${minAge}`);
    
    // Test eligibility checks with various ages
    console.log("\n🗳️ Testing eligibility checks...");
    const testCases = [
      { age: 16, expected: false, description: "Underage (16)" },
      { age: 17, expected: false, description: "Underage (17)" },
      { age: 18, expected: true, description: "Exactly minimum age (18)" },
      { age: 19, expected: true, description: "Above minimum age (19)" },
      { age: 25, expected: true, description: "Adult (25)" },
      { age: 65, expected: true, description: "Senior (65)" }
    ];
    
    for (const testCase of testCases) {
      const isEligible = await (votingEligibility as any).checkEligibility(testCase.age);
      const status = isEligible ? "✅ Eligible" : "❌ Not Eligible";
      const result = isEligible === testCase.expected ? "✅ PASS" : "❌ FAIL";
      console.log(`   ${testCase.description}: ${status} ${result}`);
    }
    
    // Test updating minimum age (as deployer)
    console.log("\n🔄 Testing minimum age updates...");
    
    // Update to 21
    console.log("   Updating minimum age to 21...");
    await (votingEligibility as any).updateMinAge(21);
    minAge = await (votingEligibility as any).minAge();
    console.log(`   ✅ New minimum age: ${minAge}`);
    
    // Test eligibility with new minimum age
    console.log("   Testing eligibility with new minimum age (21)...");
    const newTestCases = [
      { age: 18, expected: false, description: "Age 18 (now underage)" },
      { age: 20, expected: false, description: "Age 20 (now underage)" },
      { age: 21, expected: true, description: "Age 21 (new minimum)" },
      { age: 25, expected: true, description: "Age 25 (eligible)" }
    ];
    
    for (const testCase of newTestCases) {
      const isEligible = await (votingEligibility as any).checkEligibility(testCase.age);
      const status = isEligible ? "✅ Eligible" : "❌ Not Eligible";
      const result = isEligible === testCase.expected ? "✅ PASS" : "❌ FAIL";
      console.log(`     ${testCase.description}: ${status} ${result}`);
    }
    
    // Test multiple age updates
    console.log("\n🔄 Testing multiple age updates...");
    const ageUpdates = [16, 25, 30, 18];
    
    for (const newAge of ageUpdates) {
      await (votingEligibility as any).updateMinAge(newAge);
      const currentMinAge = await (votingEligibility as any).minAge();
      console.log(`   Updated to ${newAge}: Current minimum age = ${currentMinAge}`);
    }
    
    // Test edge cases
    console.log("\n🧪 Testing edge cases...");
    
    // Test with age 0
    const ageZeroEligible = await (votingEligibility as any).checkEligibility(0);
    console.log(`   Age 0: ${ageZeroEligible ? "✅ Eligible" : "❌ Not Eligible"}`);
    
    // Test with very large age
    const largeAge = 150;
    const largeAgeEligible = await (votingEligibility as any).checkEligibility(largeAge);
    console.log(`   Age ${largeAge}: ${largeAgeEligible ? "✅ Eligible" : "❌ Not Eligible"}`);
    
    // Test setting minimum age to 0
    console.log("   Setting minimum age to 0...");
    await (votingEligibility as any).updateMinAge(0);
    const finalMinAge = await (votingEligibility as any).minAge();
    console.log(`   Final minimum age: ${finalMinAge}`);
    
    // Test eligibility with minimum age 0
    const ageZeroEligibleFinal = await (votingEligibility as any).checkEligibility(0);
    console.log(`   Age 0 with minAge=0: ${ageZeroEligibleFinal ? "✅ Eligible" : "❌ Not Eligible"}`);
    
    console.log("\n🎉 All interactions completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during interaction:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
