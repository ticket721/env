import { EventCreationTabBaseProps } from '@web_views/events_overview/EventCreationForm/EventCreationData';
import * as React                    from 'react';
import { Typography, Select, Card }         from 'antd';
import { StrapiMinter }                     from '@utils/strapi/minter';
import ContractArgumentForm                 from '@web_views/events_overview/EventCreationForm/ContractArgumentForm';
import { extras, overrides }                from './overrides';
import { MinterIgnored }                    from './ignored';
import { compatible }                       from '@web_contract_plugins/compatible';
import { I18N }                             from '@utils/misc/i18n';
import _                                    from 'lodash-core';
import { minterBuildArgumentsConfigurator } from '../minterBuildArgumentsConfigurator';
import { theme }                            from '../../../utils/theme';
import { RGA }                              from '../../../utils/misc/ga';

const {Option}: any = Select;

// Props

interface MinterSelectionFormOwnProps {
    t: any;
}

export type MinterSelectionFormProps = MinterSelectionFormOwnProps & EventCreationTabBaseProps;

type MergedMinterSelectionFormProps = MinterSelectionFormProps;

interface MinterSelectionFormState {
    selected: number;
}

class MinterSelectionForm extends React.Component<MergedMinterSelectionFormProps, MinterSelectionFormState> {

    state: MinterSelectionFormState = {
        selected: null
    };

    componentDidMount(): void {
        RGA.pageview(window.location.pathname + '/create/minter');
    }

    constructor(props: MergedMinterSelectionFormProps) {
        super(props);

        this.state = {
            selected: props.form_data.minter
        };

    }

    handle_selection = (minter_name: any): void => {
        const selection = this.props.minters.findIndex((minter: StrapiMinter): boolean => minter.name === minter_name);
        if (selection !== -1) {
            this.setState({
                selected: selection
            });
        }
        if (this.props.minters[selection].build_arguments.length === 0) {
            this.props.set_data('minter', selection);
        } else {
            this.props.set_data('minter', null);
        }
    }

    handle_argument_value = (field: string, value: any): void => {
        const current = this.props.form_data.minter_args;
        current[field] = value;
        this.props.set_data('minter_args', current);

        if (this.state.selected !== null) {
            for (const argument of this.props.minters[this.state.selected].build_arguments) {
                if (this.props.form_data.minter_args[argument.name] === null || this.props.form_data.minter_args[argument.name] === undefined || (
                    _.isArray(this.props.form_data.minter_args[argument.name]) &&
                    (this.props.form_data.minter_args[argument.name].length === 0 || this.props.form_data.minter_args[argument.name].findIndex((elem: any): boolean => elem === null) !== -1)
                )) {
                    if (this.props.form_data.minter !== null) {
                        this.props.set_data('minter', null);
                    }
                    return;
                }
            }
            this.props.set_data('minter', this.state.selected);
        }
    }

    render(): React.ReactNode {

        const options = this.props.minters ? this.props.minters
            .filter((minter: StrapiMinter): boolean =>
                MinterIgnored.indexOf(minter.name) === -1)
            .map((minter: StrapiMinter, idx: number): React.ReactNode => {
                const is_compatible = compatible(
                    this.props.minters, idx,
                    this.props.approvers, this.props.form_data.approver,
                    this.props.marketers, this.props.form_data.marketer,
                    this.props.event_contracts
                );
                return <Option disabled={!is_compatible} value={minter.name} key={minter.name}>
                    {this.props.t(minter.name + '_name')}
                </Option>;
            }) : [];

        return <div>
            <Typography.Text style={{fontSize: 42, color: theme.primary}}>
                {this.props.t('sell_strategy')}
            </Typography.Text>
            <br/>
            <Typography.Text style={{fontSize: 21, color: theme.dark2}}>
                {this.props.t('sell_strategy_description')}
            </Typography.Text>
            <br/>
            <br/>
            <br/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <Select
                    placeholder={this.props.t('sell_strategy_placeholder')}
                    value={this.state.selected !== null ? this.props.minters[this.state.selected].name : undefined}
                    style={{width: '50%'}}
                    onChange={this.handle_selection}
                >
                    {options}
                </Select>
                <br/>
                <br/>
                {
                    this.state.selected !== null && this.props.minters[this.state.selected].build_arguments.length > 0

                        ?

                        <Card style={{width: '100%', backgroundColor: theme.bwhite}}>
                            <ContractArgumentForm
                                name={this.props.minters[this.state.selected].name}
                                arguments={
                                    minterBuildArgumentsConfigurator(
                                        this.props.minters[this.state.selected].name,
                                        this.props.minters[this.state.selected].build_arguments,
                                        this.props.form_data
                                    )
                                }
                                argument_values={this.props.form_data.minter_args}
                                on_change={this.handle_argument_value}
                                plugin_type='minters'
                                extras={extras}
                                overrides={overrides}
                            />
                        </Card>

                        :

                        null

                }
            </div>
        </div>;

    }
}

export default I18N.withNamespaces(['minters'])(MinterSelectionForm) as React.ComponentType<MinterSelectionFormProps>;
