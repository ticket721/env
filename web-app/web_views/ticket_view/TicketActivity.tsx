import * as React          from 'react';
import { List }            from 'antd';
import { StrapiTicket }    from '../../utils/strapi/ticket';
import activity_cards      from './activity_cards';
import { AppState }        from '../../utils/redux/app_state';
import { connect }         from 'react-redux';
import { I18N, I18NProps } from '../../utils/misc/i18n';
import { theme }           from '../../utils/theme';

export interface TicketActivityProps {
    ticket: StrapiTicket;
}

interface TicketActivityRState {
    tx_explorer: string;
}

type MergedTicketActivityProps = TicketActivityProps & TicketActivityRState & I18NProps;

class TicketActivity extends React.Component<MergedTicketActivityProps> {

    render_item = (action: any): React.ReactNode => {

        switch (action.action_type) {
            case 'mint':
                return activity_cards['mint'](action, this.props.ticket, this.props.tx_explorer, this.props.t);
            case 'sale':
                return activity_cards['sale'](action, this.props.ticket, this.props.tx_explorer, this.props.t);
            case 'buy':
                return activity_cards['buy'](action, this.props.ticket, this.props.tx_explorer, this.props.t);
            case 'sale_close':
                return activity_cards['sale_close'](action, this.props.ticket, this.props.tx_explorer, this.props.t);
            case 'transfer':
                return activity_cards['transfer'](action, this.props.ticket, this.props.tx_explorer, this.props.t);
            default:
                return <List.Item/>;

        }
    }

    render(): React.ReactNode {

        const activity = this.props.ticket.actions
            .filter((action: any, idx: number): boolean =>
                !(action.action_type === 'transfer' && idx > 0 && ['mint'].indexOf(this.props.ticket.actions[idx - 1].action_type) !== -1))
            .sort((action_a: any, action_b: any): number =>
                action_b.block - action_a.block);

        return <div id='activity_ticket'>
            <style>{`
                #activity_ticket .ant-card-body {
                    background-color: ${theme.dark2};
                    color: ${theme.white};
                    border-bottom-left-radius: 6px;
                    border-bottom-right-radius: 6px;
                }
               
                #activity_ticket .ant-card-head {
                    border-top-left-radius: 6px;
                    border-top-right-radius: 6px;
                } 
                
                .activity_mint .ant-card-head {
                    background-color: ${theme.primary};
                    color: ${theme.primarydark0};
                }
                
                .mint_link {
                    color: ${theme.primarydark0};
                }
                
                .mint_link:hover {
                    color: ${theme.white};
                }
                
                .transfer_link {
                    color: ${theme.primarydark0};
                }
                
                .transfer_link:hover {
                    color: ${theme.white};
                }
                
                .sale_link {
                    color: ${theme.greendarker0};
                }
                
                .sale_link:hover {
                    color: ${theme.white};
                }
                
                .buy_link {
                    color: ${theme.greendarker0};
                }
                
                .buy_link:hover {
                    color: ${theme.white};
                }
                
                .sale_close_link {
                    color: ${theme.dark0};
                }
                
                .sale_close_link:hover {
                    color: ${theme.white};
                }
                
                .activity_transfer .ant-card-head {
                    background-color: ${theme.primary};
                    color: ${theme.primarydark0};
                }
                
                .activity_sale .ant-card-head {
                    background-color: ${theme.green};
                    color: ${theme.greendarker0};
                }
                
                .activity_buy .ant-card-head {
                    background-color: ${theme.green};
                    color: ${theme.greendarker0};
                }
                
                .activity_sale_close .ant-card-head {
                    background-color: ${theme.dark7};
                    color: ${theme.dark0};
                }
            `}</style>
            <List
                grid={{
                    gutter: 32,
                    xs: 1,
                    sm: 1,
                    md: 1,
                    lg: 1,
                    xl: 1,
                    xxl: 1,
                }}
                dataSource={activity}
                renderItem={this.render_item}
            />
        </div>;
    }
}

const mapStateToProps = (state: AppState): TicketActivityRState => ({
    tx_explorer: state.app.config.tx_explorer
});

export default (connect(mapStateToProps)(
    I18N.withNamespaces(['tickets'])(TicketActivity)
) as any) as React.ComponentType<TicketActivityProps>;
