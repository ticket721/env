**[@ticket721/e712](../README.md)**

[Globals](../globals.md) › ["EIP712Signer"](../modules/_eip712signer_.md) › [EIP712Signer](_eip712signer_.eip712signer.md)

# Class: EIP712Signer

Helper class that takes types, domain and primary when built and is able to verify provided arguments, sign payload and verify signatures
This class should be extended by a custom class.

## Hierarchy

* **EIP712Signer**

## Index

### Constructors

* [constructor](_eip712signer_.eip712signer.md#constructor)

### Methods

* [encode](_eip712signer_.eip712signer.md#encode)
* [generatePayload](_eip712signer_.eip712signer.md#generatepayload)
* [sign](_eip712signer_.eip712signer.md#sign)
* [verify](_eip712signer_.eip712signer.md#verify)
* [verifyPayload](_eip712signer_.eip712signer.md#verifypayload)

## Constructors

###  constructor

\+ **new EIP712Signer**(`domain`: [EIP712Domain](../interfaces/_eip712signer_.eip712domain.md), `primary_type`: string, ...`types`: [string, [EIP712Struct](../modules/_eip712signer_.md#eip712struct)][]): *[EIP712Signer](_eip712signer_.eip712signer.md)*

*Defined in [EIP712Signer.ts:381](https://github.com/ticket721/env/blob/5c085aa/packages/e712/sources/EIP712Signer.ts#L381)*

Sets all information related to the signatures that will be generated.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`domain` | [EIP712Domain](../interfaces/_eip712signer_.eip712domain.md) | Domain structure |
`primary_type` | string | Primary Type to use |
`...types` | [string, [EIP712Struct](../modules/_eip712signer_.md#eip712struct)][] | Arrays containing name and fields  |

**Returns:** *[EIP712Signer](_eip712signer_.eip712signer.md)*

## Methods

###  encode

▸ **encode**(`payload`: [EIP712Payload](../interfaces/_eip712signer_.eip712payload.md), `verify`: boolean): *string*

*Defined in [EIP712Signer.ts:424](https://github.com/ticket721/env/blob/5c085aa/packages/e712/sources/EIP712Signer.ts#L424)*

Encode the given payload

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`payload` | [EIP712Payload](../interfaces/_eip712signer_.eip712payload.md) | - | Payload to encode |
`verify` | boolean | false | True if verifications should be made  |

**Returns:** *string*

___

###  generatePayload

▸ **generatePayload**(`data`: any): *[EIP712Payload](../interfaces/_eip712signer_.eip712payload.md)*

*Defined in [EIP712Signer.ts:489](https://github.com/ticket721/env/blob/5c085aa/packages/e712/sources/EIP712Signer.ts#L489)*

Helper that generates a complete payload, ready for signature (should work with web3, metamask etc)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | any | Message field in the generated payload  |

**Returns:** *[EIP712Payload](../interfaces/_eip712signer_.eip712payload.md)*

___

###  sign

▸ **sign**(`privateKey`: string, `payload`: [EIP712Payload](../interfaces/_eip712signer_.eip712payload.md), `verify`: boolean): *Promise‹string›*

*Defined in [EIP712Signer.ts:454](https://github.com/ticket721/env/blob/5c085aa/packages/e712/sources/EIP712Signer.ts#L454)*

Sign the given payload

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`privateKey` | string | - | Private key to use |
`payload` | [EIP712Payload](../interfaces/_eip712signer_.eip712payload.md) | - | Payload to sign |
`verify` | boolean | false | True if verifications should be made  |

**Returns:** *Promise‹string›*

___

###  verify

▸ **verify**(`payload`: [EIP712Payload](../interfaces/_eip712signer_.eip712payload.md), `signature`: string, `verify`: boolean): *Promise‹string›*

*Defined in [EIP712Signer.ts:478](https://github.com/ticket721/env/blob/5c085aa/packages/e712/sources/EIP712Signer.ts#L478)*

Verifies the given signature

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`payload` | [EIP712Payload](../interfaces/_eip712signer_.eip712payload.md) | - | Payload used to generate the signature |
`signature` | string | - | Signature to verify |
`verify` | boolean | false | True if payload verifications should be made  |

**Returns:** *Promise‹string›*

___

###  verifyPayload

▸ **verifyPayload**(`payload`: [EIP712Payload](../interfaces/_eip712signer_.eip712payload.md)): *void*

*Defined in [EIP712Signer.ts:410](https://github.com/ticket721/env/blob/5c085aa/packages/e712/sources/EIP712Signer.ts#L410)*

Throws if provided payload does not match current settings

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`payload` | [EIP712Payload](../interfaces/_eip712signer_.eip712payload.md) | Payload to verify  |

**Returns:** *void*