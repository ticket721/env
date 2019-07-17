import * as React                 from 'react';
import { Icon, Spin, Typography } from 'antd';
import { I18N, I18NProps }        from '../../../utils/misc/i18n';
import { theme }                  from '../../../utils/theme';
import { RGA }                    from '../../../utils/misc/ga';

export interface QueuedEventWarningProps {
    edit: () => void;
    start: () => void;
}

type MergedQueuedEventWarningProps = QueuedEventWarningProps & I18NProps;

interface QueuedEventWarningState {
    started: boolean;
}

class QueuedEventWarning extends React.Component<MergedQueuedEventWarningProps, QueuedEventWarningState> {

    state: QueuedEventWarningState = {
        started: false
    };

    on_start = (): void => {
        this.props.start();
        RGA.event({
            category: 'Tx - Event Start',
            action: 'Broadcast'
        });
        this.setState({
            started: true
        });
    }

    render(): React.ReactNode  {

        if (this.state.started) {
            return <div style={{width: '110%', height: 52, backgroundColor: theme.queuedevent_warning, marginLeft: -24, marginTop: -24, marginBottom: 24, padding: 8, fontSize: 24, textAlign: 'center'}}>
                <Spin/>
            </div>;
        }

        return <div style={{width: '110%', height: 52, backgroundColor: theme.queuedevent_warning, marginLeft: -24, marginTop: -24, marginBottom: 24, padding: 8, fontSize: 24, textAlign: 'center'}}>
            <Icon type='warning'/>
            <Typography.Text
                style={{fontSize: 24, marginLeft: 24, color: theme.dark2}}
            >
                {this.props.t('preview_warning_message_1')}
                <span
                    style={{textDecoration: 'underline', cursor: 'pointer'}}
                    onClick={this.props.edit}
                >
                    {this.props.t('preview_warning_message_2')}
                </span>{this.props.t('preview_warning_message_3')}
                <span
                    style={{textDecoration: 'underline', cursor: 'pointer'}}
                    onClick={this.on_start}
                >
                    {this.props.t('preview_warning_message_4')}
                </span>
                {this.props.t('preview_warning_message_5')}
            </Typography.Text>
        </div>;
    }
}

export default I18N.withNamespaces(['events'])(QueuedEventWarning);
