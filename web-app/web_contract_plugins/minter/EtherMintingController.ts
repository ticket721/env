import { VtxContract } from 'ethvtx/lib/contracts/VtxContract';
import { from_ascii }  from '@utils/misc/ascii';

const MinterPayableFixed = (contract: VtxContract, from: string, value: string, category: string): number =>
    contract.fn.mint({
        from,
        value
    });

const MinterPayableFixedCategories = (contract: VtxContract, from: string, value: string, category: string): number =>
    contract.fn.mint(from_ascii(category), {
        from,
        value
    });

export default {
    MinterPayableFixed,
    MinterPayableFixedCategories
};
