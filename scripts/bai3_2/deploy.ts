import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying VotingEligibility contract...");

  // Get the contract factory
  const VotingEligibility = await ethers.getContractFactory("VotingEligibility");

  // Deploy the contract (no constructor parameters needed)
  const votingEligibility = await VotingEligibility.deploy();
  await votingEligibility.waitForDeployment();

  const address = await votingEligibility.getAddress();
  console.log(`✅ VotingEligibility contract deployed to: ${address}`);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployed by: ${deployer.address}`);

  // Verify the deployment
  const minAge = await (votingEligibility as any).minAge();
  console.log(`🔍 Initial minimum age: ${minAge}`);

  // Test initial eligibility check
  console.log("\n🧪 Testing initial eligibility checks...");
  const testAges = [16, 17, 18, 19, 20, 25];
  
  for (const age of testAges) {
    const isEligible = await (votingEligibility as any).checkEligibility(age);
    const status = isEligible ? "✅ Eligible" : "❌ Not Eligible";
    console.log(`   Age ${age}: ${status}`);
  }

  console.log("\n🎉 Deployment completed successfully!");

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
}