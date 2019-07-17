import { I18N, I18NProps } from '../../utils/misc/i18n';
import * as React          from 'react';
import { Button }          from 'antd';

export interface EventEditCancelProps {
    cancel: () => void;
}

type MergedEventEditCancelProps = EventEditCancelProps & I18NProps;

class EventEditCancel extends React.Component<MergedEventEditCancelProps> {
    render(): React.ReactNode {
        return <div style={{width: '50%'}}>
            <Button type='primary' onClick={this.props.cancel}>{this.props.t('event_edit_cancel_button')}</Button>
        </div>;
    }
}

export default I18N.withNamespaces(['events'])(EventEditCancel) as React.ComponentType<EventEditCancelProps>;
