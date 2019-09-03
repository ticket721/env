import * as React                                                from 'react';
import { View }                                                  from 'react-native';
import { Button, Input, Text, ThemedComponentProps, withStyles } from 'react-native-ui-kitten';
import { themeResolver }                                         from '../../utils/themeResolver';
import { WhiteSpace }                                            from '@ant-design/react-native';
import { I18N }                                                  from '../../../i18n';
import { AppState, NetworkInfos }                                from '../../../redux/state';
import { Dispatch }                                              from 'redux';
import { AddNetwork }                                            from '../../../redux/actions/device';
import { connect }                                               from 'react-redux';
import { urlValidator }                                          from '../../utils/urlValidator';

export interface AddNetworkModalProps {
    toggle: () => void;
}

interface AddNetworkModalState {
    network_name: string;
    network_eth_node_url: string;
    network_strapi_url: string;
}

interface AddNetworkModalRState {
    networks: NetworkInfos[];
}

interface AddNetworkModalRDispatch {
    addNetwork: (name: string, eth_node_url: string, strapi_url: string) => void;
}

type AddNetworkModalMergedProps = AddNetworkModalProps & AddNetworkModalRState & AddNetworkModalRDispatch & ThemedComponentProps;

class AddNetworkModal extends React.Component<AddNetworkModalMergedProps, AddNetworkModalState> {

    state: AddNetworkModalState = {
        network_name: undefined,
        network_eth_node_url: undefined,
        network_strapi_url: undefined
    };

    private readonly setNetworkName = (new_value: string): void => {
        this.setState({
            network_name: new_value
        });
    }

    private readonly setNetworkEthNodeUrl = (new_value: string): void => {
        this.setState({
            network_eth_node_url: new_value
        });
    }

    private readonly setNetworStrapiUrl = (new_value: string): void => {
        this.setState({
            network_strapi_url: new_value
        });
    }

    private readonly onSubmit = (): void => {
        this.props.addNetwork(this.state.network_name, this.state.network_eth_node_url, this.state.network_strapi_url);
        this.props.toggle();
    }

    private readonly isNameInputValid = (): boolean =>
        (this.props.networks.findIndex((net: NetworkInfos): boolean => net.name === this.state.network_name) === -1)

    private readonly isEthNodeInputValid = (): boolean =>
        (urlValidator(this.state.network_eth_node_url))

    private readonly isStrapiUrlInputValid = (): boolean =>
        (urlValidator(this.state.network_strapi_url))

    private readonly isButtonDisabled = (): boolean => {
        if (!this.state.network_strapi_url || !this.state.network_eth_node_url || !this.state.network_name) return true;
        return (!this.isStrapiUrlInputValid() || !this.isEthNodeInputValid() || !this.isNameInputValid());
    }

    render = (): React.ReactNode =>

        <View>
            <Text
                category={'h4'}
                style={{color: themeResolver('color-basic-800', this.props.theme)}}
            >
                {I18N.t('add_network_modal_title')}
            </Text>
            <WhiteSpace/>
            <WhiteSpace/>
            <Input
                style={{
                    borderColor: this.isNameInputValid() ? themeResolver('color-basic-200', this.props.theme) : themeResolver('color-danger-500', this.props.theme),
                    backgroundColor: themeResolver('color-basic-200', this.props.theme),
                }}
                textStyle={{
                    color: themeResolver('color-primary-500', this.props.theme)
                }}
                labelStyle={{
                    color: themeResolver('color-basic-800', this.props.theme)
                }}
                placeholderTextColor={
                    themeResolver('color-basic-800', this.props.theme)
                }
                label={I18N.t('add_network_modal_network_name')}
                placeholder={I18N.t('add_network_modal_network_name_placeholder')}
                onChangeText={this.setNetworkName}
                value={this.state.network_name}
            />
            <WhiteSpace/>
            <Input
                style={{
                    borderColor: this.isEthNodeInputValid() ? themeResolver('color-basic-200', this.props.theme) : themeResolver('color-danger-500', this.props.theme),
                    backgroundColor: themeResolver('color-basic-200', this.props.theme),
                }}
                textStyle={{
                    color: themeResolver('color-primary-500', this.props.theme)
                }}
                labelStyle={{
                    color: themeResolver('color-basic-800', this.props.theme)
                }}
                placeholderTextColor={
                    themeResolver('color-basic-800', this.props.theme)
                }
                label={I18N.t('add_network_modal_eth_node')}
                placeholder={I18N.t('add_network_modal_eth_node_placeholder')}
                onChangeText={this.setNetworkEthNodeUrl}
                value={this.state.network_eth_node_url}
            />
            <WhiteSpace/>
            <Input
                style={{
                    borderColor: this.isStrapiUrlInputValid() ? themeResolver('color-basic-200', this.props.theme) : themeResolver('color-danger-500', this.props.theme),
                    backgroundColor: themeResolver('color-basic-200', this.props.theme),
                }}
                textStyle={{
                    color: themeResolver('color-primary-500', this.props.theme)
                }}
                labelStyle={{
                    color: themeResolver('color-basic-800', this.props.theme)
                }}
                placeholderTextColor={
                    themeResolver('color-basic-800', this.props.theme)
                }
                label={I18N.t('add_network_modal_server_url')}
                placeholder={I18N.t('add_network_modal_server_url_placeholder')}
                onChangeText={this.setNetworStrapiUrl}
                value={this.state.network_strapi_url}
            />
            <WhiteSpace/>
            <Button
                onPress={this.onSubmit}
                disabled={this.isButtonDisabled()}
            >
                {I18N.t('add_network_modal_done')}
            </Button>
        </View>
}

const mapStateToProps = (state: AppState): AddNetworkModalRState => ({
    networks: state.device.network_list
});

const mapDispatchToProps = (dispatch: Dispatch): AddNetworkModalRDispatch => ({
    addNetwork: (name: string, eth_node_url: string, strapi_url: string): void => void dispatch(AddNetwork(name, eth_node_url, strapi_url))
});

export default withStyles(
    connect(mapStateToProps, mapDispatchToProps)(
        AddNetworkModal
    )
) as React.ComponentType<AddNetworkModalProps>;
