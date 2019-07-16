import { VtxContract } from 'ethvtx/lib/contracts/VtxContract';
import { to_ascii }    from '@utils/misc/ascii';

export interface TicketPrices {
    [key: string]: string;
}

export interface TicketCategory {
    name: string;
    supply: number;
    bought: number;
    end: Date;
    price: TicketPrices;
}

const MinterPayableFixedCategories = (event: VtxContract): TicketCategory[] => {
    const categories = event.fn.getCategories();
    const end = event.fn.getSaleEnd();

    if (categories && end) {
        const ret: TicketCategory[] = [];
        for (const category of categories) {
            const price = event.fn.getMintPrice(category);
            const supply = event.fn.getTotalCount(category);
            const bought = event.fn.getSoldCount(category);

            if (price !== undefined && supply !== undefined && bought !== undefined) {
                ret.push({
                    name: to_ascii(category),
                    supply: supply,
                    bought: bought,
                    end: new Date(parseInt(end) * 1000),
                    price: {
                        'ether': price
                    }
                });
            }
        }
        return ret;
    } else {
        return [];
    }
};

const MinterPayableFixed = (event: VtxContract): TicketCategory[] => {
    const price = event.fn.getMintPrice();
    const supply = event.fn.getTotalCount();
    const bought = event.fn.getSoldCount();
    const end = event.fn.getSaleEnd();

    if (price !== undefined && supply !== undefined && bought !== undefined && end !== undefined) {
        return [
            {
                name: 'regular',
                supply,
                bought,
                end: new Date(parseInt(end) * 1000),
                price: {
                    'ether': price
                }
            }
        ];
    }

    return [];
};

export const MinterCategoriesGetter = (minter_type: string, event: VtxContract): TicketCategory[] => {
    switch (minter_type) {
        case 'MinterPayableFixed':
            return MinterPayableFixed(event);
        case 'MinterPayableFixedCategories':
            return MinterPayableFixedCategories(event);
        default:
            return [];
    }
};
