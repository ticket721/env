import { StrapiEvent }            from '../../../utils/strapi/event';
import * as React                 from 'react';
import { connect }                from 'react-redux';
import { AppState }               from '../../../utils/redux/app_state';
import { Card, Icon, Typography } from 'antd';
import * as GeoPattern            from 'geopattern';
import { theme }                  from '../../../utils/theme';

export interface EventCardIconProps {
    event: StrapiEvent;
}

interface EventCardIconRState {
    strapi_url: string;
}

type MergedEventCardProps = EventCardIconProps & EventCardIconRState;

class EventCardIcon extends React.Component<MergedEventCardProps> {
    render(): React.ReactNode {

        if (!this.props.event) {
            return <div>
                <style>{`
                    #loading_ticket_body .ant-card {
                        background-color: ${theme.dark5};
                        border: none; 
                    }
                    
                    #loading_ticket_body .ant-card-body {
                        background-color: ${theme.dark5};
                        padding: 0;
                        width: 100%;
                        height: 100%;
                    }
                `}</style>
                <div
                    id={`loading_ticket_body`}
                    style={{
                        float: 'left',
                        marginTop: -85,
                        marginLeft: 24
                    }}
                >
                    <Card
                        style={{
                            height: 170,
                            width: 170,
                            borderRadius: 7,
                            marginBottom: 24
                        }}
                    >
                        <div key={0} style={{height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.dark5}}>
                            <Icon type='loading' style={{fontSize: 64, color: theme.dark7}} spin={true}/>
                        </div>
                    </Card>
                </div>
            </div>;
        }

        return <div>
            <style>
                {`
                        #event_body_${this.props.event.address.address} .ant-card {
                            background-image: ${GeoPattern.generate(this.props.event.address.address, {color: theme.primary}).toDataUrl()};
                            border: none;
                        }
                    `}
            </style>
            <div
                id={`event_body_${this.props.event.address.address}`}
                style={{
                    float: 'left',
                    marginTop: -85,
                    marginLeft: 24
                }}
            >
                <Card
                    style={{
                        height: 170,
                        width: 170,
                        borderRadius: 7,
                        padding: 10,
                        marginBottom: 24
                    }}
                    cover={
                        this.props.event.image
                            ?
                            <img alt='icon' src={this.props.strapi_url + this.props.event.image.url} style={{width: 150, height: 150}}/>
                            :
                            null
                    }
                />
            </div>
            <div style={{float: 'left', marginLeft: 24, display: 'flex', alignItems: 'center', height: 85, overflow: 'hidden'}}>
            <Typography.Text style={{color: theme.white, fontSize: 30}}>{this.props.event.name}</Typography.Text>
            </div>
        </div>;
    }
}

const mapStateToProps = (state: AppState): EventCardIconRState => ({
    strapi_url: state.app.config.strapi_endpoint
});

export default connect(mapStateToProps)(EventCardIcon);
