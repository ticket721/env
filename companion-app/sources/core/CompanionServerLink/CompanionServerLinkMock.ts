import { CompanionServerLink, ServerState } from './CompanionServerLink';
import { Ticket }                           from '../../redux/state';

export const mock_ticket: Ticket = {
    ticket_id: 1,
    id: 1,
    mint_block: 123,
    creation: Date.now(),
    mint_price: '123',
    mint_currency: '0xabcd',
    owner: '0xabcd',
    event: {
        address: {
            address: '0xabcd'
        },
        name: 'Test Mock Event',
        banners: [],
        image: null,
        creation: (new Date(Date.now())).toLocaleString(),
        description: 'Salut',
        end: (new Date(Date.now())).toLocaleString(),
        start: (new Date(Date.now())).toLocaleString(),
        eventcontract: 1,
        id: 1,
        location: 'home',
        owner: 1
    }
};

export class CompanionServerLinkMock implements CompanionServerLink {

    public issue_code = async (strapi_url: string, device_identifier: string, timestamp: number, signature: string): Promise<string> =>
        'ABCDEF'

    public get_state = async (strapi_url: string, device_identifier: string, timestamp: number, signature: string): Promise<ServerState> => ({
        linked_to: null,
        linked: false,
        tickets: [mock_ticket]
    })

}
