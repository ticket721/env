import { EIP712Signer, EIP712Domain, EIP712Struct, EIP712Payload } from '@ticket721/e712';

const Auth: EIP712Struct = [
    {
        name: 'device_identifier',
        type: 'string'
    },
    {
        name: 'timestamp',
        type: 'uint256'
    }
];

const Domain: EIP712Domain = {
    name: 'Companion - Auth Proof',
    chainId: 1,
    verifyingContract: '0x0000000000000000000000000000000000000000',
    version: '1'
};

export class AuthProof extends EIP712Signer {
    constructor() {
        super(
            Domain,
            'Auth',
            ['Auth', Auth]
        );
    }

    public async generateProof(privateKey: string, device_identifier: string): Promise<[number, string]> {
        const now = Date.now();

        const data = {
            timestamp: now,
            device_identifier
        };

        const formatted_payload: EIP712Payload = this.generatePayload(data);

        return [now, await this.sign(privateKey, formatted_payload, true)];
    }
}
