const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token and Deposit Contracts", () => {
    // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
    let MyERC20Token, MyERC721, DepositContract;
    // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
    let erc20, erc721, depositContract;
    // biome-ignore lint/style/useSingleVarDeclarator: <explanation>
    let owner, user;
  
    beforeEach(async () => {
      [owner, user] = await ethers.getSigners();
  
      // Deploy ERC20 Token
      MyERC20Token = await ethers.getContractFactory("MyERC20Token");
      erc20 = await MyERC20Token.deploy("MyToken", "MTK");
      await erc20.deployed();
  
      // Deploy ERC721 Token
      MyERC721 = await ethers.getContractFactory("MyERC721");
      erc721 = await MyERC721.deploy();
      await erc721.deployed();
  
      // Deploy Deposit Contract
      DepositContract = await ethers.getContractFactory("DepositContract");
      depositContract = await DepositContract.deploy(erc20.address, erc721.address);
      await depositContract.deployed();
  
      // Transfer ownership of ERC721 to DepositContract
      await erc721.connect(owner).transferOwnership(depositContract.address);
  
      // Mint some tokens to the user
      await erc20.connect(owner).mint(user.address, ethers.utils.parseEther("20000"));
    });
  
    it("Should allow deposit and mint NFT", async () => {
      // Approve deposit contract to spend user's tokens
      await erc20.connect(user).approve(depositContract.address, ethers.utils.parseEther("15000"));
  
      // Deposit tokens
      await depositContract.connect(user).deposit(ethers.utils.parseEther("15000"));
  
      // Check deposit balance
      expect(await depositContract.deposits(user.address)).to.equal(ethers.utils.parseEther("15000"));
  
      // Check if NFT was minted to user
      expect(await erc721.balanceOf(user.address)).to.equal(1);
    });
  });