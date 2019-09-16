**[@ticket721/e712](../README.md)**

[Globals](../globals.md) › ["MTKNSigner"](_mtknsigner_.md)

# External module: "MTKNSigner"

## Index

### Classes

* [MTKNSigner](../classes/_mtknsigner_.mtknsigner.md)

### Interfaces

* [MTKNActors](../interfaces/_mtknsigner_.mtknactors.md)
* [MTKNTxParams](../interfaces/_mtknsigner_.mtkntxparams.md)

### Object literals

* [MTKNTypes](_mtknsigner_.md#const-mtkntypes)

## Object literals

### `Const` MTKNTypes

### ▪ **MTKNTypes**: *object*

Defined in MTKNSigner.ts:5

###  EIP712Domain

• **EIP712Domain**: *object[]* =  EIP712DomainType

Defined in MTKNSigner.ts:6

###  mActors

• **mActors**: *object[]* =  [
        {
            name: 'signer',
            type: 'address'
        },
        {
            name: 'relayer',
            type: 'address'
        }
    ]

Defined in MTKNSigner.ts:8

###  mApprove

• **mApprove**: *object[]* =  [
        {
            name: 'spender',
            type: 'address'
        },
        {
            name: 'amount',
            type: 'uint256'
        },

        {
            name: 'actors',
            type: 'mActors'
        },

        {
            name: 'txparams',
            type: 'mTxParams'
        }
    ]

Defined in MTKNSigner.ts:59

###  mTransfer

• **mTransfer**: *object[]* =  [
        {
            name: 'recipient',
            type: 'address'
        },
        {
            name: 'amount',
            type: 'uint256'
        },

        {
            name: 'actors',
            type: 'mActors'
        },

        {
            name: 'txparams',
            type: 'mTxParams'
        }
    ]

Defined in MTKNSigner.ts:38

###  mTransferFrom

• **mTransferFrom**: *object[]* =  [
        {
            name: 'sender',
            type: 'address'
        },
        {
            name: 'recipient',
            type: 'address'
        },
        {
            name: 'amount',
            type: 'uint256'
        },

        {
            name: 'actors',
            type: 'mActors'
        },

        {
            name: 'txparams',
            type: 'mTxParams'
        }
    ]

Defined in MTKNSigner.ts:80

###  mTxParams

• **mTxParams**: *object[]* =  [
        {
            name: 'nonce',
            type: 'uint256'
        },
        {
            name: 'gasLimit',
            type: 'uint256'
        },
        {
            name: 'gasPrice',
            type: 'uint256'
        },
        {
            name: 'reward',
            type: 'uint256'
        }
    ]

Defined in MTKNSigner.ts:19