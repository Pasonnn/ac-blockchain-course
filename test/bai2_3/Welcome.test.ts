import { expect } from "chai";
import { ethers } from "hardhat";
describe("Welcome Contract", function () {
  let welcomeContract: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    // Get signers (accounts)
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    const WelcomeFactory = await ethers.getContractFactory("Welcome");
    welcomeContract = await WelcomeFactory.deploy("Hello, World!");
    await welcomeContract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct initial greeting", async function () {
      const greeting = await welcomeContract.getGreeting();
      expect(greeting).to.equal("Hello, World!");
    });

    it("Should set the correct initial greeting", async function () {
      const greeting = await welcomeContract.getGreeting();
      expect(greeting).to.equal("Hello, World!");
    });
  });

  describe("Greeting Functions", function () {
    it("Should return the current greeting", async function () {
      const greeting = await welcomeContract.getGreeting();
      expect(greeting).to.equal("Hello, World!");
    });

    it("Should allow setting a new greeting", async function () {
      const newGreeting = "Welcome to Blockchain!";
      await welcomeContract.setGreeting(newGreeting);
      
      const updatedGreeting = await welcomeContract.getGreeting();
      expect(updatedGreeting).to.equal(newGreeting);
    });

    it("Should allow multiple greeting updates", async function () {
      // First update
      await welcomeContract.setGreeting("First update");
      expect(await welcomeContract.getGreeting()).to.equal("First update");

      // Second update
      await welcomeContract.setGreeting("Second update");
      expect(await welcomeContract.getGreeting()).to.equal("Second update");
    });

    it("Should handle empty string greeting", async function () {
      await welcomeContract.setGreeting("");
      const greeting = await welcomeContract.getGreeting();
      expect(greeting).to.equal("");
    });

    it("Should handle long string greeting", async function () {
      const longGreeting = "This is a very long greeting message that tests the contract's ability to handle longer strings without any issues. It should work perfectly fine.";
      await welcomeContract.setGreeting(longGreeting);
      
      const greeting = await welcomeContract.getGreeting();
      expect(greeting).to.equal(longGreeting);
    });
  });

  describe("Access Control", function () {
    it("Should allow any address to call setGreeting", async function () {
      const newGreeting = "Greeting from addr1";
      await welcomeContract.connect(addr1).setGreeting(newGreeting);
      
      const greeting = await welcomeContract.getGreeting();
      expect(greeting).to.equal(newGreeting);
    });

    it("Should allow any address to call getGreeting", async function () {
      const greeting = await welcomeContract.connect(addr1).getGreeting();
      expect(greeting).to.equal("Hello, World!");
    });
  });

  describe("Gas Optimization", function () {
    it("Should use reasonable gas for setGreeting", async function () {
      const tx = await welcomeContract.setGreeting("Gas test greeting");
      const receipt = await tx.wait();
      
      // Gas used should be reasonable (less than 100k for a simple storage update)
      expect(receipt?.gasUsed).to.be.lessThan(100000n);
    });

    it("Should use minimal gas for getGreeting (view function)", async function () {
      const tx = await welcomeContract.getGreeting();
      // View functions don't consume gas on the caller's side
      expect(tx).to.be.a("string");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle special characters in greeting", async function () {
      const specialGreeting = "Hello! @#$%^&*()_+-=[]{}|;':\",./<>?";
      await welcomeContract.setGreeting(specialGreeting);
      
      const greeting = await welcomeContract.getGreeting();
      expect(greeting).to.equal(specialGreeting);
    });

    it("Should handle unicode characters", async function () {
      const unicodeGreeting = "Hello 世界! 🌍 🚀";
      await welcomeContract.setGreeting(unicodeGreeting);
      
      const greeting = await welcomeContract.getGreeting();
      expect(greeting).to.equal(unicodeGreeting);
    });
  });
});
