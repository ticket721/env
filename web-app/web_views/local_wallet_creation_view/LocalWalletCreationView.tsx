import * as React                  from 'react';
import { FullDiv }                 from '@components/html/FullDiv';
import { Box, Grid }               from 'grommet';
import { Wallet, generate }        from 'ethereumjs-wallet';
import dynamic                     from 'next/dynamic';
import { WalletCardProps }         from './WalletCard';
import { I18NProps }               from '../../utils/misc/i18n';
import { Typography }              from 'antd';
import { HorizontalLockFormProps } from './HorizontalLockForm';
import { theme }                   from '../../utils/theme';
import { RGA }                     from '../../utils/misc/ga';

// Dynamic Components

const WalletCard: React.ComponentType<WalletCardProps> = dynamic<WalletCardProps>(async () => import('./WalletCard'), {
    loading: (): React.ReactElement => null
});

const HorizontalLockForm: React.ComponentType<HorizontalLockFormProps> = dynamic<HorizontalLockFormProps>(async () => import('./HorizontalLockForm'), {
    loading: (): React.ReactElement => null
});

// Props

export interface LocalWalletCreationViewProps {
}

type MergedLocalWalletCreationViewProps = LocalWalletCreationViewProps & I18NProps;

export interface TemporaryWallet {
    wallet: Wallet;
    address: string;
}

interface ILocalWalletCreationViewState {
    wallet: TemporaryWallet;
}

/**
 * Wallet creation form
 */
export default class LocalWalletCreationView extends React.Component<MergedLocalWalletCreationViewProps, ILocalWalletCreationViewState> {

    constructor(props: MergedLocalWalletCreationViewProps) {
        super(props);

        const wallet = generate(true);
        this.state = {
            wallet: {
                wallet,
                address: wallet.getChecksumAddressString()
            }
        };
    }

    componentDidMount(): void {
        RGA.pageview('/t721w/create');
    }

    onReloadWallet = (): void => {
        const wallet = generate(true);
        this.setState({
            wallet: {
                wallet,
                address: wallet.getChecksumAddressString()
            }
        });
    }

    render(): React.ReactNode {
        return <FullDiv style={{paddingLeft: '10%', paddingRight: '10%', paddingTop: '5%'}}>
            <Grid
                fill={true}
                rows={['xsmall', '1/2', 'small']}
                columns={['1/2', '1/2']}
                gap='small'
                areas={[
                    {name: 'title', start: [0, 0], end: [1, 0]},
                    {name: 'description', start: [0, 1], end: [0, 1]},
                    {name: 'generator', start: [1, 1], end: [1, 1]},
                    {name: 'input', start: [0, 2], end: [1, 2]},
                ]}
            >

                <Box alignContent='center' alignSelf='center' align='center' gridArea='title'>
                    <Typography.Text style={{fontSize: 56, fontWeight: 300, color: theme.primary}}>{this.props.t('title')}</Typography.Text>
                </Box>
                <Box alignContent='center' alignSelf='center' align='center' style={{padding: '5%'}} gridArea='description'>
                    <Typography.Text style={{lineHeight: 1.5, fontSize: 20, color: theme.dark2}}>{this.props.t('desc')}</Typography.Text>
                </Box>
                <Box style={{padding: '5%'}} gridArea='generator'>
                    <WalletCard reset_wallet={this.onReloadWallet} wallet_infos={this.state.wallet}/>
                </Box>
                <Box align='center' style={{padding: '5%', paddingTop: '0%'}} gridArea='input'>
                    <Typography.Text style={{fontSize: 20, color: theme.dark2}}>{this.props.t('secure_wallet')}</Typography.Text>
                    <br/>
                    <HorizontalLockForm wallet_infos={this.state.wallet}/>
                </Box>
            </Grid>
        </FullDiv>;

    }
}
