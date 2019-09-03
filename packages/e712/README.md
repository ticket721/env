<p align="center">
  <img src="https://github.com/ticket721/env/raw/develop/packages/e712/imgs/title.png">
</p>

# Pure Typescript/Javascript implementation of the Ethereum Improvement Proposal 712

## Motivation

Have a complete library to issue EIP712 signature, verify them, or simply encode payloads or verify their format. Also provide a pure TS/JS implementation that can be used inside the browser or in restricted JS environments (React Native / Expo ...).

## Installation

    npm install --save @ticket721/e712

## Documentation

You can find the documentation for the module [here](https://github.com/ticket721/env/tree/develop/packages/e712/docs/modules/_eip712signer_.md)

## Usage

For a live usage, take a look at [the last test](./sources/EIP712.test.ts).

### Setup

This is an example showcasing how you can integrate the provided class into your own extension of it.
You can of course directly use the main methods without having to create wrapping ones, they are just here to illustrate
`e712`.

```typescript

import { EIP712Signer, EIP712Payload } from '@ticket721/e712';

const User = [
    {
        name: 'firstName',
        type: 'string'
    },
    {
        name: 'lastName',
        type: 'string'
    },
    {
        name: 'age',
        type: 'uint256'
    }
];

const domain = {
    name: 'User Infos',
    version: '1',
    chainId: 1,
    verifyingContract: '0xe4937b3fead67f09f5f15b0a1991a588f7be54ca'
};

const primaryType = 'User';

class UserInfos extends EIP712Signer {

    private firstName: string = null;
    private lastName: string = null;
    private age: number = null;

    constructor() {
        super(
            domain,
            primaryType,
            ['User', User]
        );
    }

    /**
    * Helper function to set values before doing any signature or building any payload
    * 
    * @param firstName
    * @param lastName
    * @param age
    */
    setUserInfos(firstName: string, lastName: string, age: number): void {
        if (!firstName || !lastName || age <= 0) throw new Error('Invalid User Information');

        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }

    getPayload(): EIP712Payload {
        const message_paylaod = {
            firstName: this.firstName,
            lastName: this.lastName,
            age: this.age
        };

        return this.generatePayload(message_paylaod);
    }

    /**
    * Generate a signature from the values previously given by the user
    * 
    * @param privateKey
    */
    getSignature(privateKey: string): Promise<string> {

        const payload = this.getPayload();

        return this.sign(privateKey, payload)

    }

    /**
    * Verifies a given signature and retrieves the signer address
    * 
    * @param firstName
    * @param lastName
    * @param age
    * @param signature
    */
    async getSignerAddress(firstName: string, lastName: string, age: number, signature: string): Promise<string> {
        if (!firstName || !lastName || age <= 0) throw new Error('Invalid User Information');

        const message_paylaod = {
            firstName: this.firstName,
            lastName: this.lastName,
            age: this.age
        };

        const original_payload = this.generatePayload(message_paylaod);

        return this.verify(original_payload, signature);
    }
}

```

### User end usage

This is what should happen on client side when you want a user to sign something with its private key or with a third party
provider.

```typescript

const user_infos = new UserInfos();

user_infos.setUserInfos('John', 'Doe', 22);

// Generate the signature in place

// We are using the 'ethers' package to generate the wallets
const my_user_wallet = Wallet.createRandom();

const signature = await user_infos.getSignature(my_user_wallet.privateKey);

console.log('Signed by ', my_user_wallet.address);

// If user uses a web3 browser able to sign the payloads itself, provide the following data as argument

const ready_to_sign_with_third_party_wallet_provider = user_infos.getPayload();

```

### Verification end usage

```typescript

// Pretend this has been provided in some way to the verification end
const firstName = 'John';
const lastName = 'Doe';
const age = 22;

const signer = await user_infos.getSignerAddress(firstName, lastName, age, signature);

console.log('Signature signed by ', signer);

```

### Third party signature

To sign with a third party wallet provider (let's say metamask), just run the following

<p align="center">
<img height="500" src="https://github.com/ticket721/env/raw/develop/packages/e712/imgs/metamask.png">
</p>

```typescript

const ready_to_sign_with_third_party_wallet_provider = user_infos.getPayload();
const user_ethereum_address = '0x...';


web3.currentProvider.sendAsync({
        method: 'eth_signTypedData_v3',
        params: [
            user_ethereum_address,
            JSON.stringify(ready_to_sign_with_third_party_wallet_provider)
        ],
        from: user_ethereum_address},
    (error, result) => {
        // do your stuff, signature is in result.result (if no errors)
    });

```

## API

### Table of contents
