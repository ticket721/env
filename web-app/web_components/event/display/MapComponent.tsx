import * as React                  from 'react';
import { Map, InfoWindow, Marker } from 'google-maps-react';
import { Icon, Typography }        from 'antd';
import styles                      from './MapStyles.json';
import { theme }                   from '../../../utils/theme';

export interface MapComponentProps {
    location: any;
}

interface MapComponentState {
    marker: any;
}

export default class MapComponent extends React.Component<MapComponentProps, MapComponentState> {

    state: MapComponentState = {
        marker: undefined
    };

    on_click = (props: any, marker: any): void => {
        this.setState({
            marker: this.state.marker === undefined ? marker : undefined
        });
    }

    on_close = (): void => {
        this.setState({
            marker: undefined
        });
    }

    render(): React.ReactNode {
        return <Map
            google={(window as any).google}
            styles={styles}
            zoom={16}
            initialCenter={this.props.location.location}
        >

            <Marker
                title={this.props.location.label}
                name={'Event Location'}
                onClick={this.on_click}
                position={this.props.location.location}
            />

            <InfoWindow
                visible={this.state.marker !== undefined}
                marker={this.state.marker}
                onClose={this.on_close}
            >
                <div style={{padding: 12}}>
                    <style>{`
                #tooltip_label:hover {
                    color: ${theme.primary};
                }
                `}</style>
                    <a href={'https://maps.google.com/?q=' + encodeURIComponent(this.props.location.label)} target='_blank'>
                        <Icon type={'link'} style={{fontSize: 18, marginRight: 12}}/>
                        <Typography.Text style={{fontSize: 22}} id='tooltip_label'>
                            {this.props.location.label}
                        </Typography.Text>
                    </a>
                </div>
            </InfoWindow>
        </Map>;
    }
}
