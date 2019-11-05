import { I18N, I18NProps } from '../../utils/misc/i18n';
import * as React          from 'react';
import { Table }           from 'antd';

export interface EventUserListProps {
    event: any;
}

type EventUserListMergedProps = EventUserListProps & I18NProps;

class EventUserList extends React.Component<EventUserListMergedProps> {
    render(): React.ReactNode {

        const dataSource = this.props.event.attendees.map((attendee: any, idx: number) => {
            if (attendee.email) {
                return {
                    key: idx.toString(),
                    firstName: attendee.firstName,
                    lastName: attendee.lastName,
                    email: attendee.email,
                    ticket: attendee.ticket_number,
                    address: attendee.address
                };
            } else {

                return {
                    key: idx.toString(),
                    firstName: null,
                    lastName: null,
                    email: null,
                    ticket: attendee.ticket_number,
                    address: attendee.address
                };

            }
        });

        const columns = [
            {
                title: this.props.t('list_firstName'),
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: this.props.t('list_lastName'),
                dataIndex: 'lastName',
                key: 'lastName',
            },
            {
                title: this.props.t('list_email'),
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: this.props.t('list_ticketID'),
                dataIndex: 'ticket',
                key: 'ticket',
            },
            {
                title: this.props.t('list_address'),
                dataIndex: 'address',
                key: 'address',
            }
        ];

        return <div>
            <Table dataSource={dataSource} columns={columns} />;
        </div>;
    }
}

export default I18N.withNamespaces(['events'])(EventUserList) as React.ComponentType<EventUserListProps>;
