# Changes Made
## Summary
The goal is to acquire the original WETH9 contract source code and trim to only what's necessary.

## Detailed Changes
1. Removed all files and directories except for `contracts/*.sol`, `contracts/interfaces/*.sol`, and `contracts/libraries/*.sol`.
2. Update this README for documentation and reproducability.

# Acknowledgments
- **Contributors**: See the [contributors page](https://github.com/Uniswap/v2-core/graphs/contributors) for a comprehensive list of everyone who contributed to the project.



# Uniswap V2

[![Actions Status](https://github.com/Uniswap/uniswap-v2-core/workflows/CI/badge.svg)](https://github.com/Uniswap/uniswap-v2-core/actions)
[![Version](https://img.shields.io/npm/v/@uniswap/v2-core)](https://www.npmjs.com/package/@uniswap/v2-core)

In-depth documentation on Uniswap V2 is available at [uniswap.org](https://uniswap.org/docs).

The built contract artifacts can be browsed via [unpkg.com](https://unpkg.com/browse/@uniswap/v2-core@latest/).

# Local Development

The following assumes the use of `node@>=10`.

## Install Dependencies

`yarn`

## Compile Contracts

`yarn compile`

## Run Tests

`yarn test`
