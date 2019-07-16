import * as React     from 'react';
import { I18N }       from '@utils/misc/i18n';
import { Typography } from 'antd';
import image          from './image.svg';
import { theme }      from '../../../utils/theme';

// Props

export interface NoMarketerControllerProps {
    t: any;
}

class NoMarketerControllerContainer extends React.Component<NoMarketerControllerProps> {
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
                <Typography.Text style={{fontSize: 28, marginLeft: 24, color: theme.primary}}>{this.props.t('no_marketer_controller')}</Typography.Text>
            </div>

        </div>;
    }
}

export const NoMarketerController = I18N.withNamespaces(['tickets'])(NoMarketerControllerContainer);
