import * as React        from 'react';
import { Layout }        from 'antd';
import { StrapiAddress } from '../../utils/strapi/address';
import EventFilter       from './sider_form/EventFilter';
import { StrapiEvent }   from '../../utils/strapi/event';
import { theme }         from '../../utils/theme';

const Sider = Layout.Sider;

export interface MarketplaceSiderProps {
    coinbase: StrapiAddress;
    events: Partial<StrapiEvent>[];
    add_event: (addr: string) => void;
    rm_event: (idx: number) => void;
}

export default class MarketplaceSider extends React.Component<MarketplaceSiderProps> {
    render(): React.ReactNode {
        return <Sider width={280} style={{ background: theme.dark1, height: '100%', overflow: 'auto', padding: 12}}>
            <EventFilter events={this.props.events} add_event={this.props.add_event} rm_event={this.props.rm_event}/>
        </Sider>;

    }
}
