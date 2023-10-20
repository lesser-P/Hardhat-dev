// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "./HogwartsNFT.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract RandomHouseAssignment is VRFConsumerBaseV2 {
    HogwartsNFT public nftContract;
    VRFCoordinatorV2Interface private i_vrfCoordinator;
    uint64 private i_subscriptionId;
    bytes32 private i_keyHash;
    uint32 private i_callbackGasLimit = 200_000;
    mapping(uint256 => address) private s_requestIdToSender;
    mapping(address => string) private s_nameToSender;

    event NftRequested(uint256 indexed requestId, address requester);

    constructor(
        address _nftContract,
        address vrfCoordinatorV2Address,
        uint64 subId,
        bytes32 keyHash
    ) VRFConsumerBaseV2(vrfCoordinatorV2Address) {
        nftContract = HogwartsNFT(_nftContract); //nft实例
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2Address); //VRF实例
        i_subscriptionId = subId;
        i_keyHash = keyHash;
    }

    function requestNFT(string memory name) public returns (uint256) {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_keyHash,
            i_subscriptionId,
            3, //等待打包区块数量
            i_callbackGasLimit,
            2
        );
        s_requestIdToSender[requestId] = msg.sender;
        s_nameToSender[msg.sender] = name;

        emit NftRequested(requestId, msg.sender);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        //发出requestRandomWords请求时会调用这个函数传入随机数
        address nftOwner = s_requestIdToSender[requestId];
        string memory name = s_nameToSender[nftOwner];
        uint256 house = randomWords[0] % 4; //取第一个模四，得到分院id
        nftContract.mintNFT(nftOwner, house, name);
    }
}
