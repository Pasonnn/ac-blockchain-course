// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Voting {

    event CandidateAdded(uint indexed candidateId, string name);
    event Voted(address indexed voter, uint indexed candidateId);

    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    address public owner;
    uint public totalCandidates;

    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates[totalCandidates] = Candidate(_name, 0);
        emit CandidateAdded(totalCandidates, _name);
        totalCandidates++;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory _candidates = new Candidate[](totalCandidates);
        for (uint i = 0; i < totalCandidates; i++) {
            _candidates[i] = candidates[i];
        }
        return _candidates;
    }

    function vote(uint _candidateId) public {
        require(!hasVoted[msg.sender], "You have already voted");
        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit Voted(msg.sender, _candidateId);
    }
}