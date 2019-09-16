import { EIP712Payload, EIP712Signature, EIP712Signer, EIP712StructField } from './EIP712Signer';
import { BN } from 'bn.js';
export declare const MTKNTypes: {
    [key: string]: EIP712StructField[];
};
export interface MTKNActors {
    signer: string;
    relayer: string;
}
export interface MTKNTxParams {
    nonce: number | BN;
    gasLimit: number | BN;
    gasPrice: number | BN;
    reward: number | BN;
}
/**
 * @description Helper class to generate mTKN signatures
 */
export declare class MTKNSigner extends EIP712Signer {
    constructor(domain_name: string, domain_version: string, domain_chain_id: number, domain_contract: string);
    /**
     * @description Generates `transfer` signature or payload.
     *
     * @param recipient
     * @param amount
     * @param actors
     * @param txparams
     * @param private_key If provided, generates signature, otherwise generates payload
     */
    transfer(recipient: string, amount: number | BN, actors: MTKNActors, txparams: MTKNTxParams, private_key?: string): Promise<EIP712Signature | EIP712Payload>;
    /**
     * @description Verifies `transfer` signature
     *
     * @param recipient
     * @param amount
     * @param actors
     * @param txparams
     * @param signature
     */
    verifyTransfer(recipient: string, amount: number | BN, actors: MTKNActors, txparams: MTKNTxParams, signature: string): Promise<boolean>;
    /**
     * @description Generates `approve` signature or payload.
     *
     * @param spender
     * @param amount
     * @param actors
     * @param txparams
     * @param private_key If provided, generates signature, otherwise generates payload
     */
    approve(spender: string, amount: number | BN, actors: MTKNActors, txparams: MTKNTxParams, private_key?: string): Promise<EIP712Signature | EIP712Payload>;
    /**
     * @description Verifies `approve` signature
     *
     * @param spender
     * @param amount
     * @param actors
     * @param txparams
     * @param signature
     */
    verifyApprove(spender: string, amount: number | BN, actors: MTKNActors, txparams: MTKNTxParams, signature: string): Promise<boolean>;
    /**
     * @description Generates `transferFrom` signature or payload.
     *
     * @param sender
     * @param recipient
     * @param amount
     * @param actors
     * @param txparams
     * @param private_key If provided, generates signature, otherwise generates payload
     */
    transferFrom(sender: string, recipient: string, amount: number | BN, actors: MTKNActors, txparams: MTKNTxParams, private_key?: string): Promise<EIP712Signature | EIP712Payload>;
    /**
     * @description Verifies `transferFrom` signature
     *
     * @param sender
     * @param recipient
     * @param amount
     * @param actors
     * @param txparams
     * @param signature
     */
    verifyTransferFrom(sender: string, recipient: string, amount: number | BN, actors: MTKNActors, txparams: MTKNTxParams, signature: string): Promise<boolean>;
}
