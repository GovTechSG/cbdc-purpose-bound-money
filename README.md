<h1 align="center">
    <a href="https://www.pbm.money"><img src="docs/images/logo.png" alt="Purpose Bound Money (PBM)" /></a>
    <p align="center">Project Orchid:<br/>Purpose Bound Money (PBM)</p>
</h1>
<p align="center">
    🔗 Website: <a href="https://www.pbm.money" target="_blank">pbm.money</a>
</p>

## Introduction

The Purpose Bound Money (PBM) proposes a protocol for the use of digital money under specified conditions. As part of a wider pilot in <a href="https://www.mas.gov.sg/publications/monographs-or-information-paper/2022/project-orchid-whitepaper" target="_blank">Project Orchid</a>, this version of the protocol releases escrow payments automatically after a specified period. Visit <a href="https://www.pbm.money" target="_blank">pbm.money</a> for more information on the key features.

## Setup

```bash
yarn install
```

## Packages

This repository is a monorepo of the source files, including the smart contracts, implemented for the PBM protocol.

| Package          | Description                                                            | Actual Site                   |
| ---------------- | ---------------------------------------------------------------------- | ----------------------------- |
| `@pbm/contracts` | Smart contracts used for the PBM token                                 | –                             |
| `@pbm/app`       | The Web3 application frontend for interacting with the smart contracts | [Link](https://app.pbm.money) |
| `@pbm/web`       | The main website at pbm.money homepage                                 | [Link](https://pbm.money)     |

## Getting Started

### Smart Contract Deployments

The following tasks have been implemented using Hardhat for both deploying the smart contracts to the blockchain and verifying them.

| Task Name            | Description                               |
| -------------------- | ----------------------------------------- |
| `deploy:pbm`         | Deploy PBM token                          |
| `deploy:vault`       | Deploy PBM vault                          |
| `dsgd:mint`          | Mint underlying asset token (for testing) |
| `verify:pbm`         | Verify PBM token                          |
| `verify:pbm:proxy`   | Verify PBM token proxy                    |
| `verify:vault`       | Verify PBM vault                          |
| `verify:vault:proxy` | Verify PBM vault proxy                    |

##### Usage

```bash
yarn hardhat <task-name> --network <network> --<arg-name> <arg-value>
```

### Start Application Frontend

#### Production mode

```bash
yarn build:app && yarn start:app
```

#### Development mode

```bash
yarn start:app:dev
```

### Start Main Website

#### Production mode

```bash
yarn build:web && yarn start:web
```

#### Development mode

```bash
yarn start:web:dev
```

### Run Smart Contract Tests

```bash
yarn test:contracts:coverage
```

### Continuous Integration/Deployment

The CI pipeline is setup to deploy to a staging and production environment based on their branches, `staging` and `main`, respectively.

#### Staging Environment

Please raise an issue on Github to request for access to the staging environment if needed.
