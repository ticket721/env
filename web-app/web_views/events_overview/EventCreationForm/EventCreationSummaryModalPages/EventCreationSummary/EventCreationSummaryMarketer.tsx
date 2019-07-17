import * as React                from 'react';
import { Divider, Typography }   from 'antd';
import { EventCreationData }     from '../../EventCreationData';
import { I18N, I18NProps }       from '@utils/misc/i18n';
import { StrapiMarketer }        from '@utils/strapi/marketer';
import * as MarketerDescriptions from '@web_contract_plugins/marketer/MarketerDescriptions';

//Props

export interface EventCreationSummaryMarketerProps {
    form_data: EventCreationData;
    marketers: StrapiMarketer[];
    pt: any;
}

type MergedEventCreationSummaryMarketerProps = EventCreationSummaryMarketerProps & I18NProps;

class EventCreationSummaryMarketer extends React.Component<MergedEventCreationSummaryMarketerProps> {
    render(): React.ReactNode {
        return <div>

            <Divider orientation='left'>{this.props.pt('marketplace_strategy_title')}</Divider>

            <div style={{marginLeft: 20}}>

                <Typography.Text style={{fontSize: 20}}>
                    {this.props.t(`${this.props.marketers[this.props.form_data.marketer].name}_name`)}
                </Typography.Text>

                <br/>
                <br/>

                <Typography.Text style={{fontSize: 16}}>
                    {MarketerDescriptions[this.props.marketers[this.props.form_data.marketer].name](this.props.form_data.marketer_args, this.props.t)}
                </Typography.Text>

            </div>

        </div>;

    }
}

export default I18N.withNamespaces(['marketers'])(EventCreationSummaryMarketer) as React.ComponentType<EventCreationSummaryMarketerProps>;
