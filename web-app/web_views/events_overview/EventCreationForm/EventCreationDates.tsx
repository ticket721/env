import { EventCreationData, EventCreationSetData } from './EventCreationData';
import * as React                                  from 'react';
import { DatePicker, Typography }                  from 'antd';
import { RangePickerProps }                        from 'antd/lib/date-picker/interface';
import moment, { Moment }                          from 'moment';
import { theme }                                   from '../../../utils/theme';

const RangePicker: React.ComponentType<RangePickerProps> = DatePicker.RangePicker;

export interface EventCreationDatesProps {
    form_data: EventCreationData;
    set_data: EventCreationSetData;
    t: any;
}

export default class EventCreationDates extends React.Component<EventCreationDatesProps> {

    on_change = (times: Moment[]): void => {
        this.props.set_data('dates', {
            start: times[0].valueOf(),
            end: times[1].valueOf()
        });
    }

    disabledDate = (current: Moment): boolean =>
        current && current.valueOf() < moment().valueOf()

    render(): React.ReactNode {
        return <div>
            <br/>
            <Typography.Text style={{fontSize: 32, color: theme.dark2}}>{this.props.t('dates_title')}</Typography.Text>
            <br/>
            <br/>
            <div style={{marginLeft: 10}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark3}}>{this.props.t('dates_description')}</Typography.Text>
                <br/>
                <br/>
                <RangePicker
                    showTime={{format: 'HH:mm', defaultValue: [moment('18:00', 'HH:mm'), moment('21:00', 'HH:mm')]}}
                    disabledDate={this.disabledDate}
                    format='YYYY/MM/DD HH:mm'
                    onChange={this.on_change}
                    value={this.props.form_data.dates ? [moment(this.props.form_data.dates.start), moment(this.props.form_data.dates.end)] : undefined}
                    style={{width: '50%'}}
                />
            </div>
        </div>;
    }
}
