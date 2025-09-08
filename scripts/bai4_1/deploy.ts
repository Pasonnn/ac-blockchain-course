import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying StudentRegistry contract...");

  // Get the contract factory
  const StudentRegistry = await ethers.getContractFactory("StudentRegistry");

  // Deploy the contract
  const studentRegistry = await StudentRegistry.deploy();
  await studentRegistry.waitForDeployment();

  const address = await studentRegistry.getAddress();
  console.log(`✅ StudentRegistry contract deployed to: ${address}`);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployed by: ${deployer.address}`);

  // Test initial state
  console.log("\n🧪 Testing initial contract state...");
  
  // Check if deployer is registered (should be false initially)
  const isDeployerRegistered = await (studentRegistry as any).isStudentRegistered(deployer.address);
  console.log(`   Deployer registered: ${isDeployerRegistered ? "✅ Yes" : "❌ No"}`);
  
  // Try to get deployer's student info (should return empty struct)
  const deployerStudent = await (studentRegistry as any).getStudent(deployer.address);
  console.log(`   Deployer student info: Name="${deployerStudent.name}", Age=${deployerStudent.age}, Registered=${deployerStudent.isRegistered}`);

  // Register the deployer as a test
  console.log("\n📝 Registering deployer as a test student...");
  await (studentRegistry as any).register("Alice Johnson", 20);
  
  // Verify registration
  const isNowRegistered = await (studentRegistry as any).isStudentRegistered(deployer.address);
  console.log(`   Deployer now registered: ${isNowRegistered ? "✅ Yes" : "❌ No"}`);
  
  const registeredStudent = await (studentRegistry as any).getStudent(deployer.address);
  console.log(`   Registered student: Name="${registeredStudent.name}", Age=${registeredStudent.age}, Registered=${registeredStudent.isRegistered}`);

  console.log("\n🎉 Deployment completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
