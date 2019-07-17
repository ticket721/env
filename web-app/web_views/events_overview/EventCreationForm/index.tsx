import * as React from 'react';

import StrapiCall                 from '@components/strapi';
import { StrapiHelper }           from '@utils/StrapiHelper';
import dynamic                    from 'next/dynamic';
import { EventCreationTabsProps } from './EventCreationTabs';
import { StrapiMinter }           from '@utils/strapi/minter';
import { StrapiMarketer }         from '@utils/strapi/marketer';
import { StrapiApprover }         from '@utils/strapi/approver';
import { StrapiEventContract }    from '@utils/strapi/eventcontract';
import { RGA }                    from '../../../utils/misc/ga';

// Dynamic Components

const EventCreationTabs: React.ComponentType<EventCreationTabsProps> = dynamic<EventCreationTabsProps>(async () => import('./EventCreationTabs'), {
    loading: (): React.ReactElement => null,
    ssr: false
});

// Props

export interface EventCreationFormProps {
}

const filter_minters = (minters: any[]): StrapiMinter[] => {

    // Removing Errored Minters
    let real_minters;
    if (minters) {
        real_minters = [];
        for (const minter of minters) {
            if (minter.data) {
                real_minters.push(minter.data);
            }
        }
    } else {
        real_minters = minters;
    }

    return real_minters;
};

const filter_marketers = (marketers: any[]): StrapiMarketer[] => {

    // Removing Errored marketers
    let real_marketers;
    if (marketers) {
        real_marketers = [];
        for (const minter of marketers) {
            if (minter.data) {
                real_marketers.push(minter.data);
            }
        }
    } else {
        real_marketers = marketers;
    }

    return real_marketers;
};

const filter_approvers = (approvers: any[]): StrapiApprover[] => {

    // Removing Errored approvers
    let real_approvers;
    if (approvers) {
        real_approvers = [];
        for (const minter of approvers) {
            if (minter.data) {
                real_approvers.push(minter.data);
            }
        }
    } else {
        real_approvers = approvers;
    }

    return real_approvers;
};

const filter_event_contracts = (event_contracts: any[]): StrapiEventContract[] => {

    // Removing Errored event_contracts
    let real_event_contracts;
    if (event_contracts) {
        real_event_contracts = [];
        for (const minter of event_contracts) {
            if (minter.data) {
                real_event_contracts.push(minter.data);
            }
        }
    } else {
        real_event_contracts = event_contracts;
    }

    return real_event_contracts;
};

export default class EventCreationForm extends React.Component<EventCreationFormProps> {

    render(): React.ReactNode {
        return <StrapiCall
            calls={{
                minters: StrapiHelper.getEntries('minters', {}),
                approvers: StrapiHelper.getEntries('approvers', {}),
                marketers: StrapiHelper.getEntries('marketers', {}),
                event_contracts: StrapiHelper.getEntries('eventcontracts', {})
            }}
        >
            {({minters, approvers, marketers, event_contracts}: {minters: any[]; approvers: any[]; marketers: any[], event_contracts: any[]}): React.ReactNode => {
               
                minters = filter_minters(minters);
                approvers = filter_approvers(approvers);
                marketers = filter_marketers(marketers);
                event_contracts = filter_event_contracts(event_contracts);

                return <EventCreationTabs
                    minters={minters}
                    marketers={marketers}
                    approvers={approvers}
                    event_contracts={event_contracts}
                />;
            }}
        </StrapiCall>;
    }
}
