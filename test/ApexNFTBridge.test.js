const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ApexNFTBridge Protocol Test Suite", function () {
  let deployer, alice, bob;
  let nft, bridge;

  beforeEach(async function () {
    [deployer, alice, bob] = await ethers.getSigners();

    const MockNFT = await ethers.getContractFactory("MockNFT");
    nft = await MockNFT.deploy();
    await nft.waitForDeployment();

    const ApexNFTBridge = await ethers.getContractFactory("ApexNFTBridge");
    bridge = await ApexNFTBridge.deploy(deployer.address);
    await bridge.waitForDeployment();

    await nft.mint(alice.address, 1);
    await nft.connect(alice).approve(await bridge.getAddress(), 1);
  });

  it("Should lock NFT into bridge escrow", async function () {
    await bridge.connect(alice).lockNFT(await nft.getAddress(), 1, 137); // target Polygon (137)
    expect(await nft.ownerOf(1)).to.equal(await bridge.getAddress());
    expect(await bridge.userLockedCount(alice.address)).to.equal(1);
  });

  it("Should unlock NFT with validator authorization and prevent replay", async function () {
    await bridge.connect(alice).lockNFT(await nft.getAddress(), 1, 137);

    const nonce = ethers.encodeBytes32String("nonce-unique-1");
    await bridge.connect(deployer).unlockNFT(bob.address, await nft.getAddress(), 1, nonce);

    expect(await nft.ownerOf(1)).to.equal(bob.address);

    // Replay attack prevention check
    await expect(
      bridge.connect(deployer).unlockNFT(bob.address, await nft.getAddress(), 1, nonce)
    ).to.be.revertedWith("Nonce already processed");
  });
});
