import * as React           from 'react';
import { Card, Typography } from 'antd';
import { theme }            from '../../../utils/theme';

export interface DescriptionCardProps {
    description: string;
    t: any;
}

type MergedDescriptionCardProps = DescriptionCardProps;

export default class DescriptionCard extends React.Component<MergedDescriptionCardProps> {
    render(): React.ReactNode {
        if (this.props.description) {
            return <Card
                style={{width: '100%', height: '100%'}}
                title={this.props.t('description_title')}
                size={'small'}
            >
                <Typography.Text style={{fontSize: 18, color: theme.dark2}}>
                    {this.props.description}
                </Typography.Text>
            </Card>;
        } else {
            return <Card
                style={{width: '100%', height: '100%'}}
                title={this.props.t('description_title')}
                size={'small'}
            >
                <div style={{textAlign: 'center'}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark2}}>
                    {this.props.t('no_defined_description')}
                </Typography.Text>
                </div>
            </Card>;
        }
    }
}
