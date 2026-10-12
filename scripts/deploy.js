const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying Apex NFT Bridge with account:", deployer.address);

  const MockNFT = await hre.ethers.getContractFactory("MockNFT");
  const nft = await MockNFT.deploy();
  await nft.waitForDeployment();
  console.log("Mock NFT deployed to:", await nft.getAddress());

  const ApexNFTBridge = await hre.ethers.getContractFactory("ApexNFTBridge");
  const bridge = await ApexNFTBridge.deploy(deployer.address);
  await bridge.waitForDeployment();
  console.log("ApexNFTBridge deployed to:", await bridge.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
