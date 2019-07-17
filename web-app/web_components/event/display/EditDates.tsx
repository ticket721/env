import * as React                        from 'react';
import { StrapiEvent }                   from '../../../utils/strapi/event';
import { I18N, I18NProps }               from '../../../utils/misc/i18n';
import { DatePicker, Input, Typography } from 'antd';
import { theme }                         from '../../../utils/theme';
import * as moment                       from 'moment';
import { Moment }                        from 'moment';

export interface EditDatesProps {
    event: StrapiEvent;
    on_change: (new_dates: any) => void;
}

type MergedEditDatesProps = EditDatesProps & I18NProps;

interface EditDatesState {
    value: any;
}

class EditDates extends React.Component<MergedEditDatesProps> {

    state: EditDatesState;

    constructor(props: MergedEditDatesProps) {
        super(props);

        this.state = {
            value: {
                start: props.event.start ? moment(props.event.start) : undefined,
                end: props.event.end ? moment(props.event.end) : undefined
            }
        };
    }

    on_change = (dates: Moment[], strings: string[]): void => {

        const value = {
            start: dates[0],
            end: dates[1]
        };

        this.setState({
            value
        });

        this.props.on_change(value);
    }

    render(): React.ReactNode {
        return <div id='edit-dates'>
            <Typography.Text style={{fontSize: 22, color: theme.dark2}}>{this.props.t('edit_dates_title')}</Typography.Text>
            <style>{`
                #edit-dates .edited-input {
                    border: 1px solid ${theme.gold};
                    border-radius: 5px;
                }
                
                #edit-dates .unedited-input {
                    border: 1px solid ${theme.inputgrey};
                    border-radius: 5px;
                }
            `}</style>
            <br/>
            <DatePicker.RangePicker
                className={
                    (this.state.value.start && this.state.value.start.valueOf() !== moment(this.props.event.start).valueOf())
                    ||
                    (this.state.value.end && this.state.value.end.valueOf() !== moment(this.props.event.end).valueOf())

                        ?
                        'edited-input'

                        :
                        'unedited-input'
                }
                style={{marginTop: 12, width: '100%'}}
                value={[
                    this.state.value.start ? moment(this.state.value.start) : undefined,
                    this.state.value.end ? moment(this.state.value.end) : undefined
                ]}
                onChange={this.on_change}
                showTime={true}
            />
        </div>;

    }
}

export default I18N.withNamespaces(['events'])(EditDates) as React.ComponentType<EditDatesProps>;
