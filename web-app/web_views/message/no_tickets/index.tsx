import * as React     from 'react';
import { I18N }       from '@utils/misc/i18n';
import { Typography } from 'antd';
import image          from './image.svg';
import { theme }      from '../../../utils/theme';

// Props

export interface NoTicketsProps {
    t: any;
}

class NoTicketsContainer extends React.Component<NoTicketsProps> {
    render(): React.ReactNode {
        return <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div style={{textAlign: 'center'}}>
                <img src={image} style={{width: '75px', marginBottom: '75px'}}/>
                <br/>
                <Typography.Text style={{fontSize: 28, marginLeft: 24, color: theme.primary}}>{this.props.t('no_tickets')}</Typography.Text>
            </div>

        </div>;
    }
}

export const NoTickets = I18N.withNamespaces(['messages'])(NoTicketsContainer);
