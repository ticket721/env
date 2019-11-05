import { StrapiEvent }           from '@utils/strapi/event';
import * as React                from 'react';
import { Button }                from 'antd';
import { BannersCarouselProps }  from '@web_components/event/display/BannersCarousel';
import { SquaredEventIconProps } from '@web_components/event/display/SquaredEventIcon';
import dynamic                   from 'next/dynamic';
import { I18N, I18NProps }       from '@utils/misc/i18n';
import { message }               from 'antd';
import UrlParse                  from 'url-parse';
import { Textfit }               from 'react-textfit';
import { RGA }                   from '../../utils/misc/ga';

const ButtonGroup = Button.Group;

// Dynamic Components

const BannersCarousel: React.ComponentType<BannersCarouselProps> = dynamic<BannersCarouselProps>(async () => import('@web_components/event/display/BannersCarousel'), {
    loading: (): React.ReactNode => null
});

const SquaredEventIcon: React.ComponentType<SquaredEventIconProps> = dynamic<SquaredEventIconProps>(async () => import('@web_components/event/display/SquaredEventIcon'), {
    loading: (): React.ReactNode => null
});

// Props

export interface EventImagesProps {
    event: StrapiEvent;
    user_address: string;
    strapi_url: string;
    edit_trigger: () => void;
    list_trigger: () => void;
}

type MergedEventImagesProps = EventImagesProps & I18NProps;

class EventImages extends React.Component<MergedEventImagesProps> {

    on_share = (): void => {
        const url = new UrlParse(window.location.href);
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url.origin + '/event/' + this.props.event.address.address);
            message.config({
                top: 10,
                duration: 2,
                maxCount: 3,
            });
            message.success(this.props.t('copied_to_clipboard'));
            RGA.event({category: 'User', action: 'Share Button'});
        }
    }

    render(): React.ReactNode {
        return <div id={`queued_event_images_${this.props.event.address.address}`}>
            <div style={{marginTop: -24, marginLeft: -24, marginRight: -24}}>
                <BannersCarousel
                    banners={this.props.event.banners}
                    strapi_url={this.props.strapi_url}
                    address={this.props.event.address.address}
                />
            </div>
            <div style={{width: '110%', height: 125, marginLeft: -24}}>
                <SquaredEventIcon
                    image={this.props.event.image}
                    strapi_url={this.props.strapi_url}
                    address={this.props.event.address.address}
                />
                <div>
                    <div style={{width: '60%', marginLeft: 24 + 230 + 32, marginTop: 12}}>
                        <Textfit
                            mode='single'
                            max={48}
                            min={20}
                            forceSingleModeWidth={true}
                            style={{
                                fontWeigth: 300,
                            }}

                        >
                            {this.props.event.name}
                        </Textfit>
                    </div>
                    <ButtonGroup style={{marginLeft: 42, marginTop: 12}}>
                        <Button icon='upload' onClick={this.on_share}>{this.props.t('share_button')}</Button>
                        {
                            this.props.user_address && this.props.event.owner.address === this.props.user_address
                                ?
                                <>
                                    <Button icon='edit' onClick={this.props.edit_trigger}>{this.props.t('edit_button')}</Button>
                                    <Button icon='unordered-list' onClick={this.props.list_trigger}>{this.props.t('list_button')}</Button>
                                </>
                                :
                                null
                        }
                    </ButtonGroup>
                </div>
            </div>

        </div>;

    }
}

export default I18N.withNamespaces(['events'])(EventImages) as React.ComponentType<EventImagesProps>;
