import { StrapiAddress } from '@utils/strapi/address';
import * as React        from 'react';
import StrapiCall        from '@components/strapi';
import { StrapiHelper }  from '../../../utils/StrapiHelper';
import * as _            from 'lodash-core';
import { AppState }      from '../../../utils/redux/app_state';
import { connect }       from 'react-redux';

export interface StrapiCoinbaseContext {
    coinbase: StrapiAddress;
}

const context: React.Context<StrapiCoinbaseContext> = React.createContext<StrapiCoinbaseContext>({
    coinbase: undefined
});

export const StrapiCoinbaseConsumer = context.Consumer;

interface StrapiCoinbaseProviderWrapperProps {
}

interface StrapiCoinbaseProviderWrapperRState {
    coinbase: string;
}

type MergedStrapiCoinbaseProviderWrapperProps = StrapiCoinbaseProviderWrapperProps & StrapiCoinbaseProviderWrapperRState;

class StrapiCoinbaseProviderWapper extends React.Component<MergedStrapiCoinbaseProviderWrapperProps> {
    render(): React.ReactNode {
        const Provider = context.Provider;
        if (this.props.coinbase === undefined) {
            return this.props.children;
        } else {
            return (
                <StrapiCall
                    calls={{
                        strapi_coinbase: StrapiHelper.getEntries('addresses', {address: this.props.coinbase.toLowerCase()})
                    }}
                >
                    {({strapi_coinbase}: any): React.ReactNode =>
                        <Provider
                            value={strapi_coinbase !== undefined ? (_.isEqual(strapi_coinbase, []) ? {coinbase: null} : {coinbase: strapi_coinbase[0].data}) : {coinbase: undefined}}
                        >
                            {this.props.children}
                        </Provider>}
                </StrapiCall>
            );
        }
    }
}

const mapStateToProps = (state: AppState): StrapiCoinbaseProviderWrapperProps => ({
    coinbase: state.vtxconfig.coinbase
});

export const StrapiCoinbaseProvider = connect(mapStateToProps)(StrapiCoinbaseProviderWapper);
