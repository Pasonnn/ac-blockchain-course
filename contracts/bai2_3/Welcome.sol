// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/Strings.sol";
contract Welcome {
    event GreetingUpdated(string greeting);

    string public greeting;
    address public owner;

    constructor(string memory _greeting) {
        greeting = _greeting;
        owner = msg.sender;
    }

    function setGreeting(string memory _greeting) public {
        greeting = _greeting;
        emit GreetingUpdated(greeting);
    }

    function getGreeting() public view returns (string memory) {
        return string(abi.encodePacked(greeting, " by ", Strings.toHexString(uint160(owner), 20)));
    }
}
