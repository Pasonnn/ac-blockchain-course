import { ethers } from "hardhat";

async function main() {
  console.log("🔗 Interacting with Welcome contract...\n");

  try {
    // Get the contract factory
    const Welcome = await ethers.getContractFactory("Welcome");
    
    // Deploy a new instance for demonstration
    const welcome = await Welcome.deploy("Hello from Interaction Script!");
    await welcome.waitForDeployment();
    
    const address = await welcome.getAddress();
    console.log(`📍 Contract deployed at: ${address}`);
    
    // Get initial greeting
    let greeting = await welcome.getGreeting();
    console.log(`📝 Current greeting: "${greeting}"`);
    
    // Update greeting
    console.log("\n🔄 Updating greeting...");
    await welcome.setGreeting("Welcome to the Hardhat Environment!");
    
    // Verify update
    greeting = await welcome.getGreeting();
    console.log(`✅ New greeting: "${greeting}"`);
    
    // Test multiple updates
    console.log("\n🔄 Testing multiple updates...");
    const updates = [
      "First update",
      "Second update", 
      "Final greeting!"
    ];
    
    for (const update of updates) {
      await welcome.setGreeting(update);
      const currentGreeting = await welcome.getGreeting();
      console.log(`   ${update} → "${currentGreeting}"`);
    }
    
    // Test edge cases
    console.log("\n🧪 Testing edge cases...");
    
    // Empty string
    await welcome.setGreeting("");
    greeting = await welcome.getGreeting();
    console.log(`   Empty string: "${greeting}"`);
    
    // Special characters
    const specialGreeting = "Hello! @#$%^&*()_+-=[]{}|;':\",./<>?";
    await welcome.setGreeting(specialGreeting);
    greeting = await welcome.getGreeting();
    console.log(`   Special chars: "${greeting}"`);
    
    // Unicode
    const unicodeGreeting = "Hello 世界! 🌍 🚀";
    await welcome.setGreeting(unicodeGreeting);
    greeting = await welcome.getGreeting();
    console.log(`   Unicode: "${greeting}"`);
    
    console.log("\n🎉 All interactions completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during interaction:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
