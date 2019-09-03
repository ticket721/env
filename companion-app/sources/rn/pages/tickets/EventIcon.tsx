import * as React                           from 'react';
import { Event }                            from '../../../redux/state';
import { generate }                         from 'geopattern';
import { ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import { themeResolver }                    from '../../utils/themeResolver';
import { View, Image, ActivityIndicator }   from 'react-native';
import { Image as CacheImage }              from '../../../redux/state';
import placeholder from './placeholder';

export interface EventIconProps {
    event: Event;
    width: number;
    height: number;
    strapi_url: string;
    images: {
        [key: string]: {
            sources: CacheImage;
            loading: boolean;
        }
    };
}

type EventIconMergedProps = EventIconProps & ThemedComponentProps;

class EventIcon extends React.Component<EventIconMergedProps> {
    render(): React.ReactNode {

        const pattern = generate(this.props.event.address.address, {
            color: themeResolver('color-basic-700', this.props.theme),
            generator: 'plaid'
        }).toDataUri();

        let image = null;

        if (this.props.event.image) {
            if (this.props.images[this.props.event.image.hash]) {
                if (this.props.images[this.props.event.image.hash].loading) {
                    image = <View
                        style={{
                            width: this.props.width - 20,
                            height: this.props.height - 20,
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: themeResolver('color-basic-900', this.props.theme)
                        }}
                    >
                        <ActivityIndicator size='small' color={themeResolver('color-basic-100', this.props.theme)}/>

                    </View>;
                } else {
                    image = <Image
                        style={{
                            position: 'absolute',
                            borderRadius: 6
                        }}
                        width={this.props.width - 20}
                        height={this.props.height - 20}
                        source={{uri: this.props.images[this.props.event.image.hash].sources.uri_source}}
                    />;
                }
            }

        }

        return <View style={{width: this.props.width - 20, height: this.props.height - 20, marginLeft: 10, marginTop: 10, borderRadius: 6, overflow: 'hidden'}}>
            {
                image
                ||
                <View
                    style={{
                        width: this.props.width - 20,
                        height: this.props.height - 20,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: themeResolver('color-basic-900', this.props.theme)
                    }}
                >
                    <Image
                        style={{
                            position: 'absolute',
                            borderRadius: 6
                        }}
                        width={this.props.width - 60}
                        height={this.props.height - 60}
                        source={{uri: placeholder}}
                    />
                </View>
            }
        </View>;

    }
}

export default withStyles(EventIcon) as React.ComponentType<EventIconProps>;
