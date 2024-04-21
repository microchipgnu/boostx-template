# Boost engagement on Farcaster (Frames and Attestation System)

The BoostX is a sufficiently decentralized system for community engagement and incentivization using a custom ERC-20 token.
It operates on a cycle of epochs, validating offchain actions like post creation and engagement and consolidating these into on-chain attestations to facilitate token minting.

BoostX aims to minimize costs while maximizing community engagement through a scalable, efficient token distribution system. It is designed to support the Ethereum ecosystem's growth by increasing transaction volume and facilitating DApp development

## How to Boost your community (as a dev)

1. Install BoostX CLI

Source code: https://github.com/microchipgnu/boostx-template

```
npm i -g boostx
```

2. Clone the template 
```
git clone https://github.com/microchipgnu/boostx-template.git
```

3. Run BoostX on your project folder

```
$ boostx new
```

4. Deploy to a provider like Vercel

```
vercel deploy
```

5. Share the link with your community. It is powered with Farcaster Actions and Frames for increased boosting!

## Key Components

1. CLI Tool (boostx): Simplifies the setup process by handling account creation, network selection, and deployment tasks.
    - See: https://github.com/microchipgnu/boostx

2. Entities:
    - Creators: Create content.
    - Engagers: Interact with content.
    - Boosters: Curate and signal boosted content.

3. System Mechanics:
    - Attestation Mechanism: Off-chain validation of activities, which are periodically confirmed on-chain.
    - Watcher: Monitors activities to create attestations.
    - Token Contract: Manages the supply of tokens based on attestations, allowing minting on an EVM-compatible chain. See source code: https://github.com/microchipgnu/boostx/blob/main/core/contracts/basic-erc-20/basic.sol

![image](https://github.com/microchipgnu/boostx-template/assets/5553483/8ad8b565-2c29-4da8-ba33-2627cc3076e4)


## Implementation Details

- The system includes a Vercel Template for deploying the architecture.
- Currently, actions on platforms like Farcaster can trigger attestations, which are used to mint tokens.

## Incentives and Engagement

- Community members are incentivized through tokens for creating and interacting with content.
- A distinct model compared to systems like DEGEN, BOOST emphasizes AI and human alignment to maintain high interaction standards without the need for user-held tokens to participate actively.


## Deployments

| Network          | URL                                                          |
|------------------|--------------------------------------------------------------|
| Base Sepolia     | https://base-sepolia-test-3zyzbnd5y-inventionshub.vercel.app |
| Arbitrum Sepolia | https://arbitrum-test-2-d4j67z877-inventionshub.vercel.app   |
| Gnosis Chiado    | https://boostx-gnosis.vercel.app/                            |

## Farcaster Frames and Actions

![Design sem título (3)](https://github.com/microchipgnu/boostx-template/assets/5553483/044161ef-4c88-4baa-867e-0d934f2b566f)

## Development

```
pnpm install
pnpm run dev
```
