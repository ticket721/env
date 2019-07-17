import { StrapiMarketer }               from '@utils/strapi/marketer';
import { VtxContract }                  from 'ethvtx/lib/contracts/VtxContract';
import { MarketerDirectSaleController } from './buy_controllers/MarketerDirectSale';
import { StrapiTicket }                 from '../../utils/strapi/ticket';

export interface BuyResult {
    tx_id?: number;
    error?: Error;
}

export const buy = (marketer: StrapiMarketer, ticket: StrapiTicket, coinbase: string, args: any, contract: VtxContract, price: any): BuyResult => {
    switch (marketer.name) {
        case 'MarketerDirectSale':
            return MarketerDirectSaleController(args, ticket.ticket_id, coinbase, contract, price);
        default:
            return {
                error: new Error('sale_controller_invalid_marketer')
            };
    }
};
