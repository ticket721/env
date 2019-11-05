import * as React                           from 'react';
import { Event }                            from '../../redux/state';
import { ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import { themeResolver }                    from '../utils/themeResolver';
import { View, Image, ActivityIndicator }   from 'react-native';
import { Image as CacheImage }              from '../../redux/state';
import placeholder                          from './placeholder';

export interface EventIconProps {
    event: Event;
    width: number;
    height: number;
    strapi_url: string;
    image: {
        sources: CacheImage;
        loading: boolean;
    };
}

type EventIconMergedProps = EventIconProps & ThemedComponentProps;

class EventIcon extends React.Component<EventIconMergedProps> {
    render(): React.ReactNode {

        let image = null;

        if (this.props.event.image) {
            if (this.props.image) {
                if (this.props.image.loading) {
                    image = <View
                        style={{
                            width: this.props.width,
                            height: this.props.height,
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
                        width={this.props.width}
                        height={this.props.height}
                        source={{uri: this.props.image.sources.uri_source}}
                    />;
                }
            }

        }

        return <View
                style={{
                    width: this.props.width,
                    height: this.props.height,
                    overflow: 'hidden'
                }}
        >
            {
                image
                ||
                <View
                    style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: themeResolver('color-basic-800', this.props.theme),
                        borderRadius: 6
                    }}
                >
                    <Image
                        style={{
                            position: 'absolute',
                        }}
                        width={this.props.width - 40}
                        height={this.props.height - 40}
                        source={{uri: placeholder}}
                    />
                </View>
            }
        </View>;

    }
}

export default withStyles(EventIcon) as React.ComponentType<EventIconProps>;
