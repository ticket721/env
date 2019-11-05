import * as React                                                 from 'react';
import { View, Image, ActivityIndicator }                         from 'react-native';
import { ThemedComponentProps, withStyles }                       from 'react-native-ui-kitten';
import { Event, Image as CacheImage }                             from '../../../../redux/state';
import EventIcon                                                  from '../../../components/EventIcon';
import { screenWidth }                                            from '../../../utils/screenDimensions';
import { themeResolver }                                          from '../../../utils/themeResolver';
import placeholder                                                from '../../../components/placeholder';

export interface EventMediaProps {
    event: Event;
    strapi_url: string;
    image: {
        sources: CacheImage;
        loading: boolean;
    };
    banners: {
        [key: string]: {
            sources: CacheImage;
            loading: boolean;
        }
    };
}

export type EventMediaMergedProps =
    EventMediaProps
    & ThemedComponentProps;

class EventMedia extends React.Component<EventMediaMergedProps> {

    private renderBanners(): React.ReactChild {
        if (this.props.event.banners.length > 0) {
            if (this.props.banners[this.props.event.banners[0].hash] !== undefined) {
                if (this.props.banners[this.props.event.banners[0].hash].sources !== null) {
                    return <Image
                        style={{
                            position: 'absolute'
                        }}
                        width={screenWidth()}
                        height={170}
                        source={{uri: this.props.banners[this.props.event.banners[0].hash].sources.uri_source}}
                    />;
                }
            }
            return <ActivityIndicator
                size='small'
                color={themeResolver('color-basic-100', this.props.theme)}
            />;
        } else {
            return <Image
                style={{
                    position: 'absolute',
                    alignSelf: 'center'
                }}
                width={150}
                height={150}
                source={{uri: placeholder}}
            />;
        }
    }

    render(): React.ReactNode {
        return <View>
            <View
                style={{
                    position: 'absolute',
                    left: 10,
                    top: 115,
                    zIndex: 1,
                    shadowRadius: 6,
                    shadowColor: 'black',
                    shadowOpacity: 0.2,
                }}
            >
                <EventIcon
                    event={this.props.event}
                    width={130}
                    height={130}
                    strapi_url={this.props.strapi_url}
                    image={this.props.image}
                />
            </View>
            <View
                style={{
                    width: '100%',
                    height: 170,
                    backgroundColor: '#222',
                    justifyContent: 'center'
                }}
            >
                {this.renderBanners()}
            </View>
        </View>;
    }
}

export default withStyles(
    EventMedia
);
