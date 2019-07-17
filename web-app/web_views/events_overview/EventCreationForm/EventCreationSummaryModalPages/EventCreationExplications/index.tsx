import { EventDeployProps }     from '../EventDeployProps';
import * as React               from 'react';
import { Checkbox, Typography } from 'antd';
import { RGA }                  from '../../../../../utils/misc/ga';

export interface EventCreationExplicationsOwnProps {

}

export type EventCreationExplicationsProps = EventCreationExplicationsOwnProps & EventDeployProps;
type MergedEventCreationExplicationsProps = EventCreationExplicationsProps;

export default class EventCreationExplications extends React.Component<MergedEventCreationExplicationsProps> {

    componentDidMount(): void {
        RGA.modalview('/create/explications');
    }

    agree = (arg: any): void => {
        this.props.set({
            explications_read: arg.target.checked
        });
    }

    render(): React.ReactNode {
        return <div style={{textAlign: 'center'}}>
            <br/>
            <Typography.Text style={{fontSize: 22}}>
                {this.props.t('explications_description')}
            </Typography.Text>
            <br/>
            <br/>
            <Checkbox style={{fontSize: 16}} onChange={this.agree}>{this.props.t('explications_agree')}</Checkbox>
        </div>;
    }
}
