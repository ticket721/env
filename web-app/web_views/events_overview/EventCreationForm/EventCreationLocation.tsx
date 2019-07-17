import { theme } from '../../../utils/theme';

declare global {
    const google: any;
}

import * as React                                  from 'react';
import Geosuggest                                  from 'react-geosuggest';
import { EventCreationData, EventCreationSetData } from './EventCreationData';
import { Typography }                              from 'antd';

// Props

export interface EventCreationLocationProps {
    set_data: EventCreationSetData;
    form_data: EventCreationData;
    t: any;
}

interface EventCreationLocationState {
    suggests: any[];
    selected: boolean;
}

export default class EventCreationLocation extends React.Component<EventCreationLocationProps, EventCreationLocationState> {

    _geoSuggest: any;

    state: EventCreationLocationState = {
        suggests: [],
        selected: false
    };

    set_ref = (ref: any): void => {
        this._geoSuggest = ref;
    }

    update_suggests = (suggests: any[], selection: any): void => {
        this.setState({
            suggests: suggests
        });
    }

    manual_select = (item: any): void => {
        if (item) {
            this.props.set_data('location', {
                label: item.label,
                location: item.location
            });
            this.setState({
                selected: true,
                suggests: []
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

    render(): React.ReactNode {
        return <div id='gmaps_suggest'>
            <style>{`
                #gmaps_suggest .ant-list-item:hover {
                    background-color: ${theme.gmaps_suggest};
                    cursor: pointer;
                }
            `}</style>
            <br/>
            <Typography.Text style={{fontSize: 32, color: theme.dark2}}>{this.props.t('location_title')}</Typography.Text>
            <br/>
            <br/>
            <div style={{marginLeft: 10}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark3}}>{this.props.t('location_description')}</Typography.Text>
                <br/>
                <br/>
                <Geosuggest
                    ref={this.set_ref}
                    inputClassName='ant-input'
                    suggestsClassName='ant-list ant-list-sm ant-list-split ant-list-bordered'
                    suggestItemClassName='ant-list-item'
                    style={{
                        input: {
                            width: '50%'
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
                    initialValue={this.props.form_data.location ? this.props.form_data.location.label : undefined}
                />
            </div>
        </div>;
    }
}
