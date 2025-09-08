import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Welcome contract...");

  // Get the contract factory
  const Welcome = await ethers.getContractFactory("Welcome");

  // Deploy with initial greeting
  const initialGreeting = "Hello, Blockchain World!";
  const welcome = await Welcome.deploy(initialGreeting);

  await welcome.waitForDeployment();

  const address = await welcome.getAddress();
  console.log(`✅ Welcome contract deployed to: ${address}`);
  console.log(`📝 Initial greeting: "${initialGreeting}"`);

  // Verify the deployment
  const greeting = await welcome.getGreeting();
  console.log(`🔍 Verified greeting: "${greeting}"`);

  console.log("\n🎉 Deployment completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
