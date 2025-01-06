const hre = require("hardhat");
const { ethers, upgrades, waffle } = require("hardhat");

DCR_ADDRESS = null;
TOKEN_ADDRESS = "0x0711ed8b4d1eb1a935cdcc376a205c7dca584457";

async function main() {
  if (!TOKEN_ADDRESS) {
    throw new Error(
      "Please set TOKEN_ADDRESS to your deployed AllYourBase token address"
    );
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deploying faucet contract with account:", deployer.address);
  console.log("Using token address:", TOKEN_ADDRESS);

  await deployFaucet(TOKEN_ADDRESS);
}

async function deployFaucet(tokenAddress) {
  const FACTORY = await ethers.getContractFactory("DCRRaceFaucet");
  let contract;

  if (DCR_ADDRESS) {
    contract = await upgrades.upgradeProxy(DCR_ADDRESS, FACTORY);
  } else {
    contract = await upgrades.deployProxy(FACTORY);
    let tx = await contract.setBetToken(tokenAddress);
    await tx.wait();
  }

  await contract.deployed();
  console.log("DCRRaceFaucet deployed to:", contract.address);

  // Verify contract
  try {
    await hre.run("verify:verify", {
      address: contract.address,
    });
    console.log("Faucet contract verified");
  } catch (error) {
    console.error("Verification error:", error);
  }

  return contract;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
