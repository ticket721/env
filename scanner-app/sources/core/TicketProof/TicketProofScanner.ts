import { EIP712Domain, EIP712Struct, EIP712Payload }    from '@ticket721/e712';
import { TicketProof }                                  from './TicketProof';

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

export class TicketProofScanner extends TicketProof {
    constructor() {
        super(
            Domain,
            'Ticket',
            ['Ticket', Ticket]
        );
    }

    public verifyProof = async (timestamp: number, ticket_id: number, signature: string): Promise<string> => {

        const data = {
            timestamp,
            ticket_id
        };

        const payload: EIP712Payload = this.generatePayload(data, 'Ticket');
        
        return this.verify(payload, signature);
    }
}
