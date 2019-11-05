import * as React                          from 'react';
import { ListRenderItemInfo, View, Image } from 'react-native';
import {
    List,
    ListItem,
    Text,
    ListItemProps,
    ThemedComponentProps,
    TopNavigation,
    withStyles
}                                          from 'react-native-ui-kitten';
import { CustomStatusBar }                 from '../../utils/CustomStatusBar';
import { I18N }                            from '../../../i18n';
import { WhiteSpace }                      from '@ant-design/react-native';
import { themeResolver }                   from '../../utils/themeResolver';
import { Linking }                         from 'react-native';
import { ResetScanner }                  from '../../../redux/actions/device';
import { AppState }                        from '../../../redux/state';
import { Dispatch }                        from 'redux';
import { connect }                         from 'react-redux';

export interface SettingsScreenProps {

}

export interface SettingsScreenRDispatch {
    dispatch: Dispatch;
}

export type SettingsScreenMergedProps = SettingsScreenProps & ThemedComponentProps & SettingsScreenRDispatch;

const settingsItems = [
    {
        title: 'settings_reset_scanner',
        logo: require('../../../assets/reset.png'),
        action: ResetScanner
    }
];

const socialItems = [
    {
        title: 'Telegram',
        logo: require('../../../assets/telegram.png'),
        link: 'https://t.me/ticket721'
    },
    {
        title: 'Twitter',
        logo: require('../../../assets/twitter.png'),
        link: 'https://twitter.com/ticket721'
    },
    {
        title: 'Slack',
        logo: require('../../../assets/slack.png'),
        link: 'https://join.slack.com/t/ticket721/shared_invite/enQtNjY1MTMyNzcxNTM3LTQ5YTM5ODg2NzNkNDg3ODgxNzk0ZTg3Nzg2YWY3ZjQ4NWFkZWVhNzYyMDk0NGZkY2RiZGM4OTMzNzcyZmZjODU'
    },
    {
        title: 'Spectrum',
        logo: require('../../../assets/spectrum.png'),
        link: 'https://spectrum.chat/ticket721'
    },
    {
        title: 'Website',
        logo: require('../../../assets/website.png'),
        link: 'https://ticket721.com'
    }
];

class SettingsScreen extends React.Component<SettingsScreenMergedProps> {

    private readonly onSocialItemClick = async (link: string): Promise<void> => {
        await Linking.openURL(link);
    }

    private readonly renderSocialItem = (info: ListRenderItemInfo<any>): React.ReactElement<ListItemProps> =>
        (
            <ListItem
                style={{
                    height: 50,
                    borderColor: themeResolver('color-basic-600', this.props.theme),
                    borderTopWidth: info.index > 0 ? 1 : 0
                }}
                onPress={this.onSocialItemClick.bind(null, info.item.link)}
            >
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row'}}>
                    <Image
                        source={info.item.logo}
                        style={{width: 30, height: 30, borderRadius: 2}}
                        width={30}
                        height={30}
                    />
                    <Text style={{fontSize: 18, lineHeight: 18, marginLeft: 16}}>{info.item.title}</Text>
                </View>
            </ListItem>
        )

    private readonly renderSettingsItem = (info: ListRenderItemInfo<any>): React.ReactElement<ListItemProps> =>
        (
            <ListItem
                style={{
                    height: 50,
                    borderColor: themeResolver('color-basic-600', this.props.theme),
                    borderTopWidth: info.index > 0 ? 1 : 0
                }}
                onPress={this.props.dispatch.bind(null, info.item.action())}
            >
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row'}}>
                    <Image
                        source={info.item.logo}
                        style={{width: 30, height: 30, borderRadius: 2}}
                        width={30}
                        height={30}
                    />
                    <Text style={{fontSize: 18, lineHeight: 18, marginLeft: 16}}>{I18N.t(settingsItems[0].title)}</Text>
                </View>
            </ListItem>
        )

    render(): React.ReactNode {
        const containerBackgroundColor = this.props.theme['color-basic-1000'];
        const statusBarBackgroundColor = this.props.theme['color-basic-800'];

        return <View style={{height: '100%', backgroundColor: containerBackgroundColor}}>
            <CustomStatusBar containerBackgroundColor={statusBarBackgroundColor} barStyle={'light-content'}/>
            <TopNavigation
                title={I18N.t('settings_title')}
                alignment={'start'}
            />
            <WhiteSpace/>
            <Text category={'h4'} style={{marginLeft: 6}}>{I18N.t('settings_settings_title')}</Text>
            <WhiteSpace/>
            <List
                scrollEnabled={false}
                data={settingsItems}
                renderItem={this.renderSettingsItem}
                style={{backgroundColor: containerBackgroundColor}}
            />
            <Text category={'h4'} style={{marginLeft: 6}}>{I18N.t('settings_social_title')}</Text>
            <WhiteSpace/>
            <List
                scrollEnabled={false}
                data={socialItems}
                renderItem={this.renderSocialItem}
                style={{backgroundColor: containerBackgroundColor}}
            />
        </View>;
    }
}

const mapStateToProps = (state: AppState): any => ({});

const mapDispatchToProps = (dispatch: Dispatch): SettingsScreenRDispatch => ({
    dispatch
});

export default withStyles(
    connect(mapStateToProps, mapDispatchToProps)(
        SettingsScreen
    )
);
