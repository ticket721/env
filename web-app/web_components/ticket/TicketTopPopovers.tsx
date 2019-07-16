import { message, Spin, Typography } from 'antd';
import posed                         from 'react-pose';
import * as React                    from 'react';
import { routes }                    from '../../utils/routing';
import { theme }                     from '../../utils/theme';

const Popover = posed.div({
    hoverable: true,
    hidden: {
        scale: 0.8,
        opacity: 0,
        transition: {
            delay: 250
        },
        boxShadow: '0px 0px 0px rgba(0,0,0,0.50)',
        y: 25
    },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            delay: 75
        },
        boxShadow: '0px 4px 8px rgba(0,0,0,0.50)',
        y: 0
    },
    hover: {
        scale: 1.05
    }
});

export interface ITicketEventPopoverProps {
    event_address: string;
    hover: boolean;
    on_enter: () => void;
    on_leave: () => void;
    pattern: string;
    big: boolean;
    t: any;
}

export class TicketEventPopover extends React.Component<ITicketEventPopoverProps> {
    render(): React.ReactNode {
        return <Popover
            pose={this.props.hover ? 'visible' : 'hidden'}
            onMouseEnter={this.props.on_enter}
            onMouseLeave={this.props.on_leave}
            style={{borderRadius: 5, float: 'left', marginLeft: 12, background: this.props.pattern, cursor: 'pointer'}}
        >
            <routes.Link route='event' params={{address: this.props.event_address}}>
                <div
                    style={{
                        height: 50,
                        width: this.props.big ? 229 : 129 - 12,
                        borderRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography.Text style={{fontSize: 18, color: theme.white}}>{this.props.t('top_popover_event_title')}</Typography.Text>
                </div>
            </routes.Link>
        </Popover>;

    }
}

export interface ITicketMarketplacePopoverProps {
    market: boolean;
    event_address: string;
    hover: boolean;
    on_enter: () => void;
    on_leave: () => void;
    t: any;
}

// tslint:disable-next-line:max-classes-per-file
export class TicketMarketplacePopover extends React.Component<ITicketMarketplacePopoverProps> {

    no_marketplace_warning = (): void => {
        message.config({
            top: 10,
            duration: 2,
            maxCount: 3,
        });
        message.warn(this.props.t('top_popover_marketplace_warning'));

    }

    render(): React.ReactNode {

        return <Popover
            pose={this.props.hover ? 'visible' : 'hidden'}
            onMouseEnter={this.props.on_enter}
            onMouseLeave={this.props.on_leave}
            style={{borderRadius: 5, float: 'left', marginLeft: 12, background: theme.dark2, cursor: this.props.market ? 'pointer' : 'not-allowed'}}
        >
            {this.props.market
                ?
                <routes.Link route='marketplace' params={{event: this.props.event_address}}>
                    <div
                        style={{
                            height: 50,
                            width: 229 - 12,
                            borderRadius: 5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography.Text
                            style={{
                                fontSize: 18,
                                color: theme.white
                            }}
                        >
                            {this.props.t('top_popover_marketplace_title')}
                        </Typography.Text>
                    </div>
                </routes.Link>
                :
                <div
                    style={{
                        height: 50,
                        width: 229 - 12,
                        borderRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onClick={this.no_marketplace_warning}
                >
                    <Typography.Text
                        style={{
                            fontSize: 18,
                            color: theme.dark7
                        }}
                    >
                        {this.props.market !== null ? this.props.t('top_popover_marketplace_title') : <Spin/>}
                    </Typography.Text>
                </div>
            }
        </Popover>;

    }
}

export interface TicketDetailsPopoverProps {
    ticket_id: number;
    hover: boolean;
    on_enter: () => void;
    on_leave: () => void;
    t: any;
    big: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export class TicketDetailsPopover extends React.Component<TicketDetailsPopoverProps> {
    render(): React.ReactNode {
        return <Popover
            pose={this.props.hover ? 'visible' : 'hidden'}
            onMouseEnter={this.props.on_enter}
            onMouseLeave={this.props.on_leave}
            style={{borderRadius: 5, float: 'left', marginLeft: 12, background: theme.dark2, cursor: 'pointer'}}
        >
            <routes.Link route='ticket' params={{id: this.props.ticket_id.toString()}}>
                <div
                    style={{
                        height: 50,
                        width: this.props.big ? 229 : 129 - 12,
                        borderRadius: 5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Typography.Text style={{fontSize: 18, color: theme.white}}>{this.props.t('top_popover_details_title')}</Typography.Text>
                </div>
            </routes.Link>
        </Popover>;

    }
}
