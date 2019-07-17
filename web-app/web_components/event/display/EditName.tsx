import * as React                           from 'react';
import { StrapiEvent }                      from '../../../utils/strapi/event';
import { I18N, I18NProps }                  from '../../../utils/misc/i18n';
import { Icon, Input, Tooltip, Typography } from 'antd';
import { theme }                            from '../../../utils/theme';

export interface EditNameProps {
    event: StrapiEvent;
    on_change: (new_name: string) => void;
}

type MergedEditNameProps = EditNameProps & I18NProps;

interface EditNameState {
    value: string;
}

class EditName extends React.Component<MergedEditNameProps> {

    state: EditNameState;

    constructor(props: MergedEditNameProps) {
        super(props);

        this.state = {
            value: props.event.name
        };
    }

    on_change = (event: any): void => {

        let value = event.target.value;

        this.setState({
            value
        });

        if (value === this.props.event.name) {
            value = undefined;
        }

        this.props.on_change(value);
    }

    render(): React.ReactNode {
        return <div id={'edit-name'}>
            <Typography.Text style={{fontSize: 22, color: theme.dark2}}>{this.props.t('edit_name_title')}</Typography.Text>
            <style>{`
                #edit-name .edited-input {
                    border: 1px solid ${theme.gold};
                    border-radius: 5px;
                }
                
                #edit-name .unedited-input {
                    border: 1px solid transparent;
                    border-radius: 5px;
                }
            `}</style>
            <Input
                className={this.state.value !== this.props.event.name ? 'edited-input' : 'unedited-input'}
                suffix={
                    this.state.value !== this.props.event.name
                        ?
                        <Tooltip title={this.props.t('edit_name_edit_warning')}>
                            <Icon type='save' style={{ color: theme.gold }} />
                        </Tooltip>
                        :
                        <span/>
                }
                style={{marginTop: 12}}
                value={this.state.value}
                onChange={this.on_change}
            />
        </div>;

    }
}

export default I18N.withNamespaces(['events'])(EditName) as React.ComponentType<EditNameProps>;
