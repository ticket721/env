import * as React              from 'react';
import StrapiCall              from '@components/strapi';
import { StrapiAddress }       from '@utils/strapi/address';
import { StrapiHelper }        from '@utils/StrapiHelper';
import { StrapiMinter }        from '@utils/strapi/minter';
import { StrapiMarketer }      from '@utils/strapi/marketer';
import { StrapiApprover }      from '@utils/strapi/approver';
import { StrapiQueuedEvent }   from '@utils/strapi/queuedevent';
import QueuedEventView         from './QueuedEventView';

export interface QueuedEventViewWrapperProps {
    address: string;
    coinbase: StrapiAddress;
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

const filter_queued_events = (queued_events: any[]): StrapiQueuedEvent[] => {

    // Removing Errored queued_events
    let real_queued_events;
    if (queued_events) {
        real_queued_events = [];
        for (const minter of queued_events) {
            if (minter.data) {
                real_queued_events.push(minter.data);
            }
        }
    } else {
        real_queued_events = queued_events;
    }

    return real_queued_events;
};

export default class QueuedEventViewWrapper extends React.Component<QueuedEventViewWrapperProps> {
    render(): React.ReactNode {
        return <StrapiCall
            calls={{
                queuedevent: StrapiHelper.getEntries('queuedevents', {address: this.props.address}),
                minters: StrapiHelper.getEntries('minters', {}),
                approvers: StrapiHelper.getEntries('approvers', {}),
                marketers: StrapiHelper.getEntries('marketers', {})
            }}
        >
            {({queuedevent, minters, marketers, approvers}: {queuedevent: any[]; minters: any[]; marketers: any[]; approvers: any[]; }): React.ReactNode => {

                minters = filter_minters(minters);
                marketers = filter_marketers(marketers);
                approvers = filter_approvers(approvers);
                queuedevent = filter_queued_events(queuedevent);

                return <QueuedEventView
                    minters={minters}
                    marketers={marketers}
                    approvers={approvers}
                    queued_event={queuedevent && queuedevent.length === 1 ? queuedevent[0] : undefined}
                    address={this.props.address}
                    coinbase={this.props.coinbase}
                />;
            }}
        </StrapiCall>;
    }
}
