import * as React             from 'react';
import { Typography }         from 'antd';
import Lottie                 from 'react-lottie';
import BarLoader              from './animations/bar_loader.json';
import { NamespacesConsumer } from 'react-i18next';
import { theme }              from '../../utils/theme';

interface FullPageLoaderProps {
    message?: string;
}

const options = {
    loop: true,
    autoplay: true,
    animationData: BarLoader,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export class FullPageLoader extends React.Component<FullPageLoaderProps> {

    constructor(props: FullPageLoaderProps) {
        super(props);
    }

    render(): React.ReactNode {
        return (
            <div style={{textAlign: 'center'}}>

                <Lottie
                    options={options}
                    width={400}
                    height={400}
                />
                {this.props.message
                    ?
                    <NamespacesConsumer ns={['messages']}>
                        {
                            (t: any): React.ReactNode =>
                                <Typography.Text style={{fontSize: 32, color: theme.primary}}>{t(this.props.message)}</Typography.Text>
                        }
                    </NamespacesConsumer>
                    :
                    null
                }

            </div>
        );
    }

}
