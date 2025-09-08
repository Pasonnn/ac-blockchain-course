import { ethers } from "hardhat";

async function main() {
  console.log("🔗 Interacting with StudentRegistry contract...\n");

  try {
    // Get the contract factory
    const StudentRegistry = await ethers.getContractFactory("StudentRegistry");
    
    // Deploy a new instance for demonstration
    const studentRegistry = await StudentRegistry.deploy();
    await studentRegistry.waitForDeployment();
    
    const address = await studentRegistry.getAddress();
    console.log(`📍 Contract deployed at: ${address}`);
    
    // Get multiple signers for testing
    const [deployer, student1, student2, student3] = await ethers.getSigners();
    console.log(`👤 Available accounts:`);
    console.log(`   Deployer: ${deployer.address}`);
    console.log(`   Student 1: ${student1.address}`);
    console.log(`   Student 2: ${student2.address}`);
    console.log(`   Student 3: ${student3.address}`);
    
    // Test initial state
    console.log("\n🔍 Testing initial state...");
    const initialCheck = await (studentRegistry as any).isStudentRegistered(student1.address);
    console.log(`   Student 1 registered: ${initialCheck ? "✅ Yes" : "❌ No"}`);
    
    // Register multiple students
    console.log("\n📝 Registering students...");
    
    // Register student 1
    console.log("   Registering Student 1: Bob Smith, Age 19");
    await (studentRegistry as any).connect(student1).register("Bob Smith", 19);
    
    // Register student 2
    console.log("   Registering Student 2: Alice Johnson, Age 20");
    await (studentRegistry as any).connect(student2).register("Alice Johnson", 20);
    
    // Register student 3
    console.log("   Registering Student 3: Charlie Brown, Age 21");
    await (studentRegistry as any).connect(student3).register("Charlie Brown", 21);
    
    // Verify registrations
    console.log("\n✅ Verifying registrations...");
    const students = [
      { address: student1.address, name: "Bob Smith" },
      { address: student2.address, name: "Alice Johnson" },
      { address: student3.address, name: "Charlie Brown" }
    ];
    
    for (const student of students) {
      const isRegistered = await (studentRegistry as any).isStudentRegistered(student.address);
      const studentInfo = await (studentRegistry as any).getStudent(student.address);
      console.log(`   ${student.name}: ${isRegistered ? "✅ Registered" : "❌ Not Registered"}`);
      console.log(`     Name: "${studentInfo.name}", Age: ${studentInfo.age}, Registered: ${studentInfo.isRegistered}`);
    }
    
    // Test duplicate registration (should fail)
    console.log("\n🚫 Testing duplicate registration...");
    try {
      await (studentRegistry as any).connect(student1).register("Bob Smith Jr", 22);
      console.log("   ❌ ERROR: Duplicate registration should have failed!");
    } catch (error) {
      console.log("   ✅ Correctly rejected duplicate registration");
    }
    
    // Test reading student info by address
    console.log("\n🔍 Testing student info retrieval...");
    const student1Info = await (studentRegistry as any).getStudent(student1.address);
    const student2Info = await (studentRegistry as any).getStudent(student2.address);
    const student3Info = await (studentRegistry as any).getStudent(student3.address);
    
    console.log(`   Student 1: "${student1Info.name}", Age: ${student1Info.age}`);
    console.log(`   Student 2: "${student2Info.name}", Age: ${student2Info.age}`);
    console.log(`   Student 3: "${student3Info.name}", Age: ${student3Info.age}`);
    
    // Test with unregistered address
    console.log("\n🧪 Testing with unregistered address...");
    const unregisteredAddress = "0x1234567890123456789012345678901234567890";
    const isUnregistered = await (studentRegistry as any).isStudentRegistered(unregisteredAddress);
    const unregisteredInfo = await (studentRegistry as any).getStudent(unregisteredAddress);
    console.log(`   Unregistered address: ${isUnregistered ? "✅ Registered" : "❌ Not Registered"}`);
    console.log(`   Unregistered info: Name="${unregisteredInfo.name}", Age: ${unregisteredInfo.age}, Registered: ${unregisteredInfo.isRegistered}`);
    
    // Test edge cases
    console.log("\n🧪 Testing edge cases...");
    
    // Test with empty name
    console.log("   Testing registration with empty name...");
    try {
      await (studentRegistry as any).connect(deployer).register("", 25);
      const emptyNameInfo = await (studentRegistry as any).getStudent(deployer.address);
      console.log(`   ✅ Empty name accepted: "${emptyNameInfo.name}"`);
    } catch (error) {
      console.log("   ❌ Empty name rejected:", error as string);
    }
    
    // Test with age 0
    console.log("   Testing registration with age 0...");
    try {
      const testAddress = "0x1111111111111111111111111111111111111111";
      // We need to use a different address since deployer might already be registered
      const tempSigner = new ethers.Wallet("0x1234567890123456789012345678901234567890123456789012345678901234", deployer.provider);
      await (studentRegistry as any).connect(tempSigner).register("Test User", 0);
      console.log("   ✅ Age 0 accepted");
    } catch (error) {
      console.log("   ❌ Age 0 rejected:", error as string);
    }
    
    // Test with very long name
    console.log("   Testing registration with very long name...");
    const longName = "A".repeat(100);
    try {
      const tempSigner2 = new ethers.Wallet("0x2222222222222222222222222222222222222222222222222222222222222222", deployer.provider);
      await (studentRegistry as any).connect(tempSigner2).register(longName, 30);
      const longNameInfo = await (studentRegistry as any).getStudent(tempSigner2.address);
      console.log(`   ✅ Long name accepted: "${longNameInfo.name.substring(0, 20)}..." (${longNameInfo.name.length} chars)`);
    } catch (error) {
      console.log("   ❌ Long name rejected:", error as string);
    }
    
    // Test special characters in name
    console.log("   Testing registration with special characters...");
    const specialName = "José María O'Connor-Smith 🚀";
    try {
      const tempSigner3 = new ethers.Wallet("0x3333333333333333333333333333333333333333333333333333333333333333", deployer.provider);
      await (studentRegistry as any).connect(tempSigner3).register(specialName, 25);
      const specialNameInfo = await (studentRegistry as any).getStudent(tempSigner3.address);
      console.log(`   ✅ Special characters accepted: "${specialNameInfo.name}"`);
    } catch (error) {
      console.log("   ❌ Special characters rejected:", error as string);
    }
    
    console.log("\n🎉 All interactions completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during interaction:", error as string);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
