import * as React                   from 'react';
import { Button, Card, Typography } from 'antd';
import { I18N }                     from '@utils/misc/i18n';
import { StrapiMarketer }           from '@utils/strapi/marketer';
import { StrapiApprover }           from '@utils/strapi/approver';
import { FullPageLoader }           from '../../loaders/FullPageLoader';
import { MarketerEnabled }          from '../misc/MarketerEnabled';
import { routes }                   from '../../../utils/routing';
import { StrapiEvent }              from '../../../utils/strapi/event';
import { theme }                    from '../../../utils/theme';

export interface TicketCharacsProps {
    event?: StrapiEvent;
    marketer: StrapiMarketer;
    approver: StrapiApprover;
    t: any;
}

type MergedTicketCharacsProps = TicketCharacsProps;

const MarketerDisplayer = I18N.withNamespaces(['marketers'])(({t, marketer, event}: any): React.ReactNode =>
        <div style={{textAlign: 'center'}}>
            <br/>
            <Typography.Text style={{fontSize: 20, color: theme.dark2}}>{t('marketplace_strategy')}</Typography.Text>
            <br/>
            <br/>
            <div style={{marginLeft: 16}}>
                <Typography.Text style={{fontSize: 16, color: theme.dark3}}>{t(`${marketer}_concise_description`)}</Typography.Text>
                {
                    MarketerEnabled[marketer] === true && event
                        ?
                        <div style={{textAlign: 'center'}}>
                            <br/>
                            <routes.Link route={'marketplace'} params={{event: event.address.address}}>
                                <Button>
                                    {t('go_to_marketplace')}
                                </Button>
                            </routes.Link>
                        </div>
                        :
                        null
                }
            </div>
        </div>
);

const ApproverDisplayer = I18N.withNamespaces(['approvers'])(({t, approver}: any): React.ReactNode =>
    <div style={{textAlign: 'center'}}>
        <br/>
        <Typography.Text style={{fontSize: 20, color: theme.dark2}}>{t('transfer_strategy')}</Typography.Text>
        <br/>
        <br/>
        <div style={{marginLeft: 16}}>
            <Typography.Text style={{fontSize: 16, color: theme.dark3}}>{t(`${approver}_concise_description`)}</Typography.Text>
        </div>
    </div>
);

export default class TicketCharacs extends React.Component<MergedTicketCharacsProps> {
    render(): React.ReactNode {

        if (!this.props.marketer || !this.props.approver) {

            return <Card
                style={{
                    width: '100%',
                    height: '100%'
                }}
                title={this.props.t('characs_title')}
                size={'small'}
            >
                <FullPageLoader/>
            </Card>;

        }

        return <Card
            style={{
                width: '100%',
                height: '100%'
            }}
            title={this.props.t('characs_title')}
            size={'small'}
        >
            <MarketerDisplayer marketer={this.props.marketer.name} event={this.props.event}/>
            <br/>
            <br/>
            <ApproverDisplayer approver={this.props.approver.name}/>

        </Card>;
    }
}
