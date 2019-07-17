import { StrapiEvent }            from '../../../utils/strapi/event';
import * as React                 from 'react';
import { Card, Icon, Typography } from 'antd';
import EventCardBannerCarousel    from './EventCardBannerCarousel';
import EventCardIcon              from './EventCardIcon';
import EventCardDates             from './EventCardDates';
import { StrapiEventContract }    from '../../../utils/strapi/eventcontract';
import { VtxContract }            from 'ethvtx/lib/contracts/VtxContract';
import { ContractsSpecStore }     from 'ethvtx/lib/state/contracts';
import { MinterCategoriesGetter, TicketCategory } from '../../../web_contract_plugins/minter/MinterCategoriesGetter';
import { AppState }           from '../../../utils/redux/app_state';
import { getContract }        from 'ethvtx/lib/contracts/helpers/getters';
import { Dispatch }           from 'redux';
import {
    loadContractInstance,
    loadContractSpec,
    removeContractInstance
}                             from 'ethvtx/lib/contracts/helpers/dispatchers';
import { connect }            from 'react-redux';
import EventCardStatsCarousel from './EventCardStatsCarousel';
import { I18N, I18NProps }    from '../../../utils/misc/i18n';
import { routes }             from '../../../utils/routing';
import { theme }              from '../../../utils/theme';

export interface EventCardProps {
    event: StrapiEvent;
    event_contract: StrapiEventContract;
}

interface EventCardRState {
    contract: VtxContract;
    specs: ContractsSpecStore;
    categories: TicketCategory[];
}

interface EventCardRDispatch {
    addSpec: (name: string, abi: any[], bin: string, constructor_bin: string) => void;
    addInstance: (name: string, address: string) => void;
    removeInstance: (name: string, address: string) => void;
}

type MergedEventCardProps = EventCardProps & EventCardRState & EventCardRDispatch & I18NProps;

class EventCard extends React.Component<MergedEventCardProps> {

    setup_and_load = (props: MergedEventCardProps): void => {

        if (props.event && props.specs && props.addSpec && props.event_contract && !props.contract) {

            if (props.specs[props.event_contract.name] === undefined) {
                props.addSpec(props.event_contract.name, props.event_contract.abi, props.event_contract.runtime_binary, props.event_contract.binary);
            }

            props.addInstance(props.event_contract.name, props.event.address.address);

        }

    }

    componentDidMount(): void {
        this.setup_and_load(this.props);
    }

    shouldComponentUpdate(nextProps: Readonly<EventCardProps & EventCardRState & EventCardRDispatch>, nextState: Readonly<{}>, nextContext: any): boolean {
        this.setup_and_load(nextProps);
        return true;
    }

    componentWillUnmount(): void {
        if (this.props.contract) {
            this.props.removeInstance(this.props.event_contract.name, this.props.event.address.address);
        }
    }

    render(): React.ReactNode {
        return <div id='event_card'>
            <style>{`
                #event_card .ant-card-body {
                    background: linear-gradient(to right, ${theme.primarydark0}, ${theme.dark1});
                    padding: 0;
                    border-top-right-radius: 6px;
                    border-top-left-radius: 6px;
                }
                
                #event_card .ant-card-actions {
                    border-top: 0px black;
                    background-color: ${theme.dark2};
                    border-bottom-right-radius: 6px;
                    border-bottom-left-radius: 6px;
                }
                
                #event_card .ant-card-bordered {
                    border: none;
                }
                
                #event_card .ant-card-actions > li:not(:last-child) {
                    border-right: 1px solid ${theme.dark4};
                }
                
                #event_card .anticon {
                    color: ${theme.white};
                }
                
                
                #event_card .ant-card {
                    border-radius: 6px;
                    background-color: ${theme.dark2};
                }
                
            `}</style>
            <Card
                style={{
                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
                }}
                actions={[
                    this.props.event
                        ?
                        <routes.Link key={'event'} route={'event'} params={{address: this.props.event.address.address}}>
                            <Typography.Text style={{fontSize: 16, color: theme.white}}>{this.props.t('event_card_event')}</Typography.Text>
                        </routes.Link>

                        :
                        <Typography.Text style={{fontSize: 16, color: theme.white}}>{this.props.t('event_card_event')}</Typography.Text>,

                    <routes.Link key={'marketplace'} route={'marketplace'} params={{event: this.props.event ? this.props.event.address.address : undefined}}>
                        <Typography.Text style={{fontSize: 16, color: theme.white}}>{this.props.t('event_card_marketplace')}</Typography.Text>
                    </routes.Link>,

                    <Typography.Text key={'tmp'} style={{fontSize: 16, color: theme.white}}>{this.props.t('event_card_website')}</Typography.Text>
                ]}
            >
                <EventCardBannerCarousel event={this.props.event}/>
                <EventCardIcon event={this.props.event}/>
                <EventCardDates event={this.props.event}/>
                <EventCardStatsCarousel categories={this.props.categories} creation={this.props.event ? this.props.event.creation : undefined}/>
            </Card>
        </div>;
    }
}

const mapStateToProps = (state: AppState, ownProps: EventCardProps): EventCardRState => {

    let categories = null;
    const contract = ownProps.event && ownProps.event_contract ? getContract(state, ownProps.event_contract.name, ownProps.event.address.address) : undefined;

    if (contract && ownProps.event_contract) {

        const minter_name = ownProps.event_contract.minter.name;

        categories = MinterCategoriesGetter(minter_name, contract);

    }

    return {
        specs: state.contracts.specs,
        contract,
        categories
    };
};

const mapDispatchToProps = (dispatch: Dispatch): EventCardRDispatch =>
    ({
        addSpec: (name: string, abi: any[], bin: string, constructor_bin: string): void => loadContractSpec(dispatch, name, abi, {
            bin,
            constructor_bin
        }),
        addInstance: (name: string, address: string): void => loadContractInstance(dispatch, name, address, {
            balance: true
        }),
        removeInstance: (name: string, address: string): void => removeContractInstance(dispatch, name, address)
    });

export default connect(mapStateToProps, mapDispatchToProps)(
    I18N.withNamespaces(['events'])(EventCard)
) as React.ComponentType<EventCardProps>;
