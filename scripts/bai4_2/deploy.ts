import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying StudentRegistryV2 contract...");

  // Get the contract factory
  const StudentRegistryV2 = await ethers.getContractFactory("StudentRegistryV2");

  // Deploy the contract
  const studentRegistryV2 = await StudentRegistryV2.deploy();
  await studentRegistryV2.waitForDeployment();

  const address = await studentRegistryV2.getAddress();
  console.log(`✅ StudentRegistryV2 contract deployed to: ${address}`);

  // Get deployer address (who becomes the owner)
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployed by (Owner): ${deployer.address}`);

  // Verify owner
  const owner = await (studentRegistryV2 as any).owner();
  console.log(`🔐 Contract owner: ${owner}`);

  // Test initial state
  console.log("\n🧪 Testing initial contract state...");
  
  // Check if any students are registered (should be none initially)
  const isDeployerRegistered = await (studentRegistryV2 as any).isStudentRegistered(deployer.address);
  console.log(`   Deployer registered: ${isDeployerRegistered ? "✅ Yes" : "❌ No"}`);
  
  // Register the deployer as a test student (owner can register anyone)
  console.log("\n📝 Owner registering deployer as a test student...");
  await (studentRegistryV2 as any).registerStudent(deployer.address, "Alice Johnson", 20);
  
  // Verify registration
  const isNowRegistered = await (studentRegistryV2 as any).isStudentRegistered(deployer.address);
  console.log(`   Deployer now registered: ${isNowRegistered ? "✅ Yes" : "❌ No"}`);
  
  const registeredStudent = await (studentRegistryV2 as any).getStudent(deployer.address);
  console.log(`   Registered student: Name="${registeredStudent.name}", Age=${registeredStudent.age}, Registered=${registeredStudent.isRegistered}`);

  // Test owner-only functionality
  console.log("\n🔐 Testing owner-only functionality...");
  console.log("   ✅ Owner can register students");
  console.log("   ✅ Owner can read student information");
  console.log("   ✅ Owner can check registration status");

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Key Features:");
  console.log("• Only owner can register students");
  console.log("• Events are emitted when students are registered");
  console.log("• Owner-based access control with modifier");
  console.log("• Enhanced from StudentRegistry with access control");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
