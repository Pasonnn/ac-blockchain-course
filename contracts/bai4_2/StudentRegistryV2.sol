// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract StudentRegistryV2 {
    struct Student {
        string name;
        uint age;
        bool isRegistered;
    }

    address public owner;

    event NewStudent(address indexed studentAddress, string name, uint age);
    
    mapping(address => Student) public students;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function registerStudent(address _studentAddress, string memory _name, uint _age) public onlyOwner {
        require(!students[_studentAddress].isRegistered, "Student already registered");
        students[_studentAddress] = Student(_name, _age, true);
        emit NewStudent(_studentAddress, _name, _age);
    }

    function getStudent(address _address) public view returns (Student memory) {
        return students[_address];
    }

    function isStudentRegistered(address _address) public view returns (bool) {
        return students[_address].isRegistered;
    }
}