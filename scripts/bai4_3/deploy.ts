import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Voting contract...");

  // Get the contract factory
  const Voting = await ethers.getContractFactory("Voting");

  // Deploy the contract
  const voting = await Voting.deploy();
  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log(`✅ Voting contract deployed to: ${address}`);

  // Get deployer address (who becomes the owner/admin)
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployed by (Admin/Owner): ${deployer.address}`);

  // Verify owner
  const owner = await (voting as any).owner();
  console.log(`🔐 Contract owner: ${owner}`);

  // Test initial state
  console.log("\n🧪 Testing initial contract state...");
  
  // Check initial candidate count
  const initialCandidateCount = await (voting as any).totalCandidates();
  console.log(`   Initial candidate count: ${initialCandidateCount}`);
  
  // Check if deployer has voted (should be false initially)
  const hasDeployerVoted = await (voting as any).hasVoted(deployer.address);
  console.log(`   Deployer has voted: ${hasDeployerVoted ? "✅ Yes" : "❌ No"}`);
  
  // Add some initial candidates as admin
  console.log("\n📝 Admin adding initial candidates...");
  
  const candidates = [
    "Alice Johnson",
    "Bob Smith", 
    "Charlie Brown",
    "Diana Wilson"
  ];
  
  for (const candidateName of candidates) {
    const tx = await (voting as any).addCandidate(candidateName);
    const receipt = await tx.wait();
    console.log(`   ✅ Added candidate: "${candidateName}"`);
    console.log(`   📊 Gas used: ${receipt?.gasUsed?.toString()}`);
  }
  
  // Verify candidates were added
  const finalCandidateCount = await (voting as any).totalCandidates();
  console.log(`\n📊 Final candidate count: ${finalCandidateCount}`);
  
  // Get and display all candidates
  const allCandidates = await (voting as any).getCandidates();
  console.log("\n🗳️ Current candidates:");
  for (let i = 0; i < allCandidates.length; i++) {
    const candidate = allCandidates[i];
    console.log(`   ${i}: "${candidate.name}" - ${candidate.voteCount} votes`);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Key Features:");
  console.log("• Admin-only candidate creation with modifier");
  console.log("• One vote per address restriction");
  console.log("• Event emission for candidate addition and voting");
  console.log("• Vote counting and candidate retrieval");
  console.log("• Complete voting system implementation");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
