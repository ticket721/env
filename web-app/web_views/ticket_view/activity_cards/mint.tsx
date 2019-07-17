import { StrapiTicket }           from '../../../utils/strapi/ticket';
import * as React                 from 'react';
import { Card, List, Typography } from 'antd';
import Address                    from '@components/address';
import StrapiCall                 from '@components/strapi';
import { StrapiHelper }           from '../../../utils/StrapiHelper';
import { StrapiAddress }          from '../../../utils/strapi/address';
import moment                     from 'moment';
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

export const mint = (action: any, ticket: StrapiTicket, tx_explorer: string, t: any): React.ReactNode => {

    const render_item = (item: React.ReactNode): React.ReactNode =>
        <List.Item>
            {item}
        </List.Item>;

    return <List.Item>
        <StrapiCall
            calls={{
                owner: StrapiHelper.getEntry('addresses', action.by),
                event: StrapiHelper.getEntry('addresses', action.to)
            }}
        >
            {
                ({owner, event}: any): React.ReactNode => {

                    owner = filter_strapi(owner) as StrapiAddress[];
                    event = filter_strapi(event) as StrapiAddress[];

                    const content = [
                        <List.Item.Meta
                            key={0}
                            title={<Typography.Text style={{fontSize: 14, color: theme.white, fontWeight: 100}}>{t('ticket_activity_card_owner')}</Typography.Text>}
                            description={<Address address={owner && owner.length ? owner[0] : undefined} size={16} color={theme.white}/>}
                        />,
                        <List.Item.Meta
                            key={1}
                            title={<Typography.Text style={{fontSize: 14, color: theme.white, fontWeight: 100}}>{t('ticket_activity_card_event')}</Typography.Text>}
                            description={<Address address={event && event.length ? event[0] : undefined} size={16} color={theme.white}/>}
                        />,
                        <List.Item.Meta
                            key={2}
                            title={<Typography.Text style={{fontSize: 14, color: theme.white, fontWeight: 100}}>{t('ticket_activity_card_date')}</Typography.Text>}
                            description={<Typography.Text style={{fontSize: 16, color: theme.white}}>{moment(ticket.creation).format('DD MMM YYYY HH:mm')}</Typography.Text>}
                        />,

                    ];

                    return <div className={'activity_mint'}>
                        <Card
                            title={t('ticket_activity_card_mint_title')}
                            size={'small'}
                            style={{borderRadius: 6}}
                            extra={tx_explorer ? <a className='mint_link' target='_blank' href={tx_explorer.replace('TRANSACTION_HASH', action.tx_hash)}>{t('ticket_activity_card_more_infos')}</a> : undefined}
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
