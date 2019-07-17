import * as React                                                             from 'react';
import { Card, Popover, Tag }                                                 from 'antd';
import * as GeoPattern                                                        from 'geopattern';
import { StrapiEvent }                                                        from '@utils/strapi/event';
import { StrapiTicket }                                                       from '@utils/strapi/ticket';
import { Typography }                                                         from 'antd';
import { TicketDetailsPopover, TicketEventPopover, TicketMarketplacePopover } from './TicketTopPopovers';
import { StrapiMinter }                                                       from '@utils/strapi/minter';
import { StrapiMarketer }                                                     from '@utils/strapi/marketer';
import moment                                                                 from 'moment';
import { Textfit }                                                            from 'react-textfit';
import { TicketBuyPopover, TicketCloseSalePopover, TicketSellPopover } from './TicketBottomPopovers';
import OpenSaleModal                                                   from './modals/OpenSaleModal';
import { MarketerEnabled }                                             from '../event/misc/MarketerEnabled';
import { I18N, I18NProps }                                             from '../../utils/misc/i18n';
import { routes }                                                      from '../../utils/routing';
import CloseSaleModal                                                  from './modals/CloseSaleModal';
import TagCountdown                                                    from './TagCountdown';
import BuyModal                                                        from './modals/BuyModal';
import { theme }                                                       from '../../utils/theme';

export interface TicketProps {
    ticket: StrapiTicket;
    strapi_url: string;
    ticket_infos: string[];
    event: StrapiEvent;
    contract_plugins: {
        minter: StrapiMinter;
        marketer: StrapiMarketer;
    };
    coinbase: string;
    show_marketplace_link?: boolean;
    always_hovered?: boolean;
}

type MergedTicketProps = TicketProps & I18NProps;

interface TicketState {
    hovered: boolean;
    real_hover: boolean;
    opensale_visible: boolean;
    closesale_visible: boolean;
    buy_visible: boolean;
}

class Ticket extends React.Component<MergedTicketProps, TicketState> {

    state: TicketState = {
        hovered: false,
        real_hover: false,
        opensale_visible: false,
        closesale_visible: false,
        buy_visible: false
    };

    buy_open = (): void => {
        this.setState({
            buy_visible: true
        });
    }

    buy_close = (): void => {
        this.setState({
            buy_visible: false
        });
    }

    opensale_open = (): void => {
        this.setState({
            opensale_visible: true
        });
    }

    opensale_close = (): void => {
        this.setState({
            opensale_visible: false
        });
    }

    closesale_open = (): void => {
        this.setState({
            closesale_visible: true
        });
    }

    closesale_close = (): void => {
        this.setState({
            closesale_visible: false
        });
    }

    on_mouse = (enter: boolean): void => {
        if (enter === false) {
            this.setState({
                real_hover: false
            });
            setTimeout(() => {
                if (this.state.real_hover === false && this.state.hovered === true) {
                    this.setState({
                        hovered: false
                    });
                }
            }, 200);
        } else {
            this.setState({
                real_hover: true
            });
            setTimeout(() => {
                if (this.state.real_hover === true && this.state.hovered === false) {
                    this.setState({
                        hovered: true,
                    });
                }
            }, 300);
        }
    }

    on_click = (): void => {
        if (this.state.hovered === false) {
            this.setState({
                hovered: true
            });
        }
    }

    isOwner = (): boolean => {
        if (!this.props.coinbase || !this.props.ticket) return false;
        return (this.props.ticket.owner.address === this.props.coinbase);
    }

    render(): React.ReactNode {

        const pattern = GeoPattern.generate(this.props.event.address.address, {color: theme.primary}).toDataUrl();

        const tags = [<Tag style={{color: theme.dark2}} color={theme.bwhite} key={0}>🎫 {this.props.ticket.ticket_id}</Tag> as React.ReactNode].concat(
            this.props.ticket_infos
                ?
                this.props.ticket_infos.map((info: string, idx: number): React.ReactNode => <Tag style={{color: theme.dark2}} color={theme.bwhite} key={idx + 1}>{info}</Tag>)
                :
                []
        );

        const date = this.props.event.start ? moment(this.props.event.start).format('DD MMM YYYY') : null;

        const sale_open = !!this.props.ticket.current_sale;

        if (sale_open) {

            const content = (
                <routes.Link route='marketplace' params={{ticket_id: this.props.ticket.ticket_id}}>
                    <div style={{textAlign: 'center'}}>
                        <Typography.Text style={{fontSize: 18, cursor: 'pointer'}}>{this.props.t('sale_tag_body')}</Typography.Text>
                    </div>
                </routes.Link>
            );

            tags.unshift(
                this.props.show_marketplace_link ?
                    <Popover key='sale' content={content} title={this.props.t('sale_tag_title')} trigger='hover'>
                        <Tag color='gold'>💰 <TagCountdown end={new Date(this.props.ticket.current_sale.end)}/></Tag>
                    </Popover>
                    :
                    <Tag color='gold' key='sale'>💰</Tag>
            );
        }

        const deployed = this.props.always_hovered || this.state.hovered || this.state.opensale_visible;

        const owner = this.isOwner();
        const market = this.props.contract_plugins.marketer ? MarketerEnabled[this.props.contract_plugins.marketer.name] : null;

        const bottom_popovers = [] ;

        if (!sale_open) {

            if (owner && market) {
                bottom_popovers.push(
                    <TicketSellPopover
                        key={0}
                        hover={deployed}
                        on_enter={this.on_mouse.bind(this, true)}
                        on_leave={this.on_mouse.bind(this, false)}
                        on_click={this.opensale_open}
                        t={this.props.t}
                    />
                );
            }

        } else {

            if (market) {

                if (owner) {
                    bottom_popovers.push(
                        <TicketCloseSalePopover
                            key={0}
                            hover={deployed}
                            on_enter={this.on_mouse.bind(this, true)}
                            on_leave={this.on_mouse.bind(this, false)}
                            on_click={this.closesale_open}
                            t={this.props.t}
                        />
                    );
                } else {
                    bottom_popovers.push(
                        <TicketBuyPopover
                            key={0}
                            hover={deployed}
                            on_enter={this.on_mouse.bind(this, true)}
                            on_leave={this.on_mouse.bind(this, false)}
                            on_click={this.buy_open}
                            t={this.props.t}
                        />
                    );
                }

            }

        }

        return <div
            id='ticket'
            onMouseEnter={this.on_mouse.bind(this, true)}
            onMouseLeave={this.on_mouse.bind(this, false)}
            onClick={this.on_click}
            style={{position: 'relative'}}
        >
            <style>{`
            #ticket .ant-card-body {
                padding: 12px;
            }
            `}</style>
            <BuyModal
                visible={this.state.buy_visible}
                close={this.buy_close}
                ticket={this.props.ticket}
                event={this.props.event}
                contract_plugins={this.props.contract_plugins}
                coinbase={this.props.coinbase}
            />
            <CloseSaleModal
                visible={this.state.closesale_visible}
                close={this.closesale_close}
                ticket={this.props.ticket}
                event={this.props.event}
                contract_plugins={this.props.contract_plugins}
                coinbase={this.props.coinbase}
            />
            <OpenSaleModal
                visible={this.state.opensale_visible}
                close={this.opensale_close}
                ticket={this.props.ticket}
                event={this.props.event}
                contract_plugins={this.props.contract_plugins}
                coinbase={this.props.coinbase}
            />
            <div style={{position: 'absolute', zIndex: 1000, marginTop: -62}}>
                <TicketEventPopover
                    event_address={this.props.event.address.address}
                    hover={deployed}
                    on_enter={this.on_mouse.bind(this, true)}
                    on_leave={this.on_mouse.bind(this, false)}
                    pattern={pattern}
                    t={this.props.t}
                    big={!this.props.show_marketplace_link}
                />
                {
                    this.props.show_marketplace_link

                        ?
                        <TicketMarketplacePopover
                            event_address={this.props.event.address.address}
                            hover={deployed}
                            on_enter={this.on_mouse.bind(this, true)}
                            on_leave={this.on_mouse.bind(this, false)}
                            market={market}
                            t={this.props.t}
                        />

                        :
                        null
                }
                <TicketDetailsPopover
                    ticket_id={this.props.ticket.ticket_id}
                    hover={deployed}
                    on_enter={this.on_mouse.bind(this, true)}
                    on_leave={this.on_mouse.bind(this, false)}
                    big={!this.props.show_marketplace_link}
                    t={this.props.t}
                />
            </div>
            <div style={{position: 'absolute', zIndex: 1000, marginTop: 194 + 12}}>
                {bottom_popovers}
            </div>
            <Card
                onMouseEnter={this.on_mouse.bind(this, true)}
                onMouseLeave={this.on_mouse.bind(this, false)}
                style={{
                    height: 194,
                    width: 500,
                    background: `linear-gradient(to right, ${theme.primarydark0}, ${theme.dark2})`,
                    border: '0px',
                    borderTopLeftRadius: 6,
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 18,
                    borderTopRightRadius: 6,
                    boxShadow: this.state.real_hover || this.state.hovered ? '0 18px 19px rgba(0, 0, 0, 0.30)' : '0 9px 19px rgba(0,0,0,0.30)'
                }}
                hoverable={true}
            >
                <style>
                    {`
                        #ticket_body_${this.props.event.address.address} .ant-card {
                            background-image: ${pattern};
                            border: none;
                        }
                    `}
                </style>
                <div
                    id={`ticket_body_${this.props.event.address.address}`}
                    style={{
                        float: 'left'
                    }}
                >
                    <Card
                        style={{
                            height: 170,
                            width: 170,
                            borderRadius: 6,
                            padding: 10
                        }}
                        cover={
                            this.props.event.image
                                ?
                                <img alt='icon' src={this.props.strapi_url + this.props.event.image.url} style={{width: 150, height: 150, borderRadius: 6}}/>
                                :
                                null
                        }
                    />
                </div>
                <div id='crans' style={{width: 2, height: 194, marginTop: -12, background: `linear-gradient(${theme.bwhite} 60%, rgba(255,255,255,0) 0%)`, backgroundSize: '2px 21px', float: 'left', marginLeft: 12}}/>
                <div
                    style={{
                        height: 170,
                        width: 265,
                        marginLeft: 24,
                        float: 'left',
                    }}
                >
                    {tags}
                    <div style={{height: '70%', marginTop: '5%'}}>
                        <div className='parent' style={{width: 265, textAlign: 'center', height: '50%', paddingTop: '6.25%'}}>
                            <Textfit
                                mode='single'
                                max={30}
                                forceSingleModeWidth={true}
                                style={{
                                    color: theme.white,
                                    fontWeigth: 300
                                }}
                            >
                                {this.props.event.name}
                            </Textfit>
                        </div>
                        <div style={{height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            {
                                date
                                    ?
                                    <Typography.Text style={{fontSize: 40, color: theme.white, fontWeight: 100}}>{date}</Typography.Text>
                                    :
                                    null
                            }
                        </div>
                    </div>

                </div>
            </Card>
        </div>;
    }
}

export default I18N.withNamespaces(['tickets'])(Ticket);
