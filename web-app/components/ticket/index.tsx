import * as React           from 'react';
import { routes }           from '@utils/routing';
import { Spin, Typography } from 'antd';
import { I18N, I18NProps }  from '../../utils/misc/i18n';

export interface TicketProps {
    ticket: number;
    size: number;
    color?: string;
}

type MergedTicketProps = TicketProps & I18NProps;

class Ticket extends React.Component<MergedTicketProps> {
    render(): React.ReactNode {
        if (this.props.ticket === null || this.props.ticket === undefined) {
            return <Spin/>;
        }

        return <routes.Link route={'ticket'} params={{id: this.props.ticket}}>
            <Typography.Text style={{fontSize: this.props.size, cursor: 'pointer', color: this.props.color}}>
                {this.props.t('ticket')} #{this.props.ticket}
            </Typography.Text>
        </routes.Link>;

    }
}

export default I18N.withNamespaces(['entities'])(Ticket) as React.ComponentType<TicketProps>;
