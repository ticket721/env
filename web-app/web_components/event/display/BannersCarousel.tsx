import * as React       from 'react';
import { Carousel }     from 'antd';
import { StrapiUpload } from '@utils/strapi/strapiupload';
import { theme }        from '../../../utils/theme';

export interface BannersCarouselProps {
    banners: StrapiUpload[];
    strapi_url: string;
    address: string;
}

export default class BannersCarousel extends React.Component<BannersCarouselProps> {
    render(): React.ReactNode {

        const banners = this.props.banners && this.props.banners.length
            ?
            this.props.banners.map((elem: StrapiUpload, idx: number): React.ReactNode =>
                <div key={idx}>
                    <img style={{width: '1200px',  margin: 'auto', verticalAlign: 'middle'}} src={this.props.strapi_url + elem.url} />
                </div>)
            :
            [
                <div key={0}/>
            ];

        return <div id={`banners_carousel_${this.props.address}`}>
            <style>{`
            
                    #banners_carousel_${this.props.address} .ant-carousel {
                        width: 100%;
                    }
                    
                    #banners_carousel_${this.props.address} .ant-carousel .slick-slide {
                        display: flex;
                        align-items: center; 
                        justify-content: center;
                        text-align: center;
                        height: 400px;
                        background: ${theme.dark0};
                        overflow: hidden;
                    }

                    #banners_carousel_${this.props.address} .ant-carousel .slick-slide h3 {
                        color: ${theme.white};
                    }
                    
                    #banners_carousel_${this.props.address} .ant-carousel .slick-dots li button {
                        background-color: ${theme.primary};
                    }
            
            `}</style>
            <Carousel
                autoplay={true}
            >
                {banners}
            </Carousel>
        </div>;
    }
}
