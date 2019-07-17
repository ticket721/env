import * as React                              from 'react';
import { StrapiEvent }                         from '@utils/strapi/event';
import { Card, Icon, Spin, Table, Typography } from 'antd';
import { StrapiAddress }                       from '@utils/strapi/address';
import StrapiCall                              from '@components/strapi';
import { StrapiHelper }                        from '@utils/StrapiHelper';
import moment                                  from 'moment';
import { Moment }                              from 'moment';
import Address                                 from '@components/address';
import Ticket                                  from '@components/ticket';
import { theme }                               from '../../../utils/theme';

export interface EventActivityTableProps {
    event: StrapiEvent;
    address: StrapiAddress;
    t: any;
}

export default class EventActivityTable extends React.Component<EventActivityTableProps> {

    action_render = (action_type: any, elem: any): React.ReactNode =>
        <Typography.Text style={{fontSize: 20, color: theme.dark2}}>{this.props.t(`action_type_title_${action_type}`)}</Typography.Text>

    to_render = (to: any, elem: any): React.ReactNode => {
        if (to === this.props.event.address.id) {
            return <Typography.Text style={{fontSize: 18, color: theme.dark2}}>{this.props.event.name}</Typography.Text>;
        }
        return <StrapiCall
            calls={{
                action: StrapiHelper.getEntry('actions', elem.id)
            }}
        >
            {({action}: { action: any[] }): React.ReactNode => {
                if (action === undefined) {
                    return <Spin/>;
                } else {
                    if (action.length && action[0].data) {
                        return <Address address={action[0].data.to} size={18} color={theme.dark2}/>;
                    } else {
                        return <Icon type='warning'/>;
                    }
                }
            }}
        </StrapiCall>;
    }

    by_render = (by: any, elem: any): React.ReactNode => {
        if (by === this.props.event.address.id) {
            return <Typography.Text style={{fontSize: 18, color: theme.dark2}}>{this.props.event.name}</Typography.Text>;
        }
        return <StrapiCall
            calls={{
                action: StrapiHelper.getEntry('actions', elem.id)
            }}
        >
            {({action}: { action: any[] }): React.ReactNode => {
                if (action === undefined) {
                    return <Spin/>;
                } else {
                    if (action.length && action[0].data) {
                        return <Address address={action[0].data.by} size={18} color={theme.dark2}/>;
                    } else {
                        return <Icon type='warning'/>;
                    }
                }
            }}
        </StrapiCall>;
    }

    ticket_render = (ticket: any, elem: any): React.ReactNode => {
        if (ticket) {
            return <Ticket ticket={ticket} size={18} color={theme.dark2}/>;
        } else {
            return null;
        }

    }

    date_render = (date: Moment, elem: any): React.ReactNode =>
        <Typography.Text style={{fontSize: 18, color: theme.dark2}}>{date.format('MM/DD/YYYY HH:mm')}</Typography.Text>

    render(): React.ReactNode {

        const columns = [
            {
                title: 'Action', dataIndex: 'action', key: 'action', render: this.action_render, filters: [
                    {
                        text: 'Ticket Purchase',
                        value: 'mint'
                    },
                    {
                        text: 'Event Creation',
                        value: 'event'
                    }
                ],
                onFilter: (value: string, elem: any): boolean => elem.action === value
            },
            {title: 'By', dataIndex: 'by', key: 'by', render: this.by_render},
            {title: 'To', dataIndex: 'to', key: 'to', render: this.to_render},
            {title: 'Ticket', dataIndex: 'ticket', key: 'ticket', render: this.ticket_render},
            {title: 'Date', dataIndex: 'date', key: 'date', render: this.date_render}
        ];

        const actions = this.props.address.actions_by
            .concat(this.props.address.actions_to)
            .sort((l: any, r: any): number => r.id - l.id)
            .filter((elem: any): boolean => !(elem.action_type === 'transfer' && elem.by === this.props.address.id))
            .map((elem: any, idx: number): any =>
                ({
                    key: idx,
                    action: elem.action_type,
                    by: elem.by,
                    to: elem.to,
                    ticket: elem.on_ticket,
                    id: elem.id,
                    date: moment(elem.created_at)
                }));

        return <div id='activity_table' style={{width: '100%', height: '100%'}}>
            <style>{`
            #activity_table .ant-card-body {
                padding: 0px;
            }
            #activity_table .ant-pagination {
                margin-right: 12px;
            }
            #activity_table th {
                text-align: center;
            }
            #activity_table td {
                text-align: center;
            }
            #activity_table .ant-table-tbody tr td {
                background-color: ${theme.white};
            }
            #activity_table .ant-table-column-title {
                color: ${theme.primary};
                font-weight: 300;
                font-size: 20px;
            }
            `}</style>
            <div id={'activity_table'}>
                <Table
                    columns={columns}
                    dataSource={actions}
                    size='middle'
                    bordered={true}
                />
            </div>
        </div>;
    }
}
