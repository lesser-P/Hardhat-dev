// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// 0x5b701B547af18437e02C1a81e8cE4fdE229aD9A8
contract YNHToken is ERC20 {
    mapping(address => bool) list;
    mapping(address => uint256) maxScore;

    event transferTo(address indexed from, address indexed to, uint256 amount);

    constructor() ERC20("YNH", "YNH") {
        _mint(msg.sender, 1e20);
        emit transferTo(address(this), msg.sender, 1 gwei);
    }

    function getmaxScore(address from) external returns (uint256) {
        require(from != address(0), "require address is zero");
        return maxScore[from];
    }

    function mint(address to) external {
        require(!list[msg.sender], "msgsender in list");
        list[msg.sender] = true;
        _mint(to, 1 gwei);
        emit transferTo(address(this), to, 1 gwei);
    }

    function getTokens(address to, uint256 _maxScore) external {
        //判断分数是不是历史最高分
        require(maxScore[to] <= _maxScore, "score less than maxScore");
        //更新历史最分
        maxScore[to] = _maxScore;
        //发代币
        _mint(to, _maxScore);
        emit transferTo(address(this), to, _maxScore);
    }
}
