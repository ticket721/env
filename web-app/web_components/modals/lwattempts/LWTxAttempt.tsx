import * as React                                   from 'react';
import { TxAttempt }                                from '../../../utils/redux/app_state';
import { Avatar, Col, Icon, List, Row, Typography } from 'antd';
import BigNumber                                    from 'bignumber.js';
import { Markdown }                                 from 'grommet';
import { I18NProps }                                from '../../../utils/misc/i18n';
import { theme }                                    from '../../../utils/theme';
import { RGA }                                      from '../../../utils/misc/ga';

// Props

export interface LWTxAttemptProps {
    attempt: TxAttempt;
}

type MergedLWTxAttemptProps = LWTxAttemptProps & I18NProps;

export default class ILWTxAttempt extends React.Component<MergedLWTxAttemptProps> {

    componentDidMount(): void {
        RGA.modalview('/t721w/tx');
    }

    render_func = (item: any): React.ReactNode => <List.Item>
        <List.Item.Meta
            avatar={<Avatar style={{backgroundColor: theme.dark7, verticalAlign: 'middle'}} size={32} icon={item.icon}/>}
            title={item.title}
            description={<div style={{textAlign: 'center'}}>{item.data}</div>}
        />
    </List.Item>

    render(): React.ReactNode {

        const error: boolean = this.props.attempt.error !== null;

        const color: string = !error ? theme.primary : theme.danger;
        const icon: string = !error ? 'check-circle' : 'exclamation-circle';

        let data = [];

        const tx = this.props.attempt.tx;
        const json = tx.toJSON();
        const from = '0x' + Buffer.from(tx.from).toString('hex');
        const to = '0x' + Buffer.from(tx.to).toString('hex');

        data = [
            {
                title: this.props.t('lwattempts_from'),
                data: <Typography.Text strong={true} style={{color: theme.dark2}}>{from}</Typography.Text>,
                icon: 'arrow-left'
            },
            {
                title: this.props.t('lwattempts_to'),
                data: <Typography.Text strong={true} style={{color: theme.dark2}}>{json[3]}</Typography.Text>,
                icon: 'arrow-right'
            },
            {
                title: this.props.t('lwattempts_value'),
                data: <Typography.Text
                    strong={true}
                    style={{color: theme.dark2}}
                >
                    {json[4] === '0x' ? '0' : `${(new BigNumber(json[4])).div(new BigNumber('1000000000000000000')).toString()} Ξ`}
                </Typography.Text>,
                icon: 'dollar'
            },
            {
                title: this.props.t('lwattempts_nonce'),
                data: <Typography.Text
                    strong={true}
                    style={{color: theme.dark2}}
                >
                    {json[0] === '0x' ? '0' : `${new BigNumber(json[0]).toString()}`}
                </Typography.Text>,
                icon: 'pushpin'
            },
            {
                title: this.props.t('lwattempts_gas_price'),
                data: <Typography.Text strong={true} style={{color: theme.dark2}}>{`${new BigNumber(json[1]).toString()} WΞI`}</Typography.Text>,
                icon: 'check'
            },
            {
                title: this.props.t('lwattempts_gas_limit'),
                data: <Typography.Text strong={true} style={{color: theme.dark2}}>{`${new BigNumber(json[2]).toString()} WΞI`}</Typography.Text>,
                icon: 'dashboard'
            }
        ];
        if (json[5] !== '0x') {
            data.push({
                title: this.props.t('lwattempts_data'),
                data: <Markdown style={{wordBreak: 'break-word'}}>{json[5]}</Markdown>,
                icon: 'build'
            });
        }

        if (to === '0x') {

            data[data.length - 1] = {
                title: this.props.t('lwattempts_data'),
                data: <Markdown style={{wordBreak: 'break-word'}}>{this.props.t('lwattempts_contract')}</Markdown>,
                icon: 'build'
            };

            data.splice(1, 1);

        }

        return <div>
            <Row>
                <Col span={8}/>
                <Col span={8} style={{textAlign: 'center'}}>
                    <Icon type={icon} style={{color, fontSize: '30px'}}/>
                </Col>
                <Col span={8}/>
            </Row>
            <Row style={{padding: '15px', marginTop: '20px', marginBottom: '20px'}}>
                {error ?
                    <div style={{textAlign: 'center'}}>
                        <Typography.Text type='danger' style={{color: theme.danger}}>{this.props.attempt.error}</Typography.Text>
                    </div>
                    : null}
                <List
                    itemLayout='horizontal'
                    dataSource={data}
                    renderItem={this.render_func}
                />
            </Row>
        </div>;
    }
}
