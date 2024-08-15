const { ethers } = require("hardhat");
const path = require("path");

async function main() {
  if (network.name === "hardhat") {
    console.warn(
      "You are trying to deploy a contract to the Hardhat Network, which" +
        "gets automatically created and destroyed every time. Use the Hardhat" +
        " option '--network linea-sepolia'"
    );
  }

  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy MyERC20Token
  const MyERC20Token = await ethers.getContractFactory("MyERC20Token");
  const myERC20Token = await MyERC20Token.deploy("MyToken", "MTK");
  await myERC20Token.deployed();
  console.log("MyERC20Token address:", myERC20Token.address);

  // Deploy MyERC721
  const MyERC721 = await ethers.getContractFactory("MyERC721");
  const myERC721 = await MyERC721.deploy();
  await myERC721.deployed();
  console.log("MyERC721 address:", myERC721.address);

  // Deploy DepositContract
  const DepositContract = await ethers.getContractFactory("DepositContract");
  const depositContract = await DepositContract.deploy(myERC20Token.address, myERC721.address);
  await depositContract.deployed();
  await myERC721.setDepositContract(depositContract.address);
  console.log("DepositContract address:", depositContract.address);

  // Save the contract addresses
  saveFrontendFiles({
    MyERC20Token: myERC20Token.address,
    MyERC721: myERC721.address,
    DepositContract: depositContract.address,
  });
}

function saveFrontendFiles(addresses) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify(addresses, undefined, 2)
  );

  const myartifacts = [
    "MyERC20Token",
    "MyERC721",
    "DepositContract"
  ];

  // biome-ignore lint/complexity/noForEach: <explanation>
  myartifacts.forEach(artifact => {
    const ContractArtifact = artifacts.readArtifactSync(artifact);
    fs.writeFileSync(
      path.join(contractsDir, `${artifact}.json`),
      JSON.stringify(ContractArtifact, null, 2)
    );
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });