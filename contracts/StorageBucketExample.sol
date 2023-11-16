pragma solidity ^0.8.0;

contract StorageBucketExample {
    struct Storage {
        uint256 foo;
    }

    constructor(uint256 _foo) {}

    function _getStorage() private pure returns (Storage storage stor) {
        bytes32 hash = keccak256(abi.encode("StorageBucketExample.Storage"));
        assembly {
            stor.slot := hash
        }
    }
}
