import * as React           from 'react';
import { Card, Typography } from 'antd';
import { I18N, I18NProps }  from '@utils/misc/i18n';
import * as GeoPattern      from 'geopattern';
import { FullDiv }          from '@components/html/FullDiv';
import { TemporaryWallet }  from './LocalWalletCreationView';

export interface WalletCardProps {
    wallet_infos: TemporaryWallet;
    reset_wallet: () => void;
}

type MergedWalletCardProps = WalletCardProps & I18NProps;

interface IWalletCardState {
}

class WalletCard extends React.Component<MergedWalletCardProps, IWalletCardState> {

    render(): React.ReactNode {
        const pattern = GeoPattern.generate(this.props.wallet_infos.address).toDataUrl();
        return <FullDiv style={{textAlign: 'center'}} id='wallet_card'>
            <style scoped={true}>{`
                #wallet_card .ant-card-body {
                    width: 100%;
                    height: 80%;
                }

                #wallet_card .generator_address {
                    background: inherit;
                    color: white;
                    filter: grayscale(1);
                    -webkit-filter: grayscale(1);
                    width: 100%;
                    font-size: 16px;
                    font-weight: 500;
                }

                #wallet_card .ant-card-meta-detail {
                    background: inherit;
                }

                #wallet_card .ant-card {
	                border: none;
	                -webkit-transition: all 1s;
	                transition: all 1s;
	                box-shadow: 5px 10px 20px rgba(0,0,0,0.19), 3px 6px 6px rgba(0,0,0,0.23);
                }

                #wallet_card .ant-card-body {
                    background: inherit;
                    padding: 0;
                }
            `}</style>
            <Typography.Text style={{fontSize: 22}}>{this.props.t('click_to_gen')}</Typography.Text>
            <br/>
            <br/>
            <Card
                style={{
                    width: '100%',
                    height: '60%',
                    textAlign: 'center',
                    backgroundImage: pattern
                }}
                hoverable={true}
                onClick={this.props.reset_wallet}

            >
                <p className='generator_address'>{this.props.wallet_infos.address}</p>

            </Card>
        </FullDiv>;
    }
}

export default I18N.withNamespaces(['local_wallet_creation'])(WalletCard);
