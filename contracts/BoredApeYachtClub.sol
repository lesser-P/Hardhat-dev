pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract BoredApeYachtClub is ERC721, Ownable {
    using SafeMath for uint256;

    string public BAYC_PROVENAMCE = "";

    uint256 public startingIndexBlock;

    uint256 public startingIndex;

    uint256 public constant apePrice = 80000000000000000; //0.08ETH

    uint public constant maxApePurchase = 20; //最大购买数量

    uint256 public MAX_APES;

    bool public saleIsActive = false;

    uint256 public REVEAL_TIMESTAMP; //出售日期

    constructor(uint256 maxNftSupply, uint256 saleStart) ERC721("YNH", "YNH") {
        MAX_APES = maxNftSupply;
        REVEAL_TIMESTAMP = saleStart + (86400 * 9); //九天后
    }

    //调用者提取合约中的ETH
    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function reserveApes() public onlyOwner {
        uint supply = totalSupply();
    }
}
