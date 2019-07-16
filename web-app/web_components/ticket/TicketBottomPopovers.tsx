import { Typography } from 'antd';
import posed          from 'react-pose';
import * as React     from 'react';
import { theme }      from '../../utils/theme';

const Popover = posed.div({
    hoverable: true,
    hidden: {
        scale: 0.8,
        opacity: 0,
        transition: {
            delay: 250
        },
        boxShadow: '0px 0px 0px rgba(0,0,0,0.50)',
        y: -25
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

export interface TicketSellPopoverProps {
    hover: boolean;
    t: any;
    on_enter: () => void;
    on_leave: () => void;
    on_click: () => void;
}

export class TicketSellPopover extends React.Component<TicketSellPopoverProps> {
    render(): React.ReactNode {
        return <Popover
            pose={this.props.hover ? 'visible' : 'hidden'}
            onMouseEnter={this.props.on_enter}
            onMouseLeave={this.props.on_leave}
            style={{borderRadius: 5, float: 'left', marginLeft: 62, background: theme.dark2, cursor: 'pointer'}}
        >
            <div
                style={{
                    height: 50,
                    width: 400 - 24,
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={this.props.on_click}
            >
                <Typography.Text style={{fontSize: 18, color: theme.white}}>{this.props.t('bottom_popover_sell_title')}</Typography.Text>
            </div>
        </Popover>;

    }
}

export interface TicketCloseSalePopoverProps {
    hover: boolean;
    t: any;
    on_enter: () => void;
    on_leave: () => void;
    on_click: () => void;
}

// tslint:disable-next-line:max-classes-per-file
export class TicketCloseSalePopover extends React.Component<TicketCloseSalePopoverProps> {
    render(): React.ReactNode {
        return <Popover
            pose={this.props.hover ? 'visible' : 'hidden'}
            onMouseEnter={this.props.on_enter}
            onMouseLeave={this.props.on_leave}
            style={{borderRadius: 5, float: 'left', marginLeft: 12, background: theme.danger, cursor: 'pointer'}}
        >
            <div
                style={{
                    height: 50,
                    width: 229 - 12,
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={this.props.on_click}
            >
                <Typography.Text style={{fontSize: 18, color: theme.white}}>❕ {this.props.t('bottom_popover_close_sale_title')} ❕</Typography.Text>
            </div>
        </Popover>;

    }
}

export interface TicketBuyPopoverProps {
    hover: boolean;
    t: any;
    on_enter: () => void;
    on_leave: () => void;
    on_click: () => void;
}

// tslint:disable-next-line:max-classes-per-file
export class TicketBuyPopover extends React.Component<TicketBuyPopoverProps> {
    render(): React.ReactNode {
        return <Popover
            pose={this.props.hover ? 'visible' : 'hidden'}
            onMouseEnter={this.props.on_enter}
            onMouseLeave={this.props.on_leave}
            style={{borderRadius: 5, float: 'left', marginLeft: 62, background: theme.dark2, cursor: 'pointer'}}
        >
            <div
                style={{
                    height: 50,
                    width: 400 - 24,
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={this.props.on_click}
            >
                <Typography.Text style={{fontSize: 18, color: theme.white}}>{this.props.t('bottom_popover_buy_title')}</Typography.Text>
            </div>
        </Popover>;

    }
}
