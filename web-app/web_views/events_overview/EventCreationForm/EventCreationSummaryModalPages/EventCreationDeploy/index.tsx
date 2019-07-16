import * as React                                         from 'react';
import { AppState }                                       from '@utils/redux/app_state';
import { Dispatch }                                       from 'redux';
import { ContractsSpecStore, Tx, TxInfos }                from 'ethvtx/lib/state';
import { deployContract }                                 from 'ethvtx/lib/dispatchers';
import { connect }                                        from 'react-redux';
import { Button, Progress, Typography }                  from 'antd';
import { DeployLoader }                                  from '@web_components/loaders/DeployLoader';
import { StrapiEventContract }                           from '@utils/strapi/eventcontract';
import { EventDeployProps }                              from '../EventDeployProps';
import { getTransactionById }                            from 'ethvtx/lib/txs/helpers/getters';
import Strapi                                            from 'strapi-sdk-javascript';
import { StrapiCoinbaseContext, StrapiCoinbaseConsumer } from '@components/context/StrapiCoinbase';
import { routes }                                        from '@utils/routing';
import { StrapiHelper }                                  from '../../../../../utils/StrapiHelper';
import { theme }                                         from '../../../../../utils/theme';
import { RGA }                                           from '../../../../../utils/misc/ga';

// Props

interface EventCreationDeployOwnProps {
}

export type EventCreationDeployProps = EventCreationDeployOwnProps & EventDeployProps;

interface EventCreationDeployRState {
    coinbase: string;
    get_tx: (tx_id: number) => Tx;
    t721_address: any;
    specs: ContractsSpecStore;
    confirmation_threshold: number;
    current_block: number;
    strapi: Strapi;
}

interface EventCreationDeployRDispatch {
    deploy: (spec_name: string, tx_infos: Partial<TxInfos>, args: any[]) => number;
    resetCoinbase: (coinbase: string) => void;
}

type MergedEventCreationDeployProps = EventCreationDeployProps & EventCreationDeployRState & EventCreationDeployRDispatch;

interface EventCreationDeployState {
    deploy_tx_id: number;
    uploading: boolean;
    upload_result: any;
    tx_confirming: boolean;
    tx_confirmed: boolean;
    tx_error: boolean;
    upload_error: boolean;
}

class EventCreationDeploy extends React.Component<MergedEventCreationDeployProps, EventCreationDeployState> {

    componentDidMount(): void {
        RGA.modalview('/create/deploy');
    }

    state: EventCreationDeployState = {
        deploy_tx_id: null,
        uploading: false,
        upload_result: null,
        tx_confirming: false,
        tx_confirmed: false,
        tx_error: false,
        upload_error: false
    };

    readonly on_deploy = (): void => {
        const minter_id = this.props.minters[this.props.form_data.minter].id;
        const marketer_id = this.props.marketers[this.props.form_data.marketer].id;
        const approver_id = this.props.approvers[this.props.form_data.approver].id;

        const event_contract = this.props.event_contracts
            .filter((contract: StrapiEventContract): boolean => contract.minter.id === minter_id)
            .filter((contract: StrapiEventContract): boolean => contract.marketer.id === marketer_id)
            .filter((contract: StrapiEventContract): boolean => contract.approver.id === approver_id)
            [0];

        const args = [this.props.t721_address.address]
            .concat(this.props.minters[this.props.form_data.minter].build_arguments.map((arg_name: any): any => this.props.form_data.minter_args[arg_name.name]))
            .concat(this.props.marketers[this.props.form_data.minter].build_arguments.map((arg_name: any): any => this.props.form_data.minter_args[arg_name.name]))
            .concat(this.props.approvers[this.props.form_data.minter].build_arguments.map((arg_name: any): any => this.props.form_data.minter_args[arg_name.name]));

        RGA.event({
            category: 'Tx - Event Creation',
            action: 'Broadcast'
        });
        this.setState({
            deploy_tx_id: this.props.deploy(event_contract.name, {
                from: this.props.coinbase
            }, args)
        });

    }

    upload_images = async (): Promise<any> => {
        const banners_form = this.props.form_data.banners();
        const banners_result = await this.props.strapi.upload(banners_form) as any[];

        const image_form = this.props.form_data.image();
        const image_result = await this.props.strapi.upload(image_form) as any[];

        return {
            banners: banners_result.map((banner: any): number => banner.id),
            image: image_result[0].id
        };

    }

    componentWillUpdate(nextProps: Readonly<EventCreationDeployOwnProps & EventDeployProps & EventCreationDeployRState & EventCreationDeployRDispatch>, nextState: Readonly<EventCreationDeployState>, nextContext: any): void {
        if (nextProps.get_tx && nextState.deploy_tx_id !== null) {
            const tx = nextProps.get_tx(nextState.deploy_tx_id);
            if (!tx) return ;

            switch (tx.status) {
                case 'Confirming': {
                    if (nextState.tx_confirming === false) {
                        RGA.event({
                            category: 'Tx - Event Creation',
                            action: 'Confirming',
                            label: tx.hash
                        });
                        this.setState({
                            tx_confirming: true
                        });
                    }
                    break ;
                }
                case 'Confirmed': {
                    if (nextState.tx_confirmed === false) {
                        RGA.event({
                            category: 'Tx - Event Creation',
                            action: 'Confirmed',
                            label: tx.hash
                        });
                        this.setState({
                            tx_confirmed: true
                        });
                    }
                    break ;
                }
                case 'Error': {
                    if (nextState.tx_error === false) {
                        RGA.event({
                            category: 'Tx - Event Creation',
                            action: 'Error',
                            label: tx.hash || 'none',
                            value: 5
                        });
                        this.setState({
                            tx_error: true
                        });
                    }
                    break ;
                }
            }

            if (nextState.upload_result && nextState.upload_result.error && nextState.upload_error === false) {
                this.setState({
                    upload_error: true
                });
                RGA.event({
                    category: 'Event',
                    action: 'Event Creation Upload Error',
                    value: 5
                });
            }
        }
    }

    get_progress = (): { progress: number; text: string; type: string; } => {
        if (this.state.deploy_tx_id !== null) {
            const tx = this.props.get_tx(this.state.deploy_tx_id);
            if (tx) {
                switch (tx.status) {
                    case 'Confirming':
                        let progress = 0;
                        if (tx.infos.blockNumber) {
                            progress = ((this.props.current_block - tx.infos.blockNumber) / this.props.confirmation_threshold) * 80;
                            if (progress < 0) progress = 0;
                        }
                        return {
                            progress: 10 + progress,
                            text: this.props.t('transaction_sent_waiting_confirmations'),
                            type: 'active'
                        };
                    case 'Confirmed':
                        if (this.state.uploading === false) {

                            this.upload_images()
                                .then((images_id: any): any =>
                                    this.props.strapi.createEntry('queuedevents', {
                                        ...images_id,
                                        name: this.props.form_data.name,
                                        description: this.props.form_data.description,
                                        transaction_hash: tx.hash,
                                        location: this.props.form_data.location,
                                        start: new Date(this.props.form_data.dates.start),
                                        end: new Date(this.props.form_data.dates.end)
                                    }))
                                .then((res: any): void => {
                                    this.setState({
                                        upload_result: res
                                    });
                                    this.props.set({
                                        deployed: true
                                    });
                                    this.props.resetCoinbase(this.props.coinbase);
                                })
                                .catch((e: Error): void => {
                                    this.setState({
                                        upload_result: {
                                            error: e
                                        }
                                    });
                                });

                            this.setState({
                                uploading: true
                            });

                            return {
                                progress: 90,
                                text: this.props.t('transaction_confirmed_waiting_upload'),
                                type: 'active'
                            };
                        } else {

                            if (this.state.upload_result === null) {

                                return {
                                    progress: 95,
                                    text: this.props.t('upload_done_waiting_response'),
                                    type: 'active'
                                };

                            } else {
                                if (this.state.upload_result.error) {

                                    return {
                                        progress: 99,
                                        text: this.props.t('upload_error'),
                                        type: 'exception'
                                    };

                                } else {

                                    return {
                                        progress: 100,
                                        text: this.props.t('process_done'),
                                        type: 'active'
                                    };

                                }

                            }

                        }
                    case 'Error':
                        return {
                            progress: 90,
                            text: this.props.t('transaction_failed'),
                            type: 'exception'
                        };
                }
            }

            return {
                progress: 5,
                text: this.props.t('waiting_transaction'),
                type: 'active'
            };
        } else {
            return {
                progress: 0,
                text: '',
                type: 'active'
            };
        }
    }

    render(): React.ReactNode {

        const {progress, text, type}: { progress: number; text: string; type: string } = this.get_progress();

        return <div style={{textAlign: 'center'}} id={'event_deploy_progress'}>
            <style>{`
            #event_deploy_progress .ant-progress-success-bg, .ant-progress-bg {
                background-color: ${theme.primary};
            }
            `}</style>
            <Typography.Text style={{fontSize: 32}}>
                {this.props.t(this.state.deploy_tx_id === null ? 'start_deploy' : 'started_deploying')}
            </Typography.Text>
            <DeployLoader
                is_paused={!(this.state.deploy_tx_id !== null)}
                progress={progress}
                type={type}
            />
            {
                this.state.deploy_tx_id !== null && progress !== 100
                    ?
                    <div style={{textAlign: 'center'}}>
                        <Typography.Text style={{fontSize: 20}}>{text}</Typography.Text>
                        <br/>
                        <Progress status={type} percent={progress}/>
                        <br/>
                    </div>
                    :
                    null
            }
            {
                progress === 100
                    ?
                    <div style={{textAlign: 'center'}}>
                        <Typography.Text style={{fontSize: 20}}>{this.props.t('deploy_success')}</Typography.Text>
                        <br/>
                        <br/>
                        <StrapiCoinbaseConsumer>
                            {(ctx: StrapiCoinbaseContext): React.ReactNode => {
                                if (ctx.coinbase) {
                                    const tx = this.props.get_tx(this.state.deploy_tx_id);

                                    const idx = ctx.coinbase.queuedevents.findIndex((event: any): boolean =>
                                        event.address.toLowerCase() === tx.contract_address.toLowerCase());

                                    if (idx !== -1) {

                                        return <routes.Link route='events' params={{id: idx}}>
                                            <Button>
                                                {this.props.t('see_event')}
                                            </Button>
                                        </routes.Link>;

                                    } else {

                                        return <Button
                                            loading={true}
                                            disabled={true}
                                        >
                                            {this.props.t('waiting_for_fetch')}
                                        </Button>;

                                    }

                                } else {
                                    return <Button
                                        loading={true}
                                        disabled={true}
                                    >
                                        {this.props.t('waiting_for_fetch')}
                                    </Button>;
                                }
                            }
                            }
                        </StrapiCoinbaseConsumer>
                    </div>
                    :
                    null
            }
            {
                this.state.deploy_tx_id === null
                    ?
                    <Button
                        onClick={this.on_deploy}
                    >
                        {this.props.t('button_deploy')}
                    </Button>
                    :
                    null
            }
        </div>;
    }
}

const mapStateToProps = (state: AppState): EventCreationDeployRState => ({
    coinbase: state.vtxconfig.coinbase,
    t721_address: state.contracts.alias.T721V0['@t721v0'],
    specs: state.contracts.specs,
    confirmation_threshold: state.vtxconfig.confirmation_threshold,
    current_block: state.blocks.current_height,
    strapi: state.app.strapi,
    get_tx: (tx_id: number): Tx => getTransactionById(state, tx_id)
});

const mapDispatchToProps = (dispatch: Dispatch): EventCreationDeployRDispatch => ({
    deploy: (spec_name: string, tx_infos: Partial<TxInfos>, args: any[]): number => deployContract(dispatch, {
        name: spec_name,
        alias: '@eventdeployed'
    }, tx_infos, args),
    resetCoinbase: (coinbase: string): void => StrapiHelper.resetEntries(dispatch, 'addresses', {address: coinbase.toLowerCase()})
});

export default connect(mapStateToProps, mapDispatchToProps)(
    EventCreationDeploy
) as React.ComponentType<EventCreationDeployProps>;
