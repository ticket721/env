import { VtxContract }   from 'ethvtx/lib/contracts/VtxContract';
import { SaleResult }    from '../SaleMarketerController';

export const MarketerDirectSaleController = (args: any, ticket_id: number, coinbase: string, contract: VtxContract): SaleResult => {

    const price = args.marketer_price;
    const end = args.marketer_end;

    if (!price || !end) {
        return {
            error: new Error('sale_controller_invalid_arguments')
        };
    }

    return {
        tx_id: contract.fn.sell(ticket_id, price, end, {
            from: coinbase,
            gas: 0xfffff
        })
    };

};
