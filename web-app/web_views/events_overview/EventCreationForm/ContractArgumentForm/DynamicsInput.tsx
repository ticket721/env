import * as React                               from 'react';
import { Button, Card, Tag, Typography }        from 'antd';
import BuildArgumentForm, { Extras, Overrides } from './index';
import { theme }                                from '../../../../utils/theme';

// Props

export interface DynamicsInputProps {
    plugin_type: string;
    plugin_name: string;
    fields: any;
    name: string;
    on_change: (field: string, value: any) => void;
    value: any;
    dispatcher: (form_values: any[]) => any;
    recover: (current_value: any) => any[];
    overrides: Overrides;
    extras: Extras;
    t: any;
    options?: any;
}

interface IDynamicsInputState {
    values: any[];
}

export class DynamicsInput extends React.Component<DynamicsInputProps, IDynamicsInputState> {

    constructor(props: DynamicsInputProps) {
        super(props);

        const initial = props.recover(props.value);

        this.state = {
            values: initial
        };
    }

    add_cat = (): void => {
        const empty = {};

        for (const field of Object.keys(this.props.fields)) {
            empty[field] = null;
        }

        const values = this.state.values.concat([empty]);
        this.setState({
            values: this.state.values.concat([empty])
        });

        this.update_up(values);

    }

    rm_cat = (idx: number): void => {
        if (idx < this.state.values.length) {
            const values = this.state.values.slice(0);
            values.splice(idx, 1);
            this.setState({
                values
            });
            this.update_up(values);
        }
    }

    update_up = (values: any): void => {

        const update_data = this.props.dispatcher(values);
        for (const name of Object.keys(update_data)) {
            this.props.on_change(name, update_data[name]);
        }
    }

    set_val = (idx: number, name: string, value: any): void => {
        if (idx < this.state.values.length) {
            const values = this.state.values.slice(0);
            values[idx][name] = value;
            this.setState({
                values
            });
            this.update_up(values);
        }
    }

    render(): React.ReactNode {
        const forms = this.state.values.map((values: any, idx: number): React.ReactNode =>

            <Card key={idx} style={{margin: 12}}>
                <Tag style={{marginTop: -10, marginLeft: -10}}># {idx + 1}</Tag>
                <br/>
                <BuildArgumentForm
                    arguments={Object.keys(this.props.fields).map((name: string): any =>
                        ({
                            name,
                            type: this.props.fields[name]
                        }))}
                    argument_values={values}
                    name={this.props.name}
                    on_change={this.set_val.bind(this, idx)}
                    plugin_type={this.props.plugin_type}
                    overrides={this.props.overrides}
                    extras={this.props.extras}
                />
                <br/>
                <br/>
                <div style={{textAlign: 'center'}}>
                    <Button icon='minus' onClick={this.rm_cat.bind(this, idx)} type='danger'/>
                </div>
            </Card>);

        const title = this.props.t(`${this.props.plugin_name}_${this.props.name}`);
        const description = this.props.t(`${this.props.plugin_name}_${this.props.name}_description`);

        return <div style={{margin: 30, width: '90%'}}>
            <Typography.Text style={{fontSize: 26, color: theme.dark2}}>{title}</Typography.Text>
            <br/>
            <br/>
            <div style={{marginLeft: 30}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark3}}>{description}</Typography.Text>
            </div>
            <br/>
            {forms}
            <br/>
            <div style={{textAlign: 'center'}}>
                <Button icon='plus' onClick={this.add_cat} type='primary'/>
            </div>
        </div>;
    }
}
