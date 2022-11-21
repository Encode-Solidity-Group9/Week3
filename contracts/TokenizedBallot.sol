// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./ERC20Votes.sol";

contract Ballot {

    MyToken public voteToken;
    uint256 public targetBlock;
    
    struct Proposal {
        bytes32 name;
        uint voteCount;
    }

    mapping (address => uint256) public votePowerSpent;
    Proposal[] public proposals;

    constructor(bytes32[] memory proposalNames, address _voteToken, uint256 _targetBlock) {
        voteToken = MyToken(_voteToken);
        targetBlock = _targetBlock;
        for (uint i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }



    function vote(uint proposal, uint256 amount) external {
        // uint256 availableVotePower = votePower(msg.sender); // TODO
        // what do we need to check?
        // TODO: check if msg.sender vote power <= amount
        // TODO: check if msg.sender has availableVotePower <= amount

        require(votePower(msg.sender) >= amount, "not enough vote power");

        // TODO: implement the logic
        proposals[proposal].voteCount += amount;
        votePowerSpent[msg.sender] += amount;
        // TODO: reduce the availableVotePower by amount
    }

    function votePower(address account) public view returns (uint256) {
        return voteToken.getPastVotes(account, targetBlock) - votePowerSpent[account];
    }

    function winningProposal() public view returns (uint winningProposal_) {
        uint winningVoteCount = 0;
        for (uint p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
