// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

contract Chainlinkdemo is VRFConsumerBaseV2 {
    bytes32 private _keyHash;
    uint64 private _subId;
    uint16 private _minConfirmation;
    uint32 private _callbackGasLimit;
    uint32 private _numWords;
    address private _vrfAddress;

    uint256 public randomNumber;
    uint256 public randomMu;

    constructor(
        address vrfAddress,
        bytes32 keyHash,
        uint64 subId,
        uint16 minConf,
        uint32 callbackGas,
        uint32 numWords
    ) VRFConsumerBaseV2(vrfAddress) {
        _keyHash = keyHash;
        _vrfAddress = vrfAddress;
        _subId = subId;
        _minConfirmation = minConf;
        _callbackGasLimit = callbackGas;
        _numWords = numWords;
    }

    function getRandom() public returns (uint256 requestId) {
        VRFCoordinatorV2Interface vrf = VRFCoordinatorV2Interface(_vrfAddress);
        uint256 requestId = vrf.requestRandomWords(
            _keyHash,
            _subId,
            _minConfirmation,
            _callbackGasLimit,
            _numWords
        );
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal virtual override {
        randomNumber = randomWords[0];
        randomMu = randomNumber % 4;
    }
}
