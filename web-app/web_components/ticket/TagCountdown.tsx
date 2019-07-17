import * as React from 'react';
import { theme }  from '../../utils/theme';

export interface TagCountdownProps {
    end: Date;
}

interface TagCountdownState {
    interval: any;
}

const HOUR = 60 * 60 * 1000;
const DAY = HOUR * 24;

export default class TagCountdown extends React.Component<TagCountdownProps, TagCountdownState> {
    state: TagCountdownState = {
        interval: null
    };

    componentDidMount(): void {
        if (this.state.interval === null) {
            this.setState({
                interval: setInterval((): void => {
                    this.setState({});
                }, 10000)
            });
        }
    }

    componentWillUnmount(): void {
        if (this.state.interval !== null) {
            clearInterval(this.state.interval);
        }
    }

    render(): React.ReactNode {

        const now = Date.now();
        const time = this.props.end.getTime();

        if (now >= time) {
            return null;
        }

        let content = '';

        if (time - now >= DAY) {
            content = `${Math.floor((time - now) / DAY)}d`;
        } else if (time - now >= HOUR) {
            content = `${Math.floor((time - now) / HOUR)}h ${Math.floor(((time - now) % HOUR) / (60 * 1000))}m`;
        } else {
            content = `${Math.floor((time - now) % HOUR / (60 * 1000))}m`;
        }

        return <span style={{color: theme.dark2}}>{content}</span>;
    }
}
