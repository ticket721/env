import { EventCreationData }   from '../EventCreationData';
import { StrapiMinter }        from '@utils/strapi/minter';
import { StrapiMarketer }      from '@utils/strapi/marketer';
import { StrapiApprover }      from '@utils/strapi/approver';
import { StrapiEventContract } from '@utils/strapi/eventcontract';

export interface EventDeployProcess {
    explications_read: boolean;
    deployed: boolean;
}

export interface EventDeployProps {
    form_data: EventCreationData;
    minters: StrapiMinter[];
    marketers: StrapiMarketer[];
    approvers: StrapiApprover[];
    event_contracts: StrapiEventContract[];
    t: any;
    process: EventDeployProcess;
    set: (edp: Partial<EventDeployProcess>) => void;
}
