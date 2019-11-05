import Strapi                                   from 'strapi-sdk-javascript';
import { log }                                  from '../log';
import { ScannerServerLink, VerifiedTickets }   from './ScannerServerLink';
import { RxDBEvent }                            from '../RxDBStoreType';
import { strapiToEvent, UserInfos }             from '../../redux/state';

export class ScannerServerLinkStrapi implements ScannerServerLink {
    
    public check_owner = async (strapi_url: string, event_id: number, companion_address: string, ticket_id: number): Promise<UserInfos | string> => {
        const strapi = new Strapi(strapi_url);
        try {
            const res = await strapi.request('post', '/tickets/checkowner', {
                data: {
                    event_id,
                    companion_address,
                    ticket_id
                }
            });

            return res;
        } catch (e) {
            if (e.toString() === 'Error: Unrelated Event') {
                return 'unrelated_event';
            }
            
            log.error(e);
            return null;
        }
    }

    public get_event_by_address = async (strapi_url: string, address: string): Promise<RxDBEvent> => {
        const strapi = new Strapi(strapi_url);
        
        try {
            const res = await strapi.request('post', '/events/byaddress', {
                data: {
                    address
                }
            });

            const eventInfos = strapiToEvent(res, address);

            return eventInfos;
        } catch (e) {
            log.error(e);
            return null;
        }
    }

    public get_state = async (strapi_url: string, id_to_tickets: VerifiedTickets[]): Promise<RxDBEvent[]> => {
        const strapi = new Strapi(strapi_url);
        
        try {
            const event_ids: number[] = [];

            id_to_tickets.map((ticket: VerifiedTickets, i: number) => {
                event_ids[i] = ticket.event_id;
            });
            
            const res = await strapi.request('post', '/events/scannerrefresh', {
                data: {
                    event_ids
                }
            });

            const events = [];
            let tickets_idx = null;

            for (const [i, event] of res.entries()) {
                tickets_idx = event_ids.findIndex((event_id: number): boolean => event.id === event_id);
                events[i] = strapiToEvent(event, event.address.address, id_to_tickets[tickets_idx].tickets);
            }

            return events;
        } catch (e) {
            log.error(e);
            return null;
        }
    }
}
