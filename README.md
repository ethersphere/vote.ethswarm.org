This repository contains the source code of the voting endpoint at `vote.ethswarm.org` used in the **Swarm bonding curve community vote**

# Setup

1. Install project dependencies with `npm install`

# Verify the results

1. Download the CSV from https://snapshot.org/#/swarmfoundation.eth/proposal/0x28b308188ed7afba140ac5629b2aff4d6b6012b400403468e595d4af0549cdbd
2. Save it in `./snapshot-report-0x28b308188ed7afba140ac5629b2aff4d6b6012b400403468e595d4af0549cdbd.csv`
3. Verify the voting results CSV by running `npm run verify`

# Run the API

1. Run `npm start` to start the API server
2. Replace address and open `http://localhost:3000/get_vote_count?addresses=<address>` in browser

# Build the staking database

1. Download the staking event data from https://api.swarmscan.io/v1/events/staking/stake-updated/dump
2. Save it in `./data/swarmscan-events-staking-stake.json`
3. Run `npm run db`
