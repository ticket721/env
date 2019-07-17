import * as React              from 'react';
import { Divider, Typography } from 'antd';
import { EventCreationData }   from '../../EventCreationData';
import { I18N, I18NProps }     from '@utils/misc/i18n';
import { StrapiMinter }        from '@utils/strapi/minter';
import * as MinterDescriptions from '@web_contract_plugins/minter/MinterDescriptions';

export interface EventCreationSummaryMinterProps {
    form_data: EventCreationData;
    minters: StrapiMinter[];
    pt: any;
}

type MergedEventCreationSummaryMinterProps = EventCreationSummaryMinterProps & I18NProps;

class EventCreationSummaryMinter extends React.Component<MergedEventCreationSummaryMinterProps> {
    render(): React.ReactNode {
        return <div>

            <Divider orientation='left'>{this.props.pt('sell_strategy_title')}</Divider>

            <div style={{marginLeft: 20}}>

                <Typography.Text style={{fontSize: 20}}>
                    {this.props.t(`${this.props.minters[this.props.form_data.minter].name}_name`)}
                </Typography.Text>

                <br/>
                <br/>

                <Typography.Text style={{fontSize: 16}}>
                    {MinterDescriptions[this.props.minters[this.props.form_data.minter].name](this.props.form_data.minter_args, this.props.t)}
                </Typography.Text>

            </div>

        </div>;

    }
}

export default I18N.withNamespaces(['minters'])(EventCreationSummaryMinter) as React.ComponentType<EventCreationSummaryMinterProps>;
