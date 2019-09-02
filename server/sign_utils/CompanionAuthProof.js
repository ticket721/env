const { EIP712Signer } = require('@ticket721/e712');

const Auth = [
    {
        name: 'device_identifier',
        type: 'string'
    },
    {
        name: 'timestamp',
        type: 'uint256'
    }
];

const Domain = {
    name: 'Companion - Auth Proof',
    chainId: 1,
    verifyingContract: '0x0000000000000000000000000000000000000000',
    version: '1'
};

class CompanionAuthProof extends EIP712Signer {
    constructor() {
        super(
            Domain,
            'Auth',
            ['Auth', Auth]
        );
    }

    async verifyProof(timestamp, device_identifier, signature) {

        const payload = this.generatePayload({
            timestamp,
            device_identifier
        });

        return this.verify(payload, signature);
    }

}

module.exports = CompanionAuthProof;
