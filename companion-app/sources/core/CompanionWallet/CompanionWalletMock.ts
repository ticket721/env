import { CompanionWallet } from './CompanionWallet';

export class CompanionWalletMock extends CompanionWallet {
    public generate = async (): Promise<string> => {
        let result           = '';
        const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( let i = 0; i < 66; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public address = async (pk: string): Promise<string> =>
        pk.toLowerCase().slice(0, 42)

    public generate_auth_proof = async (pk: string, device_identifier: string): Promise<[number, string]> => [0, 'ab'];
    public generate_ticket_proof = async (pk: string, ticket_it: number): Promise<[number, string]> => [0, 'ab'];

}
