import { utils } from 'ethers';
import { BN }    from 'bn.js';

/**
 * Field in a User Defined Types
 */
export interface EIP712StructField {
    name: string;
    type: string;
}

/**
 * User Defined Types are just an array of the fields they contain
 */
export type EIP712Struct = EIP712StructField[];

/**
 * Interface of the EIP712Domain structure
 */
export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number | BN;
    verifyingContract: string;
}

/**
 * Interface of the complete payload required for signing
 */
export interface EIP712Payload {
    types: {
        [key: string]: EIP712Struct
    };
    primaryType: string;
    message: any;
    domain: EIP712Domain;
}

/**
 * EIP712Domain Type, useful as it is always required inside the payload for the signature
 */
export const EIP712DomainType = [
    {
        'name': 'name',
        'type': 'string'
    },
    {
        'name': 'version',
        'type': 'string'
    },
    {
        'name': 'chainId',
        'type': 'uint256'
    },
    {
        'name': 'verifyingContract',
        'type': 'address'
    }
];

/**
 * Byte32 zero value
 */
const B32Z = '0x0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Helper class that takes types, domain and primary when built and is able to verify provided arguments, sign payload and verify signatures
 * This class should be extended by a custom class.
 */
export class EIP712Signer {

    /**
     * All types of current Signer
     */
    private readonly structs: { [key: string]: EIP712Struct } = {
        EIP712Domain: EIP712DomainType
    };

    /**
     * Mandatory domain structure
     */
    private domain: EIP712Domain = {
        name: null,
        version: null,
        verifyingContract: null,
        chainId: null
    };

    /**
     * Mandatory pimaryType field
     */
    private primaryType: string = null;

    /**
     * Required for checks
     */
    private readonly REQUIRED_FIELDS: string[] = ['domain', 'types', 'message', 'primaryType'];

    /**
     * Adds provided type to type list
     *
     * @param name Name of the type
     * @param struct Fields of the type
     * @private
     */
    private _addType(name: string, struct: EIP712Struct): void {
        if (this.structs[name] !== undefined) {
            throw new Error(`Type already exists ${name}`);
        }
        this.structs[name] = struct;
    }

    /**
     * Sets the domain (EIP712Domain) structure
     *
     * @param domain Domain structure
     * @private
     */
    private _setDomain(domain: EIP712Domain): void {
        this.domain = domain;
    }

    /**
     * Sets the primary type field
     *
     * @param ptype Primary type name
     * @private
     */
    private _setPrimaryType(ptype: string): void {
        this.primaryType = ptype;
    }

    /**
     * Encodes a single field. Works by calling itself recursively for complexe types or arrays
     *
     * @param type Name of the given field
     * @param value Value of the given field
     * @private
     */
    private _encodeDataTypeField(type: string, value: any): [string, string] {

        // If it's a structure type
        if (this.structs[type]) {
            return ['bytes32', value === null ? B32Z : this._hashData(type, value)];
        }

        // If it's bytes or string, hash it
        if (type === 'bytes') {
            return ['bytes32', utils.keccak256(value)];
        }

        // If it's bytes or string, hash it
        if (type === 'string') {
            return ['bytes32', utils.keccak256(Buffer.from(value, 'utf8'))];
        }

        // If ends by [], it's an array
        if (type.lastIndexOf('[]') === type.length - 2) {
            const extracted_type = type.slice(0, type.lastIndexOf('[]'));
            const encoded_array = value.map((elem: any): [string, string] => this._encodeDataTypeField(extracted_type, elem));

            const abie = new utils.AbiCoder();

            return ['bytes32', utils.keccak256(
                abie.encode(
                    encoded_array.map((elem: [string, string]): string => elem[0]),
                    encoded_array.map((elem: [string, string]): string => elem[1]),
                )
            )];
        }

        // If it arrives here, it means that it's standard type and no manipulations are required
        return [type, value];
    }

    /**
     * Encodes a type and all of its fields. Is often called recursively when dealing with structures inside structures ...
     *
     * @param name Name of the type
     * @param payload Object that is supposed to contain all fields for given type
     * @private
     */
    private _encodeData(name: string, payload: any): string {

        const encodedTypes: string[] = ['bytes32'];
        const encodedData: string[] = [this._hashType(name)];

        for (const field of this.structs[name]) {

            // Check if all fields of type are found
            if (payload[field.name] === undefined) {
                throw new Error(`Invalid Payload: at type ${name}, missing field ${field.name}`);
            }

            const field_res = this._encodeDataTypeField(field.type, payload[field.name]);

            encodedTypes.push(field_res[0]);
            encodedData.push(field_res[1]);

        }

        const abie = new utils.AbiCoder();

        return abie.encode(encodedTypes, encodedData);
    }

    /**
     * Applies a kecca256 hash to the result of _encodeData
     *
     * @param type Name of the type
     * @param data Object that is supposed to contain all fields for given type
     * @private
     */
    private _hashData(type: string, data: any): string {
        return utils.keccak256(this._encodeData(type, data));
    }

    /**
     * Recursively finds all the dependencies of given type. Required to encode the type.
     *
     * @param type Name of the type
     * @param met Map that stores types already found in the recursive process
     * @private
     */
    private _getDependenciesOf(type: string, met: any = {}): string[] {

        let result = [];

        // If type already found or is not a struct type, stop recursive process
        if (met[type] === true || this.structs[type] === undefined) return result;

        result.push(type);
        met[type] = true;

        for (const field of this.structs[type]) {
            result = result.concat(this._getDependenciesOf(field.type, met));
        }

        return result;
    }

    /**
     * Taking all types, getting all dependencies, putting main type first then all the rest
     * sorted. 100% Inspired by what was done in eth-sig-util
     *
     * @param type
     * @private
     */
    private _encodeType(type: string): string {
        let result: string = '';
        let dependencies = this._getDependenciesOf(type)
            .filter((dep: string): boolean => dep !== type)
            .sort();
        dependencies = [type].concat(dependencies);

        for (const t of dependencies) {

            result += `${t}(${
                this.structs[t]
                    .map((struct: EIP712StructField): string => `${struct.type} ${struct.name}`).join(',')
                })`;

        }

        return result;
    }

    /**
     * Applies a kecca256 hash to the result of _encdeType
     *
     * @param type Name of the type
     * @private
     */
    private _hashType(type: string): string {
        return utils.keccak256(Buffer.from(this._encodeType(type)));
    }

    /**
     * Helper that verifies the types field on the provided payload
     *
     * @param payload Payload to verify
     * @private
     */
    private _verifyTypes(payload: EIP712Payload): void {
        if (Object.keys(payload.types).length !== Object.keys(this.structs).length) {
            throw new Error(`Invalid Types in given payload: got ${Object.keys(payload.types)}, expect ${Object.keys(this.structs)}`);
        }

        for (const type of Object.keys(payload.types)) {
            if (!this.structs[type]) throw new Error(`Unknown type ${type}`);

            const current_type = payload.types[type];
            const registered_current_type = this.structs[type];

            for (const field of current_type) {
                const eq_idx = registered_current_type.findIndex((eq_field: EIP712StructField): boolean => eq_field.name === field.name);

                if (eq_idx === -1) throw new Error(`Error in ${type} type: unknwon field with name ${field.name}`);

                if (field.type !== registered_current_type[eq_idx].type) throw new Error(`Error in ${type} type: mismatch in field types: got ${field.type}, expected ${registered_current_type[eq_idx].type}`);

            }
        }
    }

    /**
     * Helper that verifies the domain field on the provided payload
     *
     * @param payload Payload to verify
     * @private
     */
    private _verifyDomain(payload: EIP712Payload): void {
        for (const field of this.structs['EIP712Domain']) {
            if (payload.domain[field.name] === undefined) throw new Error(`Missing field in domain: ${field.name}`);
        }
    }

    /**
     * Helper that verifies the primaryType field on the provided payload
     *
     * @param payload Payload to verify
     * @private
     */
    private _verifyPrimaryType(payload: EIP712Payload): void {
        if (this.primaryType !== payload.primaryType && payload.primaryType !== 'EIP712Domain') {
            throw new Error(`Mismatch in primary types: expected ${this.primaryType}, got ${payload.primaryType}`);
        }
    }

    /**
     * Helper that verifies that all required fields are present
     *
     * @param payload Payload to verify
     * @private
     */
    private _verifyMainPayloadField(payload: EIP712Payload): void {

        if (Object.keys(payload).length !== this.REQUIRED_FIELDS.length) {
            throw new Error(`Invalid payload: has fields ${Object.keys(payload)}, should have ${this.REQUIRED_FIELDS}`);
        }

        for (const req of this.REQUIRED_FIELDS) {
            if (!Object.keys(payload).includes(req)) {
                throw new Error(`Missing ${req} field in payload`);
            }
        }

    }

    /**
     * Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.
     *
     * @param num Signed integer value
     */
    private _fromSigned(num: string): BN {
        return new BN(Buffer.from(num.slice(2), 'hex')).fromTwos(256);
    }

    /**
     * Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.
     *
     * @param num
     */
    private _toUnsigned(num: BN): Buffer {
        return Buffer.from(num.toTwos(256).toArray());
    }

    /**
     * Pads provided string value to match provided length value.
     *
     * @param toPad Starting string to pad
     * @param length Target length
     * @private
     */
    private static _padWithZeroes(toPad: string, length: number): string {
        let myString = '' + toPad;
        while (myString.length < length) {
            myString = '0' + myString;
        }
        return myString;
    }

//    ______      _     _ _        _____      _             __
//    | ___ \    | |   | (_)      |_   _|    | |           / _|
//    | |_/ /   _| |__ | |_  ___    | | _ __ | |_ ___ _ __| |_ __ _  ___ ___
//    |  __/ | | | '_ \| | |/ __|   | || '_ \| __/ _ \ '__|  _/ _` |/ __/ _ \
//    | |  | |_| | |_) | | | (__   _| || | | | ||  __/ |  | || (_| | (_|  __/
//    \_|   \__,_|_.__/|_|_|\___|  \___/_| |_|\__\___|_|  |_| \__,_|\___\___|

    /**
     * Sets all information related to the signatures that will be generated.
     *
     * @param domain Domain structure
     * @param primary_type Primary Type to use
     * @param types Arrays containing name and fields
     */
    public constructor(domain: EIP712Domain, primary_type: string, ...types: [string, EIP712Struct][]) {
        this._setDomain(domain);
        this._setPrimaryType(primary_type);
        for (const type of types) {
            this._addType(type[0], type[1]);
        }
    }

    /**
     * Throws if provided payload does not match current settings
     *
     * @param payload Payload to verify
     */
    public verifyPayload(payload: EIP712Payload): void {
        this._verifyMainPayloadField(payload);
        this._verifyTypes(payload);
        this._verifyDomain(payload);
        this._verifyPrimaryType(payload);
        void this.encode(payload);
    }

    /**
     * Encode the given payload
     *
     * @param payload Payload to encode
     * @param verify True if verifications should be made
     */
    public encode(payload: EIP712Payload, verify: boolean = false): string {

        this._verifyMainPayloadField(payload);

        if (verify) {
            this._verifyTypes(payload);
            this._verifyDomain(payload);
            this._verifyPrimaryType(payload);
        }

        // Magic Number
        const result = [Buffer.from('1901', 'hex')];

        result.push(Buffer.from(this._hashData('EIP712Domain', payload.domain).slice(2), 'hex'));

        if (payload.primaryType !== 'EIP712Domain') {
            result.push(Buffer.from(this._hashData(payload.primaryType, payload.message).slice(2), 'hex'));
        }

        return utils.keccak256(Buffer.concat(result));

    }

    /**
     * Sign the given payload
     *
     * @param privateKey Private key to use
     * @param payload Payload to sign
     * @param verify True if verifications should be made
     */
    public async sign(privateKey: string, payload: EIP712Payload, verify: boolean = false): Promise<string> {
        const sk = new utils.SigningKey(privateKey);

        const encoded_payload = this.encode(payload, verify);

        const signature = sk.signDigest(Buffer.from(encoded_payload.slice(2), 'hex'));

        const rSig = this._fromSigned(signature.r);
        const sSig = this._fromSigned(signature.s);
        const vSig = signature.v;
        const rStr = EIP712Signer._padWithZeroes(this._toUnsigned(rSig).toString('hex'), 64);
        const sStr = EIP712Signer._padWithZeroes(this._toUnsigned(sSig).toString('hex'), 64);
        const vStr = vSig.toString(16);

        return `0x${rStr}${sStr}${vStr}`;
    }

    /**
     * Verifies the given signature
     *
     * @param payload Payload used to generate the signature
     * @param signature Signature to verify
     * @param verify True if payload verifications should be made
     */
    public async verify(payload: EIP712Payload, signature: string, verify: boolean = false): Promise<string> {
        const encoded_payload = this.encode(payload, verify);

        return utils.recoverAddress(Buffer.from(encoded_payload.slice(2), 'hex'), signature);
    }

    /**
     * Helper that generates a complete payload, ready for signature (should work with web3, metamask etc)
     *
     * @param data Message field in the generated payload
     */
    public generatePayload(data: any): EIP712Payload {

        return {
            domain: this.domain,
            primaryType: this.primaryType,
            types: this.structs,
            message: data
        };

    }

}
