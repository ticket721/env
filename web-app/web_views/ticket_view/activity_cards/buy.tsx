import { StrapiTicket }           from '../../../utils/strapi/ticket';
import * as React                 from 'react';
import { Card, List, Typography } from 'antd';
import Address                    from '@components/address';
import StrapiCall                 from '@components/strapi';
import { StrapiHelper }           from '../../../utils/StrapiHelper';
import { StrapiAddress }          from '../../../utils/strapi/address';
import moment                     from 'moment';
import currencies                 from '@utils/currencies';
import { theme }                  from '../../../utils/theme';

const filter_strapi = (entities: any[]): any[] => {

    // Removing Errored entities
    let real_entities;
    if (entities) {
        real_entities = [];
        for (const entity of entities) {
            if (entity.data) {
                real_entities.push(entity.data);
            }
        }
    } else {
        real_entities = entities;
    }

    return real_entities;
};

export const buy = (action: any, ticket: StrapiTicket, tx_explorer: string, t: any): React.ReactNode => {

    const render_item = (item: React.ReactNode): React.ReactNode =>
        <List.Item>
            {item}
        </List.Item>;

    return <List.Item>
        <StrapiCall
            calls={{
                from: StrapiHelper.getEntry('addresses', action.by)
            }}
        >
            {
                ({from}: any): React.ReactNode => {

                    from = filter_strapi(from) as StrapiAddress[];

                    const content = [
                        <List.Item.Meta
                            key={0}
                            title={<Typography.Text style={{fontSize: 14, color: theme.white, fontWeight: 100}}>{t('ticket_activity_card_owner')}</Typography.Text>}
                            description={<Address address={from && from.length ? from[0] : undefined} size={16} color={theme.white}/>}
                        />
                    ];

                    if (currencies.address_to_name[action.infos.currency]) {
                        const name = currencies.address_to_name[action.infos.currency];
                        content.push(
                            <List.Item.Meta
                                key={1}
                                title={<Typography.Text style={{fontSize: 14, color: theme.white, fontWeight: 100}}>{t('ticket_activity_card_price')}</Typography.Text>}
                                description={<Typography.Text style={{fontSize: 16, color: theme.white}}>{currencies[name].toFixed(action.infos.price)} {currencies[name].symbol({color: theme.white})}</Typography.Text>}
                            />
                        );
                    }

                    content.push(
                        <List.Item.Meta
                            key={2}
                            title={<Typography.Text style={{fontSize: 14, color: theme.white, fontWeight: 100}}>{t('ticket_activity_card_date')}</Typography.Text>}
                            description={<Typography.Text style={{fontSize: 16, color: theme.white}}>{moment(action.action_timestamp).format('DD MMM YYYY HH:mm')}</Typography.Text>}
                        />
                    );

                    return <div className={'activity_buy'}>
                        <Card
                            title={t('ticket_activity_card_buy_title')}
                            size={'small'}
                            style={{borderRadius: 6}}
                            extra={tx_explorer ? <a className='buy_link' target='_blank' href={tx_explorer.replace('TRANSACTION_HASH', action.tx_hash)}>{t('ticket_activity_card_more_infos')}</a> : undefined}
                        >
                            <List
                                renderItem={render_item}
                                dataSource={content}
                                grid={{
                                    gutter: 32,
                                    xs: 1,
                                    sm: 1,
                                    md: 1,
                                    lg: 2,
                                    xl: 2,
                                    xxl: 2,
                                }}
                            />
                        </Card>
                    </div>;
                }
            }
        </StrapiCall>
    </List.Item>;
};
