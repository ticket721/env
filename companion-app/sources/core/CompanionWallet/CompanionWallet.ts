export abstract class CompanionWallet {

    /**
     * Generates en EC Keypair and returns the private key
     */
    abstract generate: () => Promise<string>;

    /**
     * From the private key, derives the address
     */
    abstract address: (pk: string) => Promise<string>;

    /**
     * Generatae EIP712 signature used as auth proof by the server
     */
    abstract generate_auth_proof: (pk: string, device_identifier: string) => Promise<[number, string]>;

    /**
     * Generate Ticket proof used to build the QR Codes
     */
    abstract generate_ticket_proof: (pk: string, ticket_id: number) => Promise<[number, string]>;
}
