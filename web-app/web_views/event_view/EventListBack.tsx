import { I18N, I18NProps } from '../../utils/misc/i18n';
import * as React          from 'react';
import { Button }          from 'antd';

export interface EventListBackProps {
    cancel: () => void;
}

type MergedEventListBackProps = EventListBackProps & I18NProps;

class EventListBack extends React.Component<MergedEventListBackProps> {
    render(): React.ReactNode {
        return <div style={{width: '50%'}}>
            <Button type='primary' onClick={this.props.cancel}>{this.props.t('event_list_cancel_button')}</Button>
        </div>;
    }
}

export default I18N.withNamespaces(['events'])(EventListBack) as React.ComponentType<EventListBackProps>;
