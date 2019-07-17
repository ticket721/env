import * as React                 from 'react';
import { DatePicker, Typography } from 'antd';
import moment, { Moment }         from 'moment';
import { theme }                  from '../../../../utils/theme';

// Props

export interface DateInputProps {
    plugin_name: string;
    name: string;
    value: number;
    on_change: (field: string, value: any) => void;
    t: any;
    options?: any;
}

export class DateInput extends React.Component<DateInputProps> {

    private readonly inner_on_change = (val: Moment): void => {
        this.props.on_change(this.props.name, val.valueOf() / 1000);
    }

    private readonly disable_dates = (val: Moment): boolean => {
        if (val.valueOf() < Date.now()) return true;

        if (this.props.options && this.props.options.limit) {

            const event_start = moment(this.props.options.limit);

            if (val.valueOf() >= event_start.valueOf()) return true;

        }

        return false;
    }

    render(): React.ReactNode {

        const title = this.props.t(`${this.props.plugin_name}_${this.props.name}`);
        const description = this.props.t(`${this.props.plugin_name}_${this.props.name}_description`);
        const placeholder = this.props.t(`${this.props.plugin_name}_${this.props.name}_placeholder`);

        return <div style={{margin: 30}}>
            <Typography.Text style={{fontSize: 26, color: theme.dark2}}>{title}</Typography.Text>
            <br/>
            <br/>
            <div style={{marginLeft: 30}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark3}}>{description}</Typography.Text>
            </div>
            <br/>
            <DatePicker
                style={{width: '100%', marginLeft: 20, marginTop: 5}}
                showToday={false}
                showTime={{format: 'HH:mm', defaultValue: moment('12:00:00', 'HH:mm')}}
                value={this.props.value ? moment(this.props.value * 1000) : undefined}
                placeholder={placeholder}
                disabledDate={this.disable_dates}
                onOk={this.inner_on_change}
                onChange={this.inner_on_change}
            />
        </div>;
    }
}
