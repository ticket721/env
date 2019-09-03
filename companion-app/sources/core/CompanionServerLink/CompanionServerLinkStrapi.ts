import Strapi          from 'strapi-sdk-javascript';
import { log }         from '../log';
import { ServerState } from './CompanionServerLink';
import { Ticket }      from '../../redux/state';

export class CompanionServerLinkStrapi {

    public issue_code = async (strapi_url: string, device_identifier: string, timestamp: number, signature: string): Promise<string> => {
        const strapi = new Strapi(strapi_url);

        try {
            const res = await strapi.request('post', '/addresscodes/issue', {
                data: {
                    body: {
                        timestamp,
                        device_identifier
                    },
                    signature: signature
                }
            });
            return res.code;
        } catch (e) {
            log.error(e);
            return null;
        }

    }

    private readonly _sort_tickets = (tickets: Ticket[]): Ticket[] => {
        const start_less = tickets.filter((ticket: Ticket): boolean => ticket.event.start === null);
        const start = tickets.filter((ticket: Ticket): boolean => ticket.event.start !== null);

        const start_less_sorted = start_less.sort((a: Ticket, b: Ticket): number =>
            b.ticket_id - a.ticket_id);

        const sorted = start.sort((a: Ticket, b: Ticket): number => {
            const a_date = new Date(a.event.start);
            const b_date = new Date(b.event.start);

            const a_dist = a_date.valueOf() - Date.now();
            const b_dist = b_date.valueOf() - Date.now();

            if (a_dist === b_dist) return b.ticket_id - a.ticket_id;

            if (a_dist < 0) return 1;
            if (b_dist < 0) return -1;

            return a_dist - b_dist;
        });

        return sorted.concat(start_less_sorted);
    }

    public get_state = async (strapi_url: string, device_identifier: string, timestamp: number, signature: string): Promise<ServerState> => {
        const strapi = new Strapi(strapi_url);

        try {
            const res = await strapi.request('post', '/tickets/companionlist', {
                data: {
                    body: {
                        timestamp,
                        device_identifier
                    },
                    signature: signature
                }
            });

            if (res) {
                return {
                    ...res,
                    tickets: this._sort_tickets(res.tickets)
                };
            }
            return res;
        } catch (e) {
            log.error(e);
            return null;
        }

    }

}
