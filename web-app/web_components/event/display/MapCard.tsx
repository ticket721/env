import * as React           from 'react';
import { Card, Typography } from 'antd';
import MapComponent         from './MapComponent';
import { theme }            from '../../../utils/theme';

export interface MapCardProps {
    location: any;
    t: any;
}

type MergedMapCardProps = MapCardProps;

export default class MapCard extends React.Component<MergedMapCardProps> {
    render(): React.ReactNode {

        if (!this.props.location) {
            return <Card
                style={{width: '100%', height: '100%'}}
                title={this.props.t('location_title')}
                size={'small'}
            >
                <br/>
                <br/>
                <div style={{textAlign: 'center'}}>
                    <Typography.Text style={{fontSize: 18, color: theme.dark2}}>
                        {this.props.t('no_location')}
                    </Typography.Text>
                </div>
            </Card>;
        }
        return <div id='gmaps' style={{width: '100%', height: '100%'}}>
            <style>{`
                #gmaps .ant-card-body {
                    padding: 0px;
                }
                `}</style>
            <Card
                style={{width: '100%', height: '100%'}}
            >
                <MapComponent location={this.props.location}/>
            </Card>
        </div>;
    }
}
