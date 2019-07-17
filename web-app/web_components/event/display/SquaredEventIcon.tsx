import * as React       from 'react';
import { Card }         from 'antd';
import { StrapiUpload } from '../../../utils/strapi/strapiupload';
import * as GeoPattern  from 'geopattern';
import { theme }        from '../../../utils/theme';

export interface SquaredEventIconProps {
    image: StrapiUpload;
    strapi_url: string;
    address: string;
}

export default class QuaredEventIcon extends React.Component<SquaredEventIconProps> {
    render(): React.ReactNode {

        const pattern = GeoPattern.generate(this.props.address, {color: theme.primary}).toDataUrl();

        return <div id={`squared_event_icon_${this.props.address}`}>
            <style>{`
                    #squared_event_icon_${this.props.address} .ant-card {
                        background-image: ${pattern}
                    }
                    
                    #squared_event_icon_${this.props.address} .ant-card-bordered {
                    }
                
            `}</style>
            <Card
                hoverable={false}
                bordered={false}
                style={{width: 230, height: 230, padding: 15, borderRadius: 8, float: 'left', marginLeft: 24, marginTop: -115}}
                cover={
                    this.props.image
                        ?
                        <img alt='icon' src={this.props.strapi_url + this.props.image.url} style={{width: 200, height: 200, borderRadius: 8}}/>
                        :
                        null
                }
            />
        </div>;
    }
}
