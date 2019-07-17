import * as React            from 'react';
import { Input, Typography } from 'antd';
import { SyntheticEvent }    from 'react';
import { theme }             from '../../../../utils/theme';

export interface UintInputProps {
    plugin_name: string;
    name: string;
    on_change: (field: string, value: any) => void;
    value: number;
    t: any;
    options?: any;
}

export class UintInput extends React.Component<UintInputProps> {

    private readonly inner_on_change = (e: SyntheticEvent): void => {
        const value = (e.target as any).value;

        if (value && value !== '') {
            this.props.on_change(this.props.name, value);
        } else {
            this.props.on_change(this.props.name, null);
        }
    }

    render(): React.ReactNode {

        const title = this.props.t(`${this.props.plugin_name}_${this.props.name}`);
        const description = this.props.t(`${this.props.plugin_name}_${this.props.name}_description`);
        const placeholder = this.props.t(`${this.props.plugin_name}_${this.props.name}_placeholder`);

        return <div style={{margin: 30}}>
            <Typography.Text style={{fontSize: 26, color: theme.dark2}}>{title}</Typography.Text>
            <br/>
            <br/>
            <div style={{marginLeft: 30}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark3}}>{description}</Typography.Text>
            </div>
            <br/>
            <Input
                type='number'
                placeholder={placeholder}
                value={this.props.value ? this.props.value.toString() : undefined}
                style={{marginLeft: 20, marginTop: 5}}
                onChange={this.inner_on_change}
            />
        </div>;
    }
}
