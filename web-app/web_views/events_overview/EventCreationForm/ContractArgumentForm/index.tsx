import * as React             from 'react';
import { UintInput }          from './UintInput';
import { DateInput }          from './DateInput';
import { PriceInput }         from './PriceInput';
import { DynamicsInput }      from './DynamicsInput';
import { Bytes32Input }       from './Bytes32Input';
import { NamespacesConsumer } from 'react-i18next';

export interface Argument {
    name: string;
    type: string;
    options?: any;
}

export interface Overrides {
    [key: string]: {
        [key: string]: any
    };
}

export interface Extras {
    [key: string]: {
        [key: string]: any;
    };
}

// Props

export interface BuildArgumentFormProps {
    arguments: Argument[];
    argument_values: any;
    name: string;
    plugin_type: string;
    on_change: (field: string, value: any) => void;
    overrides: Overrides;
    extras: Extras;
}

export default class ContractArgumentForm extends React.Component<BuildArgumentFormProps> {

    render(): React.ReactNode {
        const form: React.ReactNode[] = [];

        let argument_list = this.props.arguments;

        if (this.props.extras[this.props.name]) {
            argument_list = argument_list.concat(Object.keys(this.props.extras[this.props.name]).map((name: string): any =>
                ({
                    name,
                    type: this.props.extras[this.props.name][name]
                })));
        }

        for (const argument of argument_list) {
            let type = argument.type;
            if (this.props.overrides[this.props.name] && this.props.overrides[this.props.name][argument.name]) {
                type = this.props.overrides[this.props.name][argument.name];
            }
            if (typeof type === 'string') {
                switch (type) {
                    case 'bytes32':

                        form.push(
                            <NamespacesConsumer ns={[this.props.plugin_type]} key={argument.name}>
                                {(t: any): React.ReactNode =>
                                    <Bytes32Input
                                        t={t}
                                        name={argument.name}
                                        plugin_name={this.props.name}
                                        value={this.props.argument_values[argument.name]}
                                        on_change={this.props.on_change}
                                        options={argument.options}
                                    />
                                }
                            </NamespacesConsumer>
                        );

                        break;

                    case 'uint256':

                        form.push(
                            <NamespacesConsumer ns={[this.props.plugin_type]} key={argument.name}>
                                {(t: any): React.ReactNode =>
                                    <UintInput
                                        plugin_name={this.props.name}
                                        name={argument.name}
                                        value={this.props.argument_values[argument.name]}
                                        on_change={this.props.on_change}
                                        t={t}
                                        options={argument.options}
                                    />
                                }
                            </NamespacesConsumer>
                        );

                        break;

                    case 'date':

                        form.push(
                            <NamespacesConsumer ns={[this.props.plugin_type]} key={argument.name}>
                                {(t: any): React.ReactNode =>
                                    <DateInput
                                        t={t}
                                        plugin_name={this.props.name}
                                        name={argument.name}
                                        value={this.props.argument_values[argument.name]}
                                        on_change={this.props.on_change}
                                        options={argument.options}
                                    />
                                }
                            </NamespacesConsumer>
                        );

                        break;

                    case 'price':

                        form.push(
                            <NamespacesConsumer ns={[this.props.plugin_type]} key={argument.name}>
                                {(t: any): React.ReactNode =>
                                    <PriceInput
                                        plugin_name={this.props.name}
                                        name={argument.name}
                                        value={this.props.argument_values[argument.name]}
                                        on_change={this.props.on_change}
                                        t={t}
                                        options={argument.options}
                                    />
                                }
                            </NamespacesConsumer>
                        );

                        break;

                    default:

                }
            } else if (typeof type === 'object' && (type as any).type) {
                const complex_type: any = type;
                switch (complex_type.type) {
                    case 'dynamics':

                        form.push(
                            <NamespacesConsumer ns={[this.props.plugin_type]} key={argument.name}>
                                {(t: any): React.ReactNode =>
                                    <DynamicsInput
                                        plugin_type={this.props.plugin_type}
                                        plugin_name={this.props.name}
                                        fields={complex_type.fields}
                                        name={argument.name}
                                        value={this.props.argument_values}
                                        on_change={this.props.on_change}
                                        dispatcher={complex_type.dispatcher}
                                        recover={complex_type.recover}
                                        overrides={this.props.overrides}
                                        extras={this.props.extras}
                                        t={t}
                                        options={argument.options}
                                    />
                                }
                            </NamespacesConsumer>
                        );

                        break;

                }
            }
        }

        return <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{width: '80%'}}>
                {form}
            </div>
        </div>;
    }

}
