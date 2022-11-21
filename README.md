# Week 3 - Tokenized Ballot

This is a simple tokenized ballot system. The system is composed of two contracts: an ERC20 `Token` contract and the `Ballot` contract. The `Ballot` contract is the ballot itself, and the `Token` contract is the token that is used to account for the voting power.

The order of scripts to run:

- DeployToken.ts (deploys the token) +
- DistributeToken.ts (mints and distributes the token to the voters) +
- Delegate.ts (delegates votes to a voter or to oneself) +
- DeployBallot.ts (deploys the ballot) +
- Vote.ts (votes for a candidate proposal) +
- FinalizeBallot.ts (finalizes the ballot)
