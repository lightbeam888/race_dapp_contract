const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying token contract with account:", deployer.address);

  // Deploy AllYourBase token
  const Token = await ethers.getContractFactory("AllYourBase");
  const token = await Token.deploy();
  await token.deployed();

  console.log("AllYourBase Token deployed to:", token.address);

  // Verify contract
  try {
    await hre.run("verify:verify", {
      address: token.address,
    });
    console.log("Token contract verified");
  } catch (error) {
    console.error("Verification error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
