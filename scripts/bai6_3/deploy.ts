import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying MyNFT (ERC721) contract...");

  // Get the contract factory
  const MyNFT = await ethers.getContractFactory("MyNFT");

  // Deploy the contract
  const myNFT = await MyNFT.deploy();
  await myNFT.waitForDeployment();

  const address = await myNFT.getAddress();
  console.log(`✅ MyNFT contract deployed to: ${address}`);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`👤 Deployed by: ${deployer.address}`);

  // Test initial state
  console.log("\n🧪 Testing initial contract state...");
  
  // Check contract details
  const name = await (myNFT as any).name();
  const symbol = await (myNFT as any).symbol();
  const nextTokenId = await (myNFT as any).nextTokenId();
  
  console.log(`   NFT Name: ${name}`);
  console.log(`   NFT Symbol: ${symbol}`);
  console.log(`   Next Token ID: ${nextTokenId}`);

  // Mint NFT for deployer
  console.log("\n🎨 Minting NFT for deployer...");
  
  const mintTx = await (myNFT as any).mint(deployer.address);
  const mintReceipt = await mintTx.wait();
  console.log(`   ✅ Mint transaction hash: ${mintTx.hash}`);
  console.log(`   📊 Gas used: ${mintReceipt?.gasUsed?.toString()}`);
  
  // Check token ownership
  const tokenId = 0; // First token should have ID 0
  const tokenOwner = await (myNFT as any).ownerOf(tokenId);
  console.log(`   Token ${tokenId} owner: ${tokenOwner}`);
  
  if (tokenOwner === deployer.address) {
    console.log("   ✅ NFT minted successfully to deployer");
  } else {
    console.log("   ❌ NFT minting failed");
  }
  
  // Check next token ID
  const newNextTokenId = await (myNFT as any).nextTokenId();
  console.log(`   Next Token ID after mint: ${newNextTokenId}`);
  
  if (newNextTokenId.toString() === "1") {
    console.log("   ✅ Next token ID incremented correctly");
  } else {
    console.log("   ❌ Next token ID not incremented");
  }

  // Test minting to different addresses
  console.log("\n🎨 Testing minting to different addresses...");
  
  const [, recipient1, recipient2] = await ethers.getSigners();
  
  // Mint to recipient1
  console.log(`   Minting NFT to recipient1: ${recipient1.address}`);
  const mintTx1 = await (myNFT as any).mint(recipient1.address);
  await mintTx1.wait();
  
  const token1Owner = await (myNFT as any).ownerOf(1);
  console.log(`   Token 1 owner: ${token1Owner}`);
  
  // Mint to recipient2
  console.log(`   Minting NFT to recipient2: ${recipient2.address}`);
  const mintTx2 = await (myNFT as any).mint(recipient2.address);
  await mintTx2.wait();
  
  const token2Owner = await (myNFT as any).ownerOf(2);
  console.log(`   Token 2 owner: ${token2Owner}`);

  // Test minting by different users (since there's no onlyOwner modifier)
  console.log("\n🎨 Testing minting by different users...");
  
  // Try to mint as recipient1 (should work since no access control)
  console.log("   Testing mint by recipient1...");
  try {
    const userMintTx = await (myNFT as any).connect(recipient1).mint(recipient1.address);
    await userMintTx.wait();
    const userTokenOwner = await (myNFT as any).ownerOf(3);
    console.log(`   ✅ User mint successful! Token 3 owner: ${userTokenOwner}`);
  } catch (error) {
    console.log("   ❌ User mint failed:", (error as any).message || "Error");
  }

  // Check all token owners
  console.log("\n📊 Current NFT ownership:");
  const finalNextTokenId = await (myNFT as any).nextTokenId();
  
  for (let i = 0; i < finalNextTokenId; i++) {
    const owner = await (myNFT as any).ownerOf(i);
    console.log(`   Token ${i}: ${owner}`);
  }

  // Test NFT metadata and properties
  console.log("\n🔍 Testing NFT properties...");
  
  // Check if contract supports ERC721 interface
  try {
    const supportsInterface = await (myNFT as any).supportsInterface("0x80ac58cd"); // ERC721 interface ID
    console.log(`   Supports ERC721 interface: ${supportsInterface ? "✅ Yes" : "❌ No"}`);
  } catch (error) {
    console.log("   ⚠️ Could not check ERC721 interface support");
  }
  
  // Check total supply (if available)
  try {
    const totalSupply = await (myNFT as any).totalSupply();
    console.log(`   Total Supply: ${totalSupply}`);
  } catch (error) {
    console.log("   ⚠️ Total supply not available (not implemented)");
  }

  // Test edge cases
  console.log("\n🧪 Testing edge cases...");
  
  // Mint to zero address (should fail)
  console.log("   Testing mint to zero address...");
  try {
    await (myNFT as any).mint(ethers.ZeroAddress);
    console.log("   ❌ ERROR: Minting to zero address should fail!");
  } catch (error) {
    console.log("   ✅ Correctly rejected mint to zero address");
  }
  
  // Mint to contract address
  console.log("   Testing mint to contract address...");
  try {
    await (myNFT as any).mint(address); // Mint to the NFT contract itself
    const contractTokenOwner = await (myNFT as any).ownerOf(finalNextTokenId);
    console.log(`   ✅ Minted to contract address: ${contractTokenOwner}`);
  } catch (error) {
    console.log("   ❌ Failed to mint to contract address");
  }

  // Test multiple rapid mints
  console.log("\n⚡ Testing rapid minting...");
  
  const rapidMintCount = 5;
  console.log(`   Performing ${rapidMintCount} rapid mints...`);
  
  for (let i = 0; i < rapidMintCount; i++) {
    await (myNFT as any).mint(deployer.address);
    const currentNextId = await (myNFT as any).nextTokenId();
    console.log(`     Mint ${i + 1}: Next Token ID = ${currentNextId}`);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Key Features:");
  console.log("• ERC721 NFT contract with public minting");
  console.log("• Automatic token ID incrementing");
  console.log("• Safe minting with _safeMint");
  console.log("• Multiple NFT minting to different addresses");
  console.log("• Anyone can mint (no access control)");
  console.log("• Gas-efficient operations");
  console.log("• Ready for interaction and testing");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
