import { VtxContract } from 'ethvtx/lib/contracts/VtxContract';

export const getSaleEnd = (minter_name: string, minter: VtxContract): string =>  {
    switch (minter_name) {
        case 'MinterPayableFixed':
        case 'MinterPayableFixedCategories':

            return minter.fn.getSaleEnd();

        default:
            return null;
    }
};
