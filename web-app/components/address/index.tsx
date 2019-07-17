import * as React                 from 'react';
import { StrapiAddress }          from '../../utils/strapi/address';
import { routes }                 from '@utils/routing';
import { Icon, Spin, Typography } from 'antd';
import StrapiCall                 from '@components/strapi';
import { StrapiHelper }           from '../../utils/StrapiHelper';
import { I18N, I18NProps }        from '../../utils/misc/i18n';

export interface AddressProps {
    address: StrapiAddress;
    size: number;
    color?: string;
}

type MergedAddressProps = AddressProps & I18NProps;

class Address extends React.Component<MergedAddressProps> {
    render(): React.ReactNode {
        if (!this.props.address) {
            return <Spin/>;
        }

        if (this.props.address.event === true) {

            return <StrapiCall
                calls={{
                    event: StrapiHelper.getEntry('events', this.props.address.linked_event.id || this.props.address.linked_event)
                }}
            >
                {({event}: any): React.ReactNode => {
                    if (!event) {
                        return <Spin/>;
                    } else {
                        if (event.length && event[0].data) {
                            return <routes.Link route={'event'} params={{address: event[0].data.address.address}}>
                                <Typography.Text style={{fontSize: this.props.size, cursor: 'pointer', color: this.props.color}}>
                                    {event[0].data.name}
                                </Typography.Text>
                            </routes.Link>;
                        } else {
                            return <Typography.Text type='warning' style={{fontSize: this.props.size, color: this.props.color}}>
                                <Icon type='warning'/> {this.props.t('fetch_error')}
                            </Typography.Text>;
                        }
                    }
                }}
            </StrapiCall>;
        } else {
            return <routes.Link route={'account'} params={{address: this.props.address.address}}>
                <Typography.Text style={{fontSize: this.props.size, cursor: 'pointer', color: this.props.color}}>
                    {
                        this.props.address.username
                            ?
                            this.props.address.username
                            :
                            `${this.props.t('user')} ${this.props.address.id}`
                    }
                </Typography.Text>
            </routes.Link>;
        }

    }
}

export default I18N.withNamespaces(['entities'])(Address) as React.ComponentType<AddressProps>;
