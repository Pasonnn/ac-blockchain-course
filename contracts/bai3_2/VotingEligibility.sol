// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VotingEligibility {
    uint public minAge = 18; // Default minimum age as per requirements
    uint public maxAge = 100;
    address public owner;

    // Event
    event maxAgeUpdated();
    event minAgeUpdated();

    // Error
    error invalidMinAge();
    error invalidMaxAge();

    constructor() {
        // Constructor can be empty since minAge is initialized above
        owner = msg.sender;
    }

    function checkEligibility(uint age) external view returns (bool) {
        return (age >= minAge && age <= maxAge);
    }

    function updateMinAge(uint newMinAge) public onlyDeployer {
        if (newMinAge < minAge) revert invalidMinAge();
        if (newMinAge > maxAge) revert invalidMinAge();
        minAge = newMinAge;
        emit minAgeUpdated();
    }

    function updateMaxAge(uint newMaxAge) public onlyDeployer {
        if (newMaxAge > maxAge) revert invalidMaxAge();
        if (newMaxAge < minAge) revert invalidMaxAge();
        maxAge = newMaxAge;
        emit maxAgeUpdated();
    }

    modifier onlyDeployer() {
        require(msg.sender == owner, "Only deployer can call this function");
        _;
    }
}
