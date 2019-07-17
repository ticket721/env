import { StrapiUpload }   from '../../../utils/strapi/strapiupload';
import * as React         from 'react';
import { Carousel, Icon } from 'antd';
import { StrapiEvent }    from '../../../utils/strapi/event';
import { AppState }       from '../../../utils/redux/app_state';
import { connect }        from 'react-redux';
import { theme }          from '../../../utils/theme';

export interface EventCardBannerCarouselProps {
    event: StrapiEvent;
}

interface EventCardBannerCarouselRState {
    strapi_url: string;
}

type MergedEventCardBannerCarouselProps = EventCardBannerCarouselProps & EventCardBannerCarouselRState;

class EventCardBannerCarousel extends React.Component<MergedEventCardBannerCarouselProps> {
    render(): React.ReactNode {

        const carousel_content = this.props.event
            ?
            this.props.event.banners.map((banner: StrapiUpload, idx: number): React.ReactNode =>
                <div style={{backgroundColor: theme.dark0, height: '100%'}} key={idx}>
                    <img src={this.props.strapi_url + banner.url} style={{width: '100%', marginTop: '50%', transform: 'translateY(-100%)'}}/>
                </div>)

            :
            undefined;

        if (carousel_content && carousel_content.length === 0) {
            carousel_content.push(<div key={0}/>);
        }

        return <div id='event_carousel'>
            <style>{`
                    #event_carousel .ant-carousel .slick-slide {
                        text-align: center;
                        height: 160px;
                        line-height: 160px;
                        overflow: hidden;
                        border-top-right-radius: 6px;
                        border-top-left-radius: 6px;
                        background-color: ${theme.dark0};
                    }
                    
                    #event_carousel .ant-carousel .slick-slide h3 {
                        color: ${theme.white};
                    }
                `}</style>

            <Carousel autoplay={true} autoplaySpeed={5000}>
                {
                    carousel_content

                        ?
                        carousel_content

                        :
                        [
                            <div key={0} style={{height: '100%', width: '100%'}}>
                                <div style={{height: 160, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <Icon type='loading' style={{fontSize: 64, color: theme.dark7}} spin={true}/>
                                </div>
                            </div>
                        ]
                }
            </Carousel>
        </div>;
    }
}

const mapStateToProps = (state: AppState): EventCardBannerCarouselRState => ({
    strapi_url: state.app.config.strapi_endpoint
});

export default connect(mapStateToProps)(EventCardBannerCarousel);
