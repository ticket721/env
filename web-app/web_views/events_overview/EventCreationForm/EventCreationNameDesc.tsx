import * as React                                  from 'react';
import { EventCreationData, EventCreationSetData } from './EventCreationData';
import { Icon, Input, Tooltip, Typography }        from 'antd';
import { SyntheticEvent }                          from 'react';
import { theme }                                   from '../../../utils/theme';

const { TextArea }: any = Input;

const DESCRIPTION_MAX_LENGTH = 1000;
const NAME_MAX_LENGTH = 50;

// Props

export interface EventCreationNameDescProps {
    form_data: EventCreationData;
    set_data: EventCreationSetData;
    t: any;
}

interface EventCreationNameDescState {
    name: string;
    description: string;
}

export default class EventCreationNameDesc extends React.Component<EventCreationNameDescProps, EventCreationNameDescState> {

    state: EventCreationNameDescState = {
        name: undefined,
        description: undefined
    };

    private readonly inner_name_set_data = (e: SyntheticEvent): void => {

        if ((e.target as any).value.length > NAME_MAX_LENGTH) (e.target as any).value = (e.target as any).value.slice(0, NAME_MAX_LENGTH) ;
        this.setState({
            name: (e.target as any).value
        });

        this.props.set_data('name', (e.target as any).value !== '' ? (e.target as any).value : null);

    }

    private readonly inner_desc_set_data = (e: SyntheticEvent): void => {

        if ((e.target as any).value.length > DESCRIPTION_MAX_LENGTH) (e.target as any).value = (e.target as any).value.slice(0, DESCRIPTION_MAX_LENGTH) ;
        this.setState({
            description: (e.target as any).value
        });

        this.props.set_data('description', (e.target as any).value !== '' ? (e.target as any).value : null);

    }

    render(): React.ReactNode {
        return <div style={{marginTop: 30}}>
            <Typography.Text style={{fontSize: 32, color: theme.dark2}}>{this.props.t('name_title')}</Typography.Text>
            <br/>
            <br/>
            <div style={{marginLeft: 10}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark3}}>{this.props.t('name_description')}</Typography.Text>
                <br/>
                <br/>
                <Input
                    type='text'
                    style={{width: '50%'}}
                    value={this.state.name}
                    placeholder={this.props.t('name_placeholder')}
                    onChange={this.inner_name_set_data}
                    suffix={this.state.name && this.state.name.length >= NAME_MAX_LENGTH ? (
                        <Tooltip title={this.props.t('name_length_limit')}>
                            <Icon type='info-circle' style={{ color: theme.danger }} />
                        </Tooltip>
                    ) : undefined}
                />
            </div>
            <br/>
            <Typography.Text style={{fontSize: 32, color: theme.dark2}}>{this.props.t('description_title')}</Typography.Text>
            <br/>
            <br/>
            <div style={{marginLeft: 10}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark2}}>{this.props.t('description_description')}</Typography.Text>
                <br/>
                <br/>
                <TextArea
                    style={{width: '50%'}}
                    placeholder={this.props.t('description_placeholder')}
                    value={this.state.description}
                    onChange={this.inner_desc_set_data}
                    autosize={{ minRows: 2, maxRows: 10 }}
                />
                {
                    this.state.description && this.state.description.length >= DESCRIPTION_MAX_LENGTH ? (
                        <div>
                            <br/>
                            <br/>
                            <Typography.Text
                                style={{
                                    fontSize: 18,
                                    color: theme.danger
                                }}
                            >
                                {this.props.t('description_length_limit')}
                            </Typography.Text>
                        </div>
                    ) : null
                }
            </div>
        </div>;
    }
}
