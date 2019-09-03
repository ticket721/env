import { CompanionWallet } from './CompanionWallet';
import { Wallet }          from 'ethers';
import { AuthProof }       from '../AuthProof';
import { TicketProof }     from '../TicketProof';

export class CompanionWalletEthers implements CompanionWallet{
    public generate = async (): Promise<string> => {
        const ethw = Wallet.createRandom();

        return ethw.privateKey;
    }

    public address = async (pk: string): Promise<string> => {
        const ethw = new Wallet(pk);

        return ethw.address;
    }

    public generate_auth_proof = async (pk: string, device_identifier: string): Promise<[number, string]> => {

        const ap = new AuthProof();

        return ap.generateProof(pk, device_identifier);

    }

    public generate_ticket_proof = async (pk: string, ticket_id: number): Promise<[number, string]> => {

        const tp = new TicketProof();

        return tp.generateProof(pk, ticket_id);

    }
}
