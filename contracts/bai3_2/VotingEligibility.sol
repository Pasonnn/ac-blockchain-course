// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VotingEligibility {
    uint public minAge = 18; // Default minimum age as per requirements

    constructor() {
        // Constructor can be empty since minAge is initialized above
    }

    function checkEligibility(uint age) public view returns (bool) {
        if (age >= minAge) {
            return true;
        } else {
            return false;
        }
    }

    function updateMinAge(uint newMinAge) public {
        require(msg.sender == tx.origin, "Only deployer can call this function");
        minAge = newMinAge;
    }
}