import * as React     from 'react';
import { I18N }       from '@utils/misc/i18n';
import { Typography } from 'antd';
import image          from '@static/assets/ticket721/dark.svg';
import cone           from './cone.svg';
import { theme }      from '../../../utils/theme';

// Props

export interface SupportComingSoonProps {
    t: any;
}

class SupportComingSoonContainer extends React.Component<SupportComingSoonProps> {
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
                <img src={image} style={{width: '35%', marginBottom: '75px'}}/>
                <br/>
                <Typography.Text style={{fontSize: 25, marginLeft: 24, color: theme.primary}}>{this.props.t('support_coming_soon')}</Typography.Text>
                <br/>
                <img src={cone} style={{width: '75px', marginTop: '75px'}}/>
            </div>

        </div>;
    }
}

export const SupportComingSoon = I18N.withNamespaces(['messages'])(SupportComingSoonContainer);
