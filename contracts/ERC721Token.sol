pragma solidity >=0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract MyERC721 is ERC721 {
    uint256 private _tokenIdCounter;

    constructor() ERC721("MyNFT", "NFT") {}

    function mint(address to) external {
        _safeMint(to, _tokenIdCounter++);
    }

    address public DepositContract;
    function setDepositContract(address _depositContract) external {
        DepositContract = _depositContract;
    }
}

interface IMyERC721 {
    function mint(address to) external;
}

contract DepositContract {
    IERC20 public erc20Token;
    IMyERC721 public erc721Token;

    mapping(address => uint256) public deposits;

    constructor(IERC20 _erc20Token, IMyERC721 _erc721Token) {
        erc20Token = _erc20Token;
        erc721Token = _erc721Token;
    }

    function deposit(uint256 amount) external {
        require(erc20Token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        deposits[msg.sender] += amount;

        console.log("Deposited", deposits[msg.sender]);

        if (deposits[msg.sender] >= 10000 * 10**18) {
            erc721Token.mint(msg.sender);
        }
    }
}