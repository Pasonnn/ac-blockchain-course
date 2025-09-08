import { ethers } from "hardhat";

async function main() {
  console.log("🔗 Interacting with Profile contract...\n");

  try {
    // Get the contract factory
    const Profile = await ethers.getContractFactory("Profile");
    
    // Deploy a new instance for demonstration
    const profile = await Profile.deploy("Bob Smith", 30);
    await profile.waitForDeployment();
    
    const address = await profile.getAddress();
    console.log(`📍 Contract deployed at: ${address}`);
    
    // Get initial profile
    let [name, age] = await (profile as any).getProfile();
    console.log(`👤 Initial profile: Name="${name}", Age=${age}`);
    
    // Update profile
    console.log("\n🔄 Updating profile...");
    await (profile as any).setProfile("Charlie Brown", 35);
    
    // Verify update
    [name, age] = await (profile as any).getProfile();
    console.log(`✅ Updated profile: Name="${name}", Age=${age}`);
    
    // Test multiple updates
    console.log("\n🔄 Testing multiple profile updates...");
    const profiles = [
      { name: "David Wilson", age: 28 },
      { name: "Emma Davis", age: 32 },
      { name: "Frank Miller", age: 45 }
    ];
    
    for (const profileData of profiles) {
      await (profile as any).setProfile(profileData.name, profileData.age);
      const [currentName, currentAge] = await (profile as any).getProfile();
      console.log(`   ${profileData.name} (${profileData.age}) → "${currentName}" (${currentAge})`);
    }
    
    // Test individual field access
    console.log("\n🔍 Testing individual field access...");
    const currentName = await (profile as any).name();
    const currentAge = await (profile as any).age();
    console.log(`   Direct name access: "${currentName}"`);
    console.log(`   Direct age access: ${currentAge}`);
    
    // Test edge cases
    console.log("\n🧪 Testing edge cases...");
    
    // Empty name
    await (profile as any).setProfile("", 0);
    [name, age] = await (profile as any).getProfile();
    console.log(`   Empty name: "${name}", Age: ${age}`);
    
    // Very long name
    const longName = "A".repeat(100);
    await (profile as any).setProfile(longName, 99);
    [name, age] = await (profile as any).getProfile();
    console.log(`   Long name (${name.length} chars): "${name.substring(0, 20)}...", Age: ${age}`);
    
    // Special characters in name
    const specialName = "José María O'Connor-Smith 🚀";
    await (profile as any).setProfile(specialName, 42);
    [name, age] = await (profile as any).getProfile();
    console.log(`   Special chars: "${name}", Age: ${age}`);
    
    // Large age test (using a reasonable large number)
    const largeAge = 150; // Reasonable maximum age for testing
    await (profile as any).setProfile("Max Age User", largeAge);
    [name, age] = await (profile as any).getProfile();
    console.log(`   Large age: "${name}", Age: ${age}`);
    
    console.log("\n🎉 All interactions completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during interaction:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
