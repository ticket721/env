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
                justifyContent: 'center',
                flexDirection: 'column'
            }}
        >
            <img src={image} style={{width: '35%'}}/>
            <Typography.Text style={{fontSize: 25, color: theme.primary, marginTop: 24}}>{this.props.t('support_coming_soon')}</Typography.Text>
            <img src={cone} style={{width: '75px', marginTop: 24}}/>

        </div>;
    }
}

export const SupportComingSoon = I18N.withNamespaces(['messages'])(SupportComingSoonContainer);
