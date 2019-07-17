import * as React        from 'react';
import { FullDiv }       from '@components/html/FullDiv';
import t721_auth_logo    from '@static/assets/ticket721/light.svg';
import dynamic           from 'next/dynamic';
import { Card, Divider } from 'antd';
import { theme }         from '../../utils/theme';
import { RGA }           from '../../utils/misc/ga';

// Dyanmic Components

const LoginViewForm: React.ComponentType<any> = dynamic<any>(async () => import('./LoginViewForm'), {
    loading: (): React.ReactElement => null
});

// Props

export interface LoginViewProps {
    switch: () => void;
}

/**
 * Login Form
 */
export default class LoginView extends React.Component<LoginViewProps> {

    componentDidMount(): void {
        RGA.pageview('/login');
    }

    render(): React.ReactNode {
        return <FullDiv style={{padding: '2%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Card
                style={{
                    padding: 48,
                    paddingBottom: 0,
                    borderRadius: 6,
                    backgroundColor: theme.dark0,
                    boxShadow: '0 3px 5px rgba(0,0,0,0.16)'
                }}
            >
                <div>
                    <img
                        src={t721_auth_logo}
                        style={{
                            height: 'auto',
                            width: '100%',
                            marginBottom: 24
                        }}
                    />
                    <Divider style={{backgroundColor: theme.dark3}}/>
                    <LoginViewForm switch={this.props.switch}/>
                </div>
            </Card>
        </FullDiv>;
    }
}
