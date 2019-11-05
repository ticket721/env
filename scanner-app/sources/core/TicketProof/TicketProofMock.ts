export const mock_qr = {
    timestamp: 123,
    ticket_id: 1,
    signature: 'mock_signature'
};

export class TicketProofMock {

    public verifyProof = async (timestamp: number, ticket_id: number, signature: string): Promise<string> => {
        if (signature === mock_qr.signature) {
            return 'mock_companion_address';
        }

        return 'invalid';
    }
}
