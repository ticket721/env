import { EventCreationTabBaseProps } from '@web_views/events_overview/EventCreationForm/EventCreationData';
import * as React                   from 'react';
import { Typography, Select, Card } from 'antd';
import { StrapiMarketer }           from '@utils/strapi/marketer';
import ContractArgumentForm         from '@web_views/events_overview/EventCreationForm/ContractArgumentForm';
import { MarketerIgnored }          from './ignored';
import { compatible }               from '@web_contract_plugins/compatible';
import { I18N }                     from '@utils/misc/i18n';
import _                            from 'lodash-core';
import { theme }                    from '../../../utils/theme';
import { RGA }                      from '../../../utils/misc/ga';

const {Option}: any = Select;

// Props

interface MarketerSelectionFormOwnProps {
    t: any;
}

export type MarketerSelectionFormProps = MarketerSelectionFormOwnProps & EventCreationTabBaseProps;

type MergedMarketerSelectionFormProps = MarketerSelectionFormProps;

interface MarketerSelectionFormState {
    selected: number;
}

class MarketerSelectionForm extends React.Component<MergedMarketerSelectionFormProps, MarketerSelectionFormState> {

    state: MarketerSelectionFormState = {
        selected: null
    };

    componentDidMount(): void {
        RGA.pageview(window.location.pathname + '/create/marketer');
    }

    constructor(props: MergedMarketerSelectionFormProps) {
        super(props);

        this.state = {
            selected: props.form_data.marketer
        };

    }

    handle_selection = (marketer_name: any): void => {
        const selection = this.props.marketers.findIndex((marketer: StrapiMarketer): boolean => marketer.name === marketer_name);
        if (selection !== -1) {
            this.setState({
                selected: selection
            });
        }
        if (this.props.marketers[selection].build_arguments.length === 0) {
            this.props.set_data('marketer', selection);
        } else {
            this.props.set_data('marketer', null);
        }
    }

    handle_argument_value = (field: string, value: any): void => {
        const current = this.props.form_data.marketer_args;
        current[field] = value;
        this.props.set_data('marketer_args', current);

        if (this.state.selected !== null) {
            for (const argument of this.props.marketers[this.state.selected].build_arguments) {
                if (this.props.form_data.marketer_args[argument.name] === null || this.props.form_data.marketer_args[argument.name] === undefined || (
                    _.isArray(this.props.form_data.marketer_args[argument.name]) &&
                    (this.props.form_data.marketer_args[argument.name].length === 0 || this.props.form_data.marketer_args[argument.name].findIndex((elem: any): boolean => elem === null) !== -1)
                )) {
                    if (this.props.form_data.marketer !== null) {
                        this.props.set_data('marketer', null);
                    }
                    return;
                }
            }
            this.props.set_data('marketer', this.state.selected);
        }
    }

    render(): React.ReactNode {

        const options = this.props.marketers ? this.props.marketers
            .filter((marketer: StrapiMarketer): boolean =>
                MarketerIgnored.indexOf(marketer.name) === -1)
            .map((marketer: StrapiMarketer, idx: number): React.ReactNode => {
                const is_compatible = compatible(
                    this.props.minters, this.props.form_data.minter,
                    this.props.approvers, this.props.form_data.approver,
                    this.props.marketers, idx,
                    this.props.event_contracts
                );
                return <Option disabled={!is_compatible} value={marketer.name} key={marketer.name}>
                    {this.props.t(marketer.name + '_name')}
                </Option>;
            }) : [];

        return <div>
            <Typography.Text style={{fontSize: 42, color: theme.primary}}>
                {this.props.t('marketplace_strategy')}
            </Typography.Text>
            <br/>
            <Typography.Text style={{fontSize: 21, color: theme.dark2}}>
                {this.props.t('marketplace_strategy_description')}
            </Typography.Text>
            <br/>
            <br/>
            <br/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <Select
                    placeholder={this.props.t('marketplace_strategy_placeholder')}
                    value={this.state.selected !== null ? this.props.marketers[this.state.selected].name : undefined}
                    style={{width: '50%'}}
                    onChange={this.handle_selection}
                >
                    {options}
                </Select>
                <br/>
                <br/>
                {
                    this.state.selected !== null && this.props.marketers[this.state.selected].build_arguments.length > 0

                        ?

                        <Card style={{width: '100%', backgroundColor: theme.bwhite}}>
                            <ContractArgumentForm
                                name={this.props.marketers[this.state.selected].name}
                                arguments={this.props.marketers[this.state.selected].build_arguments}
                                argument_values={this.props.form_data.marketer_args}
                                on_change={this.handle_argument_value}
                                plugin_type={'marketers'}
                                overrides={{}}
                                extras={{}}
                            />
                        </Card>

                        :

                        null

                }
            </div>
        </div>;

    }
}

export default I18N.withNamespaces(['marketers'])(MarketerSelectionForm) as React.ComponentType<MarketerSelectionFormProps>;
