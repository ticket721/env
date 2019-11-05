import { EIP712Signer } from '@ticket721/e712';

export abstract class TicketProof extends EIP712Signer {

    abstract verifyProof: (timestamp: number, ticket_id: number, signature: string) => Promise<string>;
}
