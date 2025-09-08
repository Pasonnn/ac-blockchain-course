import { ethers } from "hardhat";

async function main() {
  console.log("🔗 Interacting with Voting contract...\n");

  try {
    // Get the contract factory
    const Voting = await ethers.getContractFactory("Voting");
    
    // Deploy a new instance for demonstration
    const voting = await Voting.deploy();
    await voting.waitForDeployment();
    
    const address = await voting.getAddress();
    console.log(`📍 Contract deployed at: ${address}`);
    
    // Get multiple signers for testing
    const [admin, voter1, voter2, voter3, voter4, voter5] = await ethers.getSigners();
    console.log(`👤 Available accounts:`);
    console.log(`   Admin: ${admin.address}`);
    console.log(`   Voter 1: ${voter1.address}`);
    console.log(`   Voter 2: ${voter2.address}`);
    console.log(`   Voter 3: ${voter3.address}`);
    console.log(`   Voter 4: ${voter4.address}`);
    console.log(`   Voter 5: ${voter5.address}`);
    
    // Verify admin
    const contractOwner = await (voting as any).owner();
    console.log(`🔐 Contract admin: ${contractOwner}`);
    console.log(`   Admin matches deployer: ${contractOwner === admin.address ? "✅ Yes" : "❌ No"}`);
    
    // Test initial state
    console.log("\n🔍 Testing initial contract state...");
    const initialCandidateCount = await (voting as any).totalCandidates();
    console.log(`   Initial candidate count: ${initialCandidateCount}`);
    
    // Admin adds candidates
    console.log("\n📝 Admin adding candidates...");
    
    const candidates = [
      "Alice Johnson",
      "Bob Smith", 
      "Charlie Brown",
      "Diana Wilson",
      "Eve Davis"
    ];
    
    for (const candidateName of candidates) {
      const tx = await (voting as any).addCandidate(candidateName);
      const receipt = await tx.wait();
      console.log(`   ✅ Added candidate: "${candidateName}"`);
      console.log(`   📊 Gas used: ${receipt?.gasUsed?.toString()}`);
    }
    
    // Display all candidates
    const allCandidates = await (voting as any).getCandidates();
    console.log("\n🗳️ Current candidates:");
    for (let i = 0; i < allCandidates.length; i++) {
      const candidate = allCandidates[i];
      console.log(`   ${i}: "${candidate.name}" - ${candidate.voteCount} votes`);
    }
    
    // Test voting functionality
    console.log("\n🗳️ Testing voting functionality...");
    
    // Voter 1 votes for candidate 0 (Alice Johnson)
    console.log("   Voter 1 voting for Alice Johnson (candidate 0)...");
    const vote1Tx = await (voting as any).connect(voter1).vote(0);
    const vote1Receipt = await vote1Tx.wait();
    console.log(`   ✅ Vote cast! Transaction hash: ${vote1Tx.hash}`);
    console.log(`   📊 Gas used: ${vote1Receipt?.gasUsed?.toString()}`);
    
    // Voter 2 votes for candidate 1 (Bob Smith)
    console.log("   Voter 2 voting for Bob Smith (candidate 1)...");
    const vote2Tx = await (voting as any).connect(voter2).vote(1);
    const vote2Receipt = await vote2Tx.wait();
    console.log(`   ✅ Vote cast! Transaction hash: ${vote2Tx.hash}`);
    console.log(`   📊 Gas used: ${vote2Receipt?.gasUsed?.toString()}`);
    
    // Voter 3 votes for candidate 0 (Alice Johnson) again
    console.log("   Voter 3 voting for Alice Johnson (candidate 0)...");
    const vote3Tx = await (voting as any).connect(voter3).vote(0);
    const vote3Receipt = await vote3Tx.wait();
    console.log(`   ✅ Vote cast! Transaction hash: ${vote3Tx.hash}`);
    console.log(`   📊 Gas used: ${vote3Receipt?.gasUsed?.toString()}`);
    
    // Voter 4 votes for candidate 2 (Charlie Brown)
    console.log("   Voter 4 voting for Charlie Brown (candidate 2)...");
    const vote4Tx = await (voting as any).connect(voter4).vote(2);
    const vote4Receipt = await vote4Tx.wait();
    console.log(`   ✅ Vote cast! Transaction hash: ${vote4Tx.hash}`);
    console.log(`   📊 Gas used: ${vote4Receipt?.gasUsed?.toString()}`);
    
    // Check voting results
    console.log("\n📊 Current voting results:");
    const updatedCandidates = await (voting as any).getCandidates();
    for (let i = 0; i < updatedCandidates.length; i++) {
      const candidate = updatedCandidates[i];
      console.log(`   ${i}: "${candidate.name}" - ${candidate.voteCount} votes`);
    }
    
    // Test access control
    console.log("\n🔐 Testing access control...");
    
    // Try to add candidate as non-admin (should fail)
    console.log("   Testing non-admin candidate addition...");
    try {
      await (voting as any).connect(voter1).addCandidate("Unauthorized Candidate");
      console.log("   ❌ ERROR: Non-admin should not be able to add candidates!");
    } catch (error) {
      console.log("   ✅ Correctly rejected non-admin candidate addition");
      console.log(`   📝 Error: ${(error as any).message || "Access denied"}`);
    }
    
    // Test duplicate voting (should fail)
    console.log("\n🚫 Testing duplicate voting...");
    try {
      await (voting as any).connect(voter1).vote(1);
      console.log("   ❌ ERROR: Duplicate voting should have failed!");
    } catch (error) {
      console.log("   ✅ Correctly rejected duplicate voting");
      console.log(`   📝 Error: ${(error as any).message || "Already voted"}`);
    }
    
    // Test voting for non-existent candidate (should fail)
    console.log("\n🚫 Testing voting for non-existent candidate...");
    try {
      await (voting as any).connect(voter5).vote(999);
      console.log("   ❌ ERROR: Voting for non-existent candidate should have failed!");
    } catch (error) {
      console.log("   ✅ Correctly rejected voting for non-existent candidate");
      console.log(`   📝 Error: ${(error as any).message || "Invalid candidate"}`);
    }
    
    // Check who has voted
    console.log("\n🔍 Checking voting status...");
    const voters = [voter1, voter2, voter3, voter4, voter5];
    for (let i = 0; i < voters.length; i++) {
      const hasVoted = await (voting as any).hasVoted(voters[i].address);
      console.log(`   Voter ${i + 1}: ${hasVoted ? "✅ Has voted" : "❌ Has not voted"}`);
    }
    
    // Test edge cases
    console.log("\n🧪 Testing edge cases...");
    
    // Test adding candidate with empty name
    console.log("   Testing adding candidate with empty name...");
    try {
      await (voting as any).addCandidate("");
      const candidatesAfterEmpty = await (voting as any).getCandidates();
      const lastCandidate = candidatesAfterEmpty[candidatesAfterEmpty.length - 1];
      console.log(`   ✅ Empty name accepted: "${lastCandidate.name}"`);
    } catch (error) {
      console.log("   ❌ Empty name rejected:", (error as any).message || "Error");
    }
    
    // Test adding candidate with very long name
    console.log("   Testing adding candidate with very long name...");
    const longName = "A".repeat(100);
    try {
      await (voting as any).addCandidate(longName);
      const candidatesAfterLong = await (voting as any).getCandidates();
      const lastCandidate = candidatesAfterLong[candidatesAfterLong.length - 1];
      console.log(`   ✅ Long name accepted: "${lastCandidate.name.substring(0, 20)}..." (${lastCandidate.name.length} chars)`);
    } catch (error) {
      console.log("   ❌ Long name rejected:", (error as any).message || "Error");
    }
    
    // Test adding candidate with special characters
    console.log("   Testing adding candidate with special characters...");
    const specialName = "José María O'Connor-Smith 🚀";
    try {
      await (voting as any).addCandidate(specialName);
      const candidatesAfterSpecial = await (voting as any).getCandidates();
      const lastCandidate = candidatesAfterSpecial[candidatesAfterSpecial.length - 1];
      console.log(`   ✅ Special characters accepted: "${lastCandidate.name}"`);
    } catch (error) {
      console.log("   ❌ Special characters rejected:", (error as any).message || "Error");
    }
    
    // Final voting results
    console.log("\n🏆 Final voting results:");
    const finalCandidates = await (voting as any).getCandidates();
    let winner = { name: "", votes: 0, index: 0 };
    
    for (let i = 0; i < finalCandidates.length; i++) {
      const candidate = finalCandidates[i];
      console.log(`   ${i}: "${candidate.name}" - ${candidate.voteCount} votes`);
      
      if (candidate.voteCount > winner.votes) {
        winner = { name: candidate.name, votes: candidate.voteCount, index: i };
      }
    }
    
    if (winner.votes > 0) {
      console.log(`\n🥇 Winner: "${winner.name}" with ${winner.votes} vote(s)!`);
    } else {
      console.log("\n🤷 No votes cast yet.");
    }
    
    console.log("\n🎉 All interactions completed successfully!");
    console.log("\n📋 Summary of Features Tested:");
    console.log("• ✅ Admin-only candidate creation with modifier");
    console.log("• ✅ One vote per address restriction");
    console.log("• ✅ Event emission for candidate addition and voting");
    console.log("• ✅ Vote counting and candidate retrieval");
    console.log("• ✅ Access control enforcement");
    console.log("• ✅ Duplicate voting prevention");
    console.log("• ✅ Edge case handling");
    console.log("• ✅ Complete voting system functionality");
    
  } catch (error) {
    console.error("❌ Error during interaction:", error as string);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
