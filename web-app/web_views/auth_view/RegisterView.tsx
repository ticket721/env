import * as React        from 'react';
import { FullDiv }       from '@components/html/FullDiv';
import t721_auth_logo    from '@static/assets/ticket721/dark.svg';
import dynamic           from 'next/dynamic';
import { Card, Divider } from 'antd';
import { theme }         from '../../utils/theme';
import { RGA }           from '../../utils/misc/ga';

// Dynamic Components

const RegisterViewForm = dynamic<any>(async () => import('./RegisterViewForm'), {
    loading: (): React.ReactElement => null
});

// Props

export interface RegisterViewProps {
    switch: () => void;
}

/**
 * Register Form
 */
export default class RegisterView extends React.Component<RegisterViewProps> {
    componentDidMount(): void {
        RGA.pageview('/register');
    }

    render(): React.ReactNode {
        return <FullDiv style={{padding: '2%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div>
                        <Card
                            style={{
                                padding: 48,
                                paddingBottom: 0,
                                borderRadius: 6,
                                boxShadow: '0 3px 5px rgba(0,0,0,0.16)',
                                backgroundColor: theme.white
                            }}
                        >
                            <img
                                src={t721_auth_logo}
                                style={{
                                    height: 'auto',
                                    width: '100%',
                                    marginBottom: 24
                                }}
                            />
                            <Divider/>
                            <RegisterViewForm switch={this.props.switch}/>
                        </Card>
                    </div>
        </FullDiv>;
    }
}
