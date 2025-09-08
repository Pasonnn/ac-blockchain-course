import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Profile contract...");

  // Get the contract factory
  const Profile = await ethers.getContractFactory("Profile");

  // Deploy with initial profile data
  const initialName = "Alice Johnson";
  const initialAge = 25;
  const profile = await Profile.deploy(initialName, initialAge);

  await profile.waitForDeployment();

  const address = await profile.getAddress();
  console.log(`✅ Profile contract deployed to: ${address}`);
  console.log(`👤 Initial name: "${initialName}"`);
  console.log(`🎂 Initial age: ${initialAge}`);

  // Verify the deployment
  const name = await (profile as any).name();
  const age = await (profile as any).age();
  console.log(`🔍 Verified profile: Name="${name}", Age=${age}`);

  console.log("\n🎉 Deployment completed successfully!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
