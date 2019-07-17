import { StrapiMinter }        from '@utils/strapi/minter';
import { StrapiApprover }      from '@utils/strapi/approver';
import { StrapiMarketer }      from '@utils/strapi/marketer';
import { StrapiEventContract } from '@utils/strapi/eventcontract';

export interface EventCreationTabBaseProps {
    form_data: EventCreationData;
    set_data: EventCreationSetData;
    minters: StrapiMinter[];
    approvers: StrapiApprover[];
    marketers: StrapiMarketer[];
    event_contracts: StrapiEventContract[];
}

export interface EventCreationData {
    minter: number;
    minter_args: any;
    approver: number;
    approver_args: any;
    marketer: number;
    marketer_args: any;
    name: string;
    description: string;
    banners: any;
    image: any;
    location: any;
    dates: any;
}

export type EventCreationSetData = (field: string, value: any) => void;
