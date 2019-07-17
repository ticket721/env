import { I18N, I18NProps }        from '../../utils/misc/i18n';
import * as React                 from 'react';
import { Card, List, Typography } from 'antd';
import Address                    from '@components/address';
import { StrapiTicket }           from '../../utils/strapi/ticket';
import moment                     from 'moment';
import currencies                 from '@utils/currencies';
import BigNumber                  from 'bignumber.js';
import { theme }                  from '../../utils/theme';

export interface TicketInformationsProps {
    ticket: StrapiTicket;
}

type MergedTicketInformationsProps = TicketInformationsProps & I18NProps;

class TicketInformations extends React.Component<MergedTicketInformationsProps> {

    render_item = (content: React.ReactNode): React.ReactNode => (
        <List.Item>
            {content}
        </List.Item>
    )

    render(): React.ReactNode {

        const content = [];

        if (this.props.ticket) {
            content.push(
                <List.Item.Meta
                    title={<Typography.Text style={{fontSize: 18, color: theme.white}}>📜 {this.props.t('ticket_page_info_owner')}</Typography.Text>}
                    description={
                        <div style={{marginLeft: 24, marginTop: 12}}>
                            <Address address={this.props.ticket.owner} size={22} color={theme.white}/>
                        </div>
                    }
                />
            );

            content.push(
                <List.Item.Meta
                    title={<Typography.Text style={{fontSize: 18, color: theme.white}}>📅 {this.props.t('ticket_page_info_creation')}</Typography.Text>}
                    description={
                        <div style={{marginLeft: 24, marginTop: 12}}>
                            <Typography.Text style={{fontSize: 22, color: theme.white}}>{moment(this.props.ticket.creation).format('DD MMM YYYY hh:mm')}</Typography.Text>
                        </div>
                    }
                />
            );

            if (currencies.address_to_name[this.props.ticket.mint_currency]) {
                const currency = currencies.address_to_name[this.props.ticket.mint_currency];
                content.push(
                    <List.Item.Meta
                        title={<Typography.Text style={{color: theme.white, fontSize: 18}}>💰 {this.props.t('ticket_page_info_initial_price')}</Typography.Text>}
                        description={
                            <div style={{marginLeft: 24, marginTop: 12}}>
                                <Typography.Text style={{fontSize: 22, color: theme.white}}>{currencies[currency].toFixed(new BigNumber(this.props.ticket.mint_price).toString())} {currencies[currency].symbol({color: theme.white})}</Typography.Text>
                            </div>
                        }
                    />
                );
            }

            content.push(
                <List.Item.Meta
                    title={<Typography.Text style={{color: theme.white, fontSize: 18}}>#️⃣ {this.props.t('ticket_page_info_identifier')}</Typography.Text>}
                    description={
                        <div style={{marginLeft: 24, marginTop: 12}}>
                            <Typography.Text style={{fontSize: 22, color: theme.white}}># {this.props.ticket.ticket_id}</Typography.Text>
                        </div>
                    }
                />
            );
        }

        return <div id={'ticket_info_card'}>
            <style>{`
                #ticket_info_card .ant-card-bordered {
                    border: none;
                } 
             
                #ticket_info_card .ant-list-item {
                    margin-top: 24px;
                }
            `}
            </style>
            <Card
                style={{
                    borderRadius: 6,
                    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
                    backgroundColor: theme.dark2
                }}
            >
                <List
                    grid={{
                        gutter: 32,
                        xs: 1,
                        sm: 1,
                        md: 1,
                        lg: 2,
                        xl: 2,
                        xxl: 2,
                    }}
                    dataSource={content}
                    renderItem={this.render_item}
                />
            </Card>
        </div>;
    }
}

export default I18N.withNamespaces(['tickets'])(TicketInformations) as React.ComponentType<TicketInformationsProps>;
