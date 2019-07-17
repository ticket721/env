import * as React                from 'react';
import { Divider, Typography }   from 'antd';
import { EventCreationData }     from '../../EventCreationData';
import { I18N, I18NProps }       from '@utils/misc/i18n';
import { StrapiApprover }        from '@utils/strapi/approver';
import * as ApproverDescriptions from '@web_contract_plugins/approver/ApproverDescriptions';

// Props

export interface IEventCreationSummaryApproverProps {
    form_data: EventCreationData;
    approvers: StrapiApprover[];
    pt: any;
}

type MergedEventCreationSummaryProps = IEventCreationSummaryApproverProps & I18NProps;

class EventCreationSummaryApprover extends React.Component<MergedEventCreationSummaryProps> {
    render(): React.ReactNode {
        return <div>

            <Divider orientation='left'>{this.props.pt('transfer_strategy_title')}</Divider>

            <div style={{marginLeft: 20}}>

                <Typography.Text style={{fontSize: 20}}>
                    {this.props.t(`${this.props.approvers[this.props.form_data.approver].name}_name`)}
                </Typography.Text>

                <br/>
                <br/>

                <Typography.Text style={{fontSize: 16}}>
                    {ApproverDescriptions[this.props.approvers[this.props.form_data.approver].name](this.props.form_data.approver_args, this.props.t)}
                </Typography.Text>

            </div>

        </div>;

    }
}

export default I18N.withNamespaces(['approvers'])(EventCreationSummaryApprover) as React.ComponentType<IEventCreationSummaryApproverProps>;
