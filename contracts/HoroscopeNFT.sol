// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract HoroScopeNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;

    constructor() ERC721("YNH", "YNH") {}

    function mintNFT(
        address recipent,
        string memory zodiacSign
    ) public returns (uint256) {
        _tokenId.increment();
        uint256 newItemId = _tokenId.current();
        _mint(recipent, newItemId);
        _setTokenURI(newItemId, zodiacSign);
        return newItemId;
    }
}
