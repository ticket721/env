import * as React from 'react';
import Lottie     from 'react-lottie';
import BarLoader  from './animations/rocket.json';
import UploadLoader from './animations/upload.json';
import SuccessLoader from './animations/firework.json';
import ErrorLoader from './animations/error.json';

interface DeployLoaderProps {
    is_paused: boolean;
    progress: number;
    type: string;
}

const options = {
    loop: true,
    autoplay: false,
    animationData: null,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export class DeployLoader extends React.Component<DeployLoaderProps> {

    constructor(props: DeployLoaderProps) {
        super(props);
    }

    render(): React.ReactNode {

        if (this.props.type === 'except') {

            options.animationData = ErrorLoader;

        } else {

            if (this.props.progress < 90) {
                options.animationData = BarLoader;
            } else if (this.props.progress < 100) {
                options.animationData = UploadLoader;
            } else if (this.props.progress === 100) {
                options.animationData = SuccessLoader;
            }

        }

        return (
            <div>

                <Lottie
                    options={options}
                    width={400}
                    height={400}
                    isPaused={this.props.is_paused}
                />

            </div>
        );
    }

}
