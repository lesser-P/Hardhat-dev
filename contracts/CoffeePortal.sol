pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract CoffeePortal {
    uint256 totalCoffee;
    address payable public owner;

    event NewCoffee(
        address indexed from,
        uint256 times,
        string message,
        string name
    );

    constructor() payable {
        console.log("Yo! Smart Contract");

        owner = payable(msg.sender);

        uint256 num = address(this).balance;
        console.log("num:", num);
    }

    struct Coffee {
        address giver;
        string message;
        string name; //user
        uint256 timestamp; //when user buy me coffee
    }

    Coffee[] coffees;

    function getAllCoffee() public view returns (Coffee[] memory) {
        return coffees;
    }

    function getTotalCoffee() public view returns (uint256) {
        console.log("We have %d total coffee recieved", totalCoffee);
        return totalCoffee;
    }

    function buyCoffee(
        string memory _message,
        string memory _name,
        uint256 _payAmount
    ) public payable {
        uint256 cost = 0.001 ether;
        require(_payAmount <= cost, "eth less than 0.001ether");
        totalCoffee += 1;
        console.log("%s has just sent a coffee!", msg.sender);
        coffees.push(Coffee(msg.sender, _name, _message, block.timestamp));

        (bool success, ) = owner.call{value: _payAmount}(""); //send amount to owner
        require(success, "Faild to send money");

        emit NewCoffee(msg.sender, block.timestamp, _message, _name);
    }
}
