import * as React                from 'react';
import { StrapiQueuedEvent }     from '@utils/strapi/queuedevent';
import dynamic                   from 'next/dynamic';
import { BannersCarouselProps }  from '@web_components/event/display/BannersCarousel';
import { SquaredEventIconProps } from '@web_components/event/display/SquaredEventIcon';
import { Textfit }               from 'react-textfit';

// Dyanmic Components

const BannersCarousel: React.ComponentType<BannersCarouselProps> = dynamic<BannersCarouselProps>(async () => import('@web_components/event/display/BannersCarousel'), {
    loading: (): React.ReactNode => null
});

const SquaredEventIcon: React.ComponentType<SquaredEventIconProps> = dynamic<SquaredEventIconProps>(async () => import('@web_components/event/display/SquaredEventIcon'), {
    loading: (): React.ReactNode => null
});

// Props

export interface QueuedEventImagesProps {
    queued_event: StrapiQueuedEvent;
    strapi_url: string;
}

export default class QueuedEventImages extends React.Component<QueuedEventImagesProps> {
    render(): React.ReactNode {

        return <div id={`queued_event_images_${this.props.queued_event.address}`}>
            <div style={{marginTop: -24, marginLeft: -24, marginRight: -24}}>
                <BannersCarousel
                    banners={this.props.queued_event.banners}
                    strapi_url={this.props.strapi_url}
                    address={this.props.queued_event.address}
                />
            </div>
            <div style={{width: '110%', height: 125, marginLeft: -24}}>
                <SquaredEventIcon
                    image={this.props.queued_event.image}
                    strapi_url={this.props.strapi_url}
                    address={this.props.queued_event.address}
                />
                <div>
                    <div style={{width: '80%', marginLeft: 24 + 230 + 32, marginTop: 12}}>
                        <Textfit
                            mode='single'
                            max={48}
                            min={20}
                            forceSingleModeWidth={true}
                            style={{
                                fontWeigth: 300,
                            }}

                        >
                            {this.props.queued_event.name}
                        </Textfit>
                    </div>
                </div>
            </div>

        </div>;
    }
}
