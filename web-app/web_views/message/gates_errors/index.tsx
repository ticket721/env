import * as React             from 'react';
import { Typography }         from 'antd';
import image                  from './image.svg';
import { NamespacesConsumer } from 'react-i18next';
import { theme }              from '../../../utils/theme';
import { RGA }                from '../../../utils/misc/ga';
import { withCookies, Cookies, ReactCookieProps } from 'react-cookie';

// Props

export interface GatesErrorsProps {
    message: string;
}

class GatesErrorsContainer extends React.Component<GatesErrorsProps & ReactCookieProps> {

    componentDidMount(): void {
        RGA.pageview('/gate/' + this.props.message);

        if (this.props.cookies) {
            const cookies = this.props.cookies;
            cookies.remove('jwt');
        }

        if (this.props.message === 'app_cannot_reach_server') {
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }

    }

    render(): React.ReactNode {
        console.log('gate');
        console.log(this.props.message);
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
                <img src={image} style={{width: '50px', marginBottom: '75px'}}/>
                <br/>
                <NamespacesConsumer
                    ns={['messages']}
                >
                    {(t: any): React.ReactNode =>
                        <div>
                            <Typography.Text style={{fontSize: 28, fontWeight: 500, color: theme.primary}}>{t('error')}</Typography.Text>
                            <Typography.Text
                                style={{fontSize: 28, marginLeft: 24, color: theme.dark2}}
                            >
                                {t(this.props.message)}
                            </Typography.Text>
                        </div>

                    }
                </NamespacesConsumer>
            </div>

        </div>;
    }
}

export const GatesErrors =  withCookies(GatesErrorsContainer);
