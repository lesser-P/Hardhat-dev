// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract WorldCupLotter {
    //状态变量（上链的）：管理员，第几期，记录所有玩家，统计每个球队参与者，记录获奖者信息，参赛球队
    //核心方法：下注，开奖，领奖
    //辅助方法：获取奖金池金额，管理员地址，当前期数，参与人数，所有玩家，参赛球队

    address public manager;

    uint8 public currRound;

    uint256 public deadline;

    string[] public contries = [
        "GERMANY",
        "FRANCH",
        "CHINA",
        "BRIZAL",
        "KOREA"
    ];

    enum Country {
        GERMSNY,
        FRANCH,
        CHINA,
        BRIZAL,
        KOREA
    }

    struct Player {
        bool flag;
        //一个人可以投多个国家
        mapping(Country => uint8) counts;
    }
    //第几期=》用户地址=》用户详情
    mapping(uint8 => mapping(address => Player)) public players;
    //第几期=》国家=》用户地址
    mapping(uint8 => mapping(Country => address[])) public countryToPlayers;

    //每个地址对应的奖励
    mapping(address => uint256) public winnerValuts;

    //没有被领取的奖励锁起来
    uint256 public lockAmt;

    event TransferMgr(address indexed _prev, address indexed _newMgr);
    event Play(uint8 _round, address _player, Country _selected);
    event Finalizes(uint8 _round, Country _selected);
    event Claim(address _player, uint256 _amount);

    constructor(uint256 _deadline) {
        require(block.timestamp < _deadline, "nowtime over deadline");
        //交易的发起人
        manager = msg.sender;
        deadline = _deadline;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "not authorized");
        _;
    }

    function transferMgr(address _mgr) public returns (bool) {
        require(msg.sender == manager, "not authorized");
        manager = _mgr;
        emit TransferMgr(manager, _mgr);
    }

    function play(Country _selected) public payable {
        require(msg.value >= 1 gwei, "ether less 1 gwei");

        //更新countries
        //往状态变量的数组中追加数据，使用push
        countryToPlayers[currRound][_selected].push(msg.sender);

        //更新players
        //获取Player结构
        //更新数据
        Player storage player = players[currRound][msg.sender];
        player.counts[_selected]++;

        emit Play(currRound, msg.sender, _selected);
    }

    //开奖
    function Finalize(Country _selected) public onlyManager {
        //找到所有赢家
        address[] memory winners = countryToPlayers[currRound][_selected];

        //获取当前合约可用金额
        uint256 currentBalance = getValutBalance() - lockAmt;

        //计算每个人奖励多少
        for (uint i = 0; i < winners.length; i++) {
            address currentWinner = winners[i];
            //获取当前下了多少注
            Player storage winner = players[currRound][currentWinner];
            uint256 currCount = winner.counts[_selected];

            //统计这个winner该分的多少奖励
            uint amt = (currentBalance /
                countryToPlayers[currRound][_selected].length) * currCount;

            //更新currWinner能够领取的奖励
            winnerValuts[currentWinner] += amt;
            lockAmt += amt;
        }

        //给每个人分配数量

        emit Finalizes(currRound, _selected);
    }

    //领奖
    function claimReward() public {
        //每个人都可以调用，但是只能领取属于自己的钱
        uint256 rewards = winnerValuts[msg.sender];
        require(rewards > 0, "nothing to claim");

        //更新msg.sender转账,奖励清0
        winnerValuts[msg.sender] = 0;
        lockAmt -= rewards;
        payable(msg.sender).transfer(rewards);
        emit Claim(msg.sender, rewards);
    }

    //获得合约资金
    function getValutBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
