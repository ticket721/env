import { VtxContract }   from 'ethvtx/lib/contracts/VtxContract';
import { SaleResult }    from '../SaleMarketerController';

export const MarketerDirectSaleController = (args: any, ticket_id: number, coinbase: string, contract: VtxContract, price: any): SaleResult => {

    switch (price.currency) {
        case 'ether':
            return {
                tx_id: contract.fn.buy(ticket_id, {
                    from: coinbase,
                    value: price.value
                })
            };
        default:
            return {
                error: new Error('buy_controller_invalid_currency')
            };
    }

};
