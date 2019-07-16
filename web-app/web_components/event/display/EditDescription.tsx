import * as React                           from 'react';
import { StrapiEvent }                      from '../../../utils/strapi/event';
import { I18N, I18NProps }                  from '../../../utils/misc/i18n';
import { Input, Typography } from 'antd';
import { theme }                            from '../../../utils/theme';

export interface EditDescriptionProps {
    event: StrapiEvent;
    on_change: (new_name: string) => void;
}

type MergedEditDescriptionProps = EditDescriptionProps & I18NProps;

interface EditDescriptionState {
    value: string;
}

class EditDescription extends React.Component<MergedEditDescriptionProps> {

    state: EditDescriptionState;

    constructor(props: MergedEditDescriptionProps) {
        super(props);

        this.state = {
            value: props.event.description
        };
    }

    on_change = (event: any): void => {

        let value = event.target.value;

        this.setState({
            value
        });

        if (value === this.props.event.description) {
            value = undefined;
        }

        this.props.on_change(value);
    }

    render(): React.ReactNode {
        return <div id='edit-description'>
            <Typography.Text style={{fontSize: 22, color: theme.dark2}}>{this.props.t('edit_description_title')}</Typography.Text>
            <style>{`
                #edit-description .edited-input {
                    border: 1px solid ${theme.gold};
                    border-radius: 5px;
                }
                
                #edit-description .unedited-input {
                    border: 1px solid ${theme.inputgrey};
                    border-radius: 5px;
                }
            `}</style>
            <Input.TextArea
                className={this.state.value !== this.props.event.description ? 'edited-input' : 'unedited-input'}
                style={{marginTop: 12}}
                value={this.state.value}
                onChange={this.on_change}
            />
        </div>;

    }
}

export default I18N.withNamespaces(['events'])(EditDescription) as React.ComponentType<EditDescriptionProps>;
