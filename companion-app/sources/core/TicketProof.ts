import { EIP712Signer, EIP712Domain, EIP712Struct, EIP712Payload } from '@ticket721/e712';
import { currentTimeRange }                                        from '../rn/utils/currentTimeRange';

const Ticket: EIP712Struct = [
    {
        name: 'timestamp',
        type: 'uint256'
    },
    {
        name: 'ticket_id',
        type: 'uint256'
    }
];

const Domain: EIP712Domain = {
    name: 'Companion - Ticket Proof',
    chainId: 1,
    verifyingContract: '0x0000000000000000000000000000000000000000',
    version: '1'
};

export class TicketProof extends EIP712Signer {
    constructor() {
        super(
            Domain,
            'Ticket',
            ['Ticket', Ticket]
        );
    }

    public async generateProof(privateKey: string, ticket_id: number): Promise<[number, string]> {
        const now = currentTimeRange();

        const data = {
            timestamp: now,
            ticket_id
        };

        const formatted_payload: EIP712Payload = this.generatePayload(data);

        return [now, await this.sign(privateKey, formatted_payload, true)];
    }
}
