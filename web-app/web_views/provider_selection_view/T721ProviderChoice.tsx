import * as React                       from 'react';
import { Card, Icon }                   from 'antd';
import t721_provider_image              from '@static/assets/ticket721/light.svg';
import { I18N, I18NProps }              from '@utils/misc/i18n';
import { AppState, WalletProviderType } from '@utils/redux/app_state';
import { Dispatch }                     from 'redux';
import { SetWalletProvider }            from '@utils/redux/app/actions';
import { connect }                      from 'react-redux';
import { theme }                        from '../../utils/theme';

export interface T721ProviderChoiceProps {

}

interface T721ProviderChoiceRState {

}

interface T721ProviderChoiceRDispatch {
    setWalletProvider: () => void;
}

type MergedT721ProviderChoiceProps = T721ProviderChoiceProps & T721ProviderChoiceRState & T721ProviderChoiceRDispatch & I18NProps;

class T721ProviderChoice extends React.Component<MergedT721ProviderChoiceProps> {

    onClick = (): void => {
        this.props.setWalletProvider();
    }

    render(): React.ReactNode {
        return <Card
            style={{width: '100%'}}
            hoverable={true}
            cover={<img alt='t721' style={{width: '100%', backgroundColor: theme.dark2, padding: '15%'}} src={t721_provider_image}/>}
            actions={[<Icon type='double-right' key={0}/>]}
            onClick={this.onClick}
        >
            <Card.Meta
                title={this.props.t('t721_title')}
                description={this.props.t('t721_desc')}
            />

        </Card>;
    }
}

const mapStateToProps = (state: AppState): T721ProviderChoiceRState => ({});
const mapDispatchToProps = (dispatch: Dispatch): T721ProviderChoiceRDispatch => ({
    setWalletProvider: (): void => {
        dispatch(SetWalletProvider(WalletProviderType.T721Provider));
    }
});

export default I18N.withNamespaces(['provider_selection'])(connect(mapStateToProps, mapDispatchToProps)(T721ProviderChoice));
