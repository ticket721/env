import { I18N, I18NProps } from '../../../utils/misc/i18n';
import * as React          from 'react';
import { Button }          from 'antd';

export interface QueuedEventEditCancelProps {
    cancel: () => void;
}

type MergedQueuedEventEditCancelProps = QueuedEventEditCancelProps & I18NProps;

class QueuedQueuedEventEditCancel extends React.Component<MergedQueuedEventEditCancelProps> {
    render(): React.ReactNode {
        return <div style={{width: '50%'}}>
            <Button type='primary' onClick={this.props.cancel}>{this.props.t('event_edit_cancel_button')}</Button>
        </div>;
    }
}

export default I18N.withNamespaces(['events'])(QueuedQueuedEventEditCancel) as React.ComponentType<QueuedEventEditCancelProps>;
