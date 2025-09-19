// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Profile {
    string public name;
    uint public age;

    constructor(string memory _name, uint _age) {
        name = _name;
        age = _age;
    }

    function setProfile(string memory _name, uint _age) public {
        name = _name;
        age = _age;
    }

    function getProfile() public view returns (string memory, uint) {
        return (name, age);
    }
}

contract Student is Profile {
    // This is a constructor of Student contract that calls the constructor of Profile contract
    constructor(string memory _name, uint _age) Profile(_name, _age) {}

    function setProfileForSon() public {
        // This is a function of Student contract that calls the function of Profile contract
        setProfile("Son", 21);
    }
}
