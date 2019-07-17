import { VtxContract }   from 'ethvtx/lib/contracts/VtxContract';
import { SaleResult }    from '../SaleMarketerController';

export const MarketerDirectSaleController = (args: any, ticket_id: number, coinbase: string, contract: VtxContract): SaleResult =>

    ({
        tx_id: contract.fn.close(ticket_id, {
            from: coinbase,
            gas: 0xfffff
        })
    });
