// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract StudentRegistry {
    struct Student {
        string name;
        uint age;
        bool isRegistered;
    }

    mapping(address => Student) public students;

    function register(string memory _name, uint _age) public {
        require(!students[msg.sender].isRegistered, "Student already registered");
        students[msg.sender] = Student(_name, _age, true);
    }

    function getStudent(address _address) public view returns (Student memory) {
        return students[_address];
    }

    function isStudentRegistered(address _address) public view returns (bool) {
        return students[_address].isRegistered;
    }
}