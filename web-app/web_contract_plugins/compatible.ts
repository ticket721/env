import { StrapiMinter }        from '@utils/strapi/minter';
import { StrapiApprover }      from '@utils/strapi/approver';
import { StrapiMarketer }      from '@utils/strapi/marketer';
import { StrapiEventContract } from '@utils/strapi/eventcontract';

export const compatible = (
    minters: StrapiMinter[], minter_idx: number,
    approvers: StrapiApprover[], approver_idx: number,
    marketers: StrapiMarketer[], marketer_idx: number,
    event_contracts: StrapiEventContract[]): boolean => {

    if (minters === undefined || approvers === undefined || marketers === undefined || event_contracts === undefined) return false;

    let minter_id = undefined;

    if (minter_idx !== null) {
        minter_id = minters[minter_idx].id;
    }

    let marketer_id = undefined;

    if (marketer_idx !== null) {
        marketer_id = marketers[marketer_idx].id;
    }

    let approver_id = undefined;

    if (approver_idx !== null) {
        approver_id = approvers[approver_idx].id;
    }

    return event_contracts
        .filter((contract: StrapiEventContract): boolean => {
            if (minter_id) {
                return contract.minter.id === minter_id;
            }
            return true;
        })
        .filter((contract: StrapiEventContract): boolean => {
            if (marketer_id) {
                return contract.marketer.id === marketer_id;
            }
            return true;
        })
        .filter((contract: StrapiEventContract): boolean => {
            if (approver_id) {
                return contract.approver.id === approver_id;
            }
            return true;
        }).length > 0;
};
