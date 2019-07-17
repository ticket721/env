import * as React   from 'react';
import { theme }    from '../../../utils/theme';
import { Progress } from 'antd';

export interface EventCardProgressProps {
    progress: number;
}

type MergedEventCardProgressProps = EventCardProgressProps;

interface EventCardProgressState {
    loop: number;
}

export default class EventCardProgress extends React.Component<MergedEventCardProgressProps, EventCardProgressState> {

    state: EventCardProgressState = {
        loop: null
    };

    componentWillMount(): void {
        this.setState({
            loop: (setInterval(this.setState.bind(this), 5000) as any) as number
        });
    }

    componentWillUnmount(): void {
        if (this.state.loop !== null) {
            clearInterval(this.state.loop);
        }
        this.setState({
            loop: null
        });
    }

    render(): React.ReactNode {
        return <Progress
            style={{
                color: theme.white,
            }}
            strokeColor={theme.primary}
            strokeWidth={6}
            strokeLinecap='square'
            percent={this.props.progress}
            showInfo={false}
            status={'active'}
        />;
    }
}
