import * as React                           from 'react';
import { StrapiEvent }                      from '../../../utils/strapi/event';
import { I18N, I18NProps }                  from '../../../utils/misc/i18n';
import { Typography } from 'antd';
import { theme }                            from '../../../utils/theme';
import Geosuggest                                  from 'react-geosuggest';

export interface EditLocationProps {
    event: StrapiEvent;
    on_change: (new_loc: any) => void;
}

type MergedEditLocationProps = EditLocationProps & I18NProps;

interface EditLocationState {
    value: string;
    suggests: any[];
    selected: boolean;
}

class EditLocation extends React.Component<MergedEditLocationProps> {

    state: EditLocationState;

    _geoSuggest: any;

    constructor(props: MergedEditLocationProps) {
        super(props);

        this.state = {
            value: props.event.location ? props.event.location.label : undefined,
            suggests: [],
            selected: false
        };
    }

    update_suggests = (suggests: any[], selection: any): void => {
        this.setState({
            suggests: suggests
        });
    }

    manual_select = (item: any): void => {
        if (item) {

            let value = item.label;

            this.setState({
                value,
                suggests: []
            });

            if (this.props.event.location && value === this.props.event.location.label) {
                value = undefined;
            }

            this.props.on_change({
                label: value,
                location: item.location
            });

        }
    }

    on_change = (): void => {

        if (this.state.selected) {
            this.setState({
                selected: false
            });
        }

    }

    set_ref = (ref: any): void => {
        this._geoSuggest = ref;
    }

    render(): React.ReactNode {

        const edited = (!this.props.event.location && this.state.value)
            ||
            (this.props.event.location && this.state.value !== this.props.event.location.label);

        return <div id={'edit-location'}>
            <Typography.Text style={{fontSize: 22, color: theme.dark2}}>{this.props.t('edit_location_title')}</Typography.Text>
            <style>{`
                #edit-location .edited-input {
                    border: 1px solid ${theme.gold};
                    border-radius: 5px;
                }
                
                #edit-location .unedited-input {
                    border: 1px solid transparent;
                    border-radius: 5px;
                }
            `}</style>
            <div id='gmaps_suggest'>
                <style>{`
                #gmaps_suggest .ant-list-item:hover {
                    background-color: ${theme.gmaps_suggest};
                    cursor: pointer;
                }
            `}</style>
                <Geosuggest
                    ref={this.set_ref}
                    inputClassName='ant-input'
                    suggestsClassName='ant-list ant-list-sm ant-list-split ant-list-bordered'
                    suggestItemClassName='ant-list-item'
                    style={{
                        input: {
                            marginTop: 12,
                            border: edited ? `1px solid ${theme.gold}` : `1px solid ${theme.inputgrey}`,
                            borderRadius: 5
                        },
                        suggests: {
                            display: this.state.suggests.length > 0 ? undefined : 'none',
                            marginTop: 12,
                            width: '50%'
                        },
                    }}
                    onUpdateSuggests={this.update_suggests}
                    onSuggestSelect={this.manual_select}
                    onChange={this.on_change}
                    initialValue={this.state.value}
                />
            </div>
        </div>;

    }
}

export default I18N.withNamespaces(['events'])(EditLocation) as React.ComponentType<EditLocationProps>;
