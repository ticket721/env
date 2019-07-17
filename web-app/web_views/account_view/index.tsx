import * as React         from 'react';
import { AppState }       from '@utils/redux/app_state';
import { connect }        from 'react-redux';
import StrapiCall         from '@components/strapi';
import { StrapiHelper }   from '@utils/StrapiHelper';
import AccountTabs        from './AccountTabs';
import { FullPageLoader } from '@web_components/loaders/FullPageLoader';
import { FilterOptions }  from './FilterForm';
import { RGA }            from '../../utils/misc/ga';

// Props

export interface AccountViewProps {
    address: string;
}

interface AccountViewRState {
    coinbase: string;
}

interface AccountViewState {
    entry: number;
    sort: string;
    ticket_filter_options: FilterOptions;
}

export type IAccountViewProps = AccountViewProps & AccountViewRState;

const filter_strapi = (entities: any[]): any[] => {

    // Removing Errored entities
    let real_entities;
    if (entities) {
        real_entities = [];
        for (const entity of entities) {
            if (entity.data) {
                real_entities.push(entity.data);
            }
        }
    } else {
        real_entities = entities;
    }

    return real_entities;
};

class AccountView extends React.Component<IAccountViewProps, AccountViewState> {

    state: AccountViewState = {
        entry: 0,
        sort: 'ticket_id:DESC',
        ticket_filter_options: {
            event: null
        }
    };

    componentDidMount(): void {
        RGA.pageview(window.location.pathname + window.location.search);
    }

    render(): React.ReactNode {

        return <StrapiCall
            calls={{
                address: StrapiHelper.getEntries('addresses', {address: (this.props.address ? this.props.address : this.props.coinbase).toLowerCase()})
            }}
        >
            {({address}: any): React.ReactNode => {

                address = filter_strapi(address);

                if (address) {
                    return <AccountTabs
                        address={address[0]}
                        coinbase={this.props.coinbase}
                        queried_address={this.props.address}
                    />;
                } else {
                    return <FullPageLoader message={'account_loading'}/>;
                }
            }}
        </StrapiCall>;
    }
}

const mapStateToProps = (state: AppState): AccountViewRState =>
    ({
        coinbase: state.vtxconfig.coinbase
    });

export default connect(mapStateToProps)(AccountView);
