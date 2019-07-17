import * as React                   from 'react';
import { Divider, Typography }      from 'antd';
import EventCreationSummaryMinter   from './EventCreationSummaryMinter';
import EventCreationSummaryMarketer from './EventCreationSummaryMarketer';
import EventCreationSummaryApprover from './EventCreationSummaryApprover';
import { EventDeployProps }         from '../EventDeployProps';
import { DatePicker }               from 'antd';
const RangePicker: any = DatePicker.RangePicker;
import moment                       from 'moment';
import { theme }                    from '../../../../../utils/theme';
import { RGA }                      from '../../../../../utils/misc/ga';

interface EventCreationSummaryOwnProps {

}
export type EventCreationSummaryProps = EventCreationSummaryOwnProps & EventDeployProps;

type MergedEventCreationSummaryProps = EventCreationSummaryProps;

export default class IEventCreationSummary extends React.Component<MergedEventCreationSummaryProps> {

    componentDidMount(): void {
        RGA.modalview('/create/summary');
    }

    render(): React.ReactNode {
        return <div>

            <style>{`
                .ant-divider-inner-text {
                    color: ${theme.primary};
                    font-weight: 300;
                }    
            `}</style>
            <div>

                <Divider orientation='left'>{this.props.t('name_title')}</Divider>

                <Typography.Text style={{fontSize: 25, marginLeft: 20}}>
                    {this.props.form_data.name}
                </Typography.Text>

            </div>

            <div>

                <Divider orientation='left'>{this.props.t('description_title')}</Divider>

                <div style={{marginLeft: 20}}>

                    <Typography.Text style={{fontSize: 16}}>
                        {this.props.form_data.description}
                    </Typography.Text>

                </div>

            </div>

            <div>

                <Divider orientation='left'>{this.props.t('location_title')}</Divider>

                <div style={{marginLeft: 20}}>

                    <Typography.Text style={{fontSize: 16}}>
                        {this.props.form_data.location.label}
                    </Typography.Text>

                </div>

            </div>

            <div style={{textAlign: 'center'}}>

                <Divider orientation='left'>{this.props.t('dates_title')}</Divider>

                <div style={{marginLeft: 20}}>

                    <RangePicker
                        defaultValue={[moment(this.props.form_data.dates.start), moment(this.props.form_data.dates.end)]}
                        format='YYYY/MM/DD HH:mm'
                        disabled={true}
                        style={{width: '80%'}}
                    />

                </div>

            </div>

            <EventCreationSummaryMinter
                pt={this.props.t}
                form_data={this.props.form_data}
                minters={this.props.minters}
            />

            <EventCreationSummaryMarketer
                pt={this.props.t}
                form_data={this.props.form_data}
                marketers={this.props.marketers}
            />

            <EventCreationSummaryApprover
                pt={this.props.t}
                form_data={this.props.form_data}
                approvers={this.props.approvers}
            />
        </div>;
    }
}
