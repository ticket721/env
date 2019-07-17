import { EventCreationTabBaseProps } from '@web_views/events_overview/EventCreationForm/EventCreationData';
import * as React                   from 'react';
import { Typography, Select, Card } from 'antd';
import { StrapiApprover }           from '@utils/strapi/approver';
import ContractArgumentForm         from '@web_views/events_overview/EventCreationForm/ContractArgumentForm';
import { ApproverIgnored }          from './ignored';
import { compatible }               from '@web_contract_plugins/compatible';
import { I18N }                     from '@utils/misc/i18n';
import _                            from 'lodash-core';
import { theme }                    from '../../../utils/theme';
import { RGA }                      from '../../../utils/misc/ga';

const {Option}: any = Select;

// Props

interface ApproverSelectionFormOwnProps {
    t: any;
}

export type ApproverSelectionFormProps = ApproverSelectionFormOwnProps & EventCreationTabBaseProps;

type MergedApproverSelectionFormProps = ApproverSelectionFormProps;

interface ApproverSelectionFormState {
    selected: number;
}

class ApproverSelectionForm extends React.Component<MergedApproverSelectionFormProps, ApproverSelectionFormState> {

    state: ApproverSelectionFormState = {
        selected: null
    };

    componentDidMount(): void {
        RGA.pageview(window.location.pathname + '/create/approver');
    }

    constructor(props: MergedApproverSelectionFormProps) {
        super(props);

        this.state = {
            selected: props.form_data.approver
        };

    }

    handle_selection = (approver_name: any): void => {
        const selection = this.props.approvers.findIndex((approver: StrapiApprover): boolean => approver.name === approver_name);
        if (selection !== -1) {
            this.setState({
                selected: selection
            });
        }
        if (this.props.approvers[selection].build_arguments.length === 0) {
            this.props.set_data('approver', selection);
        } else {
            this.props.set_data('approver', null);
        }
    }

    handle_argument_value = (field: string, value: any): void => {
        const current = this.props.form_data.approver_args;
        current[field] = value;
        this.props.set_data('approver_args', current);

        if (this.state.selected !== null) {
            for (const argument of this.props.approvers[this.state.selected].build_arguments) {
                if (this.props.form_data.approver_args[argument.name] === null || this.props.form_data.approver_args[argument.name] === undefined || (
                    _.isArray(this.props.form_data.approver_args[argument.name]) &&
                    (this.props.form_data.approver_args[argument.name].length === 0 || this.props.form_data.approver_args[argument.name].findIndex((elem: any): boolean => elem === null) !== -1)
                )) {
                    if (this.props.form_data.approver !== null) {
                        this.props.set_data('approver', null);
                    }
                    return;
                }
            }
            this.props.set_data('approver', this.state.selected);
        }
    }

    render(): React.ReactNode {

        const options = this.props.approvers ? this.props.approvers
            .filter((approver: StrapiApprover): boolean =>
                ApproverIgnored.indexOf(approver.name) === -1)
            .map((approver: StrapiApprover, idx: number): React.ReactNode => {
                const is_compatible = compatible(
                    this.props.approvers, idx,
                    this.props.approvers, this.props.form_data.approver,
                    this.props.marketers, this.props.form_data.marketer,
                    this.props.event_contracts
                );
                return <Option disabled={!is_compatible} value={approver.name} key={approver.name}>
                    {this.props.t(approver.name + '_name')}
                </Option>;
            }) : [];

        return <div>
            <Typography.Text style={{fontSize: 42, color: theme.primary}}>
                {this.props.t('transfer_strategy')}
            </Typography.Text>
            <br/>
            <Typography.Text style={{fontSize: 21, color: theme.dark2}}>
                {this.props.t('transfer_strategy_description')}
            </Typography.Text>
            <br/>
            <br/>
            <br/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
                <Select
                    placeholder={this.props.t('transfer_strategy_placeholder')}
                    value={this.state.selected !== null ? this.props.approvers[this.state.selected].name : undefined}
                    style={{width: '50%'}}
                    onChange={this.handle_selection}
                >
                    {options}
                </Select>
                <br/>
                <br/>
                {
                    this.state.selected !== null && this.props.approvers[this.state.selected].build_arguments.length > 0

                        ?

                        <Card style={{width: '100%', backgroundColor: theme.bwhite}}>
                            <ContractArgumentForm
                                name={this.props.approvers[this.state.selected].name}
                                arguments={this.props.approvers[this.state.selected].build_arguments}
                                argument_values={this.props.form_data.approver_args}
                                on_change={this.handle_argument_value}
                                plugin_type={'approvers'}
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

export default I18N.withNamespaces(['approvers'])(ApproverSelectionForm) as React.ComponentType<ApproverSelectionFormProps>;
