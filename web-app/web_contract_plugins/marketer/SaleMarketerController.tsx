import { StrapiMarketer }               from '@utils/strapi/marketer';
import { VtxContract }                  from 'ethvtx/lib/contracts/VtxContract';
import { MarketerDirectSaleController } from './sale_controllers/MarketerDirectSale';
import { StrapiTicket }                 from '../../utils/strapi/ticket';

export interface SaleResult {
    tx_id?: number;
    error?: Error;
}

export const sale = (marketer: StrapiMarketer, ticket: StrapiTicket, coinbase: string, args: any, contract: VtxContract): SaleResult => {
    switch (marketer.name) {
        case 'MarketerDirectSale':
            return MarketerDirectSaleController(args, ticket.ticket_id, coinbase, contract);
        default:
            return {
                error: new Error('sale_controller_invalid_marketer')
            };
    }
};
