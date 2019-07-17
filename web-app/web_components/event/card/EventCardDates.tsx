import { StrapiEvent }               from '../../../utils/strapi/event';
import * as React                    from 'react';
import { Divider, Icon, Typography } from 'antd';
import moment                        from 'moment';
import { theme }                     from '../../../utils/theme';

export interface EventCardDatesProps {
    event: StrapiEvent;
}

type MergedEventCardDatesProps = EventCardDatesProps;

export default class EventCardDates extends React.Component<MergedEventCardDatesProps> {

    same_day = (begin: string, end: string): boolean => {
        const d1 = new Date(begin);
        const d2 = new Date(end);

        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    render(): React.ReactNode {
        if (!this.props.event || !this.props.event.start) {
            return null;
        }

        const start = moment(this.props.event.start).format('DD MMM YYYY');

        if (!this.props.event.end) {
            return <div style={{width: '100%'}}>
                <Divider style={{width: '60%', minWidth: '60%', marginLeft: '20%', backgroundColor: theme.dark7, marginBottom: 0}}/>
                <div style={{width: '100%', height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography.Text style={{color: theme.white, fontWeight: 100, fontSize: 32}}>{start}</Typography.Text>
                </div>
            </div>;
        }

        if (!this.same_day(this.props.event.start, this.props.event.end)) {
            const end = this.props.event.start ? moment(this.props.event.end).format('DD MMM YYYY') : null;

            return <div style={{width: '100%'}}>
                <Divider
                    style={{
                        width: '60%',
                        minWidth: '60%',
                        marginLeft: '20%',
                        backgroundColor: theme.dark7,
                        marginBottom: 0
                    }}
                />
                <div
                    style={{
                        width: '100%',
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography.Text
                        style={{color: theme.white, fontWeight: 100, fontSize: 32}}
                    >
                        {start} <Icon style={{fontSize: 22}} type='right'/> {end}
                    </Typography.Text>
                </div>
            </div>;
        } else {

            const start_time = moment(this.props.event.start).format('HH:mm').replace(':', 'h');
            const end_time = moment(this.props.event.end).format('HH:mm').replace(':', 'h');

            return <div style={{width: '100%'}}>
                <Divider
                    style={{
                        width: '60%',
                        minWidth: '60%',
                        marginLeft: '20%',
                        backgroundColor: theme.dark7,
                        marginBottom: 0
                    }}
                />
                <div
                    style={{
                        width: '100%',
                        height: 100,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography.Text
                        style={{color: theme.white, fontWeight: 100, fontSize: 32}}
                    >
                        {start} <span style={{marginLeft: 24}}>{start_time} <Icon style={{fontSize: 22}} type='right'/> {end_time}</span>
                    </Typography.Text>
                </div>
            </div>;

        }
    }
}
