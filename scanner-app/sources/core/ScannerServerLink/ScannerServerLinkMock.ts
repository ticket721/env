import { ScannerServerLink, VerifiedTickets }   from './ScannerServerLink';
import { RxDBEvent }                            from '../RxDBStoreType';
import { UserInfos }                            from '../../redux/state';

export const mock_event: RxDBEvent = {
    address: 'mock_address',
    id: 1,
    name: 'Event Mock',
    image: null,
    banners: null,
    start: (new Date(Date.now())).toLocaleString(),
    end: (new Date(Date.now())).toLocaleString(),
    description: 'Desc',
    location: 'Mock Location',
    verified_tickets: []
};

export class ScannerServerLinkMock implements ScannerServerLink {
    public check_owner = async (strapi_url: string, event_id: number, companion_address: string, ticket_id: number): Promise<UserInfos | string> => {
        if (companion_address === 'mock_companion_address') {
            return {
                username: 'mock_owner',
                user_id: 1
            };
        }

        return null;
    }

    public get_event_by_address = async (strapi_url: string, address: string): Promise<RxDBEvent> => {
        if (address === mock_event.address) {
            return mock_event;
        }

        return null;
    }

    public get_state = async (strapi_url: string, id_to_tickets: VerifiedTickets[]): Promise<RxDBEvent[]> =>
        [
            mock_event
        ]
}
