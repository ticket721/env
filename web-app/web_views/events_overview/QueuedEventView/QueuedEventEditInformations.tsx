import { StrapiEvent }                 from '../../../utils/strapi/event';
import * as React                      from 'react';
import EditName                        from '../../../web_components/event/display/EditName';
import { Button, message, Typography } from 'antd';
import { I18N, I18NProps } from '../../../utils/misc/i18n';
import { theme }           from '../../../utils/theme';
import Strapi           from 'strapi-sdk-javascript';
import { AppState }              from '../../../utils/redux/app_state';
import { connect }               from 'react-redux';
import { sign }                  from '../../../utils/misc/Web3TypedSignature';
import { Dispatch }              from 'redux';
import { StrapiHelper }              from '../../../utils/StrapiHelper';
import EditDescription               from '../../../web_components/event/display/EditDescription';
import EditDates                     from '../../../web_components/event/display/EditDates';
import EditLocation                  from '../../../web_components/event/display/EditLocation';
import EditImageC, { EditImage }     from '../../../web_components/event/display/EditImage';
import EditBannersC, { EditBanners } from '../../../web_components/event/display/EditBanners';
import { StrapiQueuedEvent }         from '../../../utils/strapi/queuedevent';

export interface QueuedEventEditInformationsProps {
    event: StrapiQueuedEvent;
    cancel: () => void;
}

interface QueuedEventEditInformationsRState {
    strapi: Strapi;
    web3: any;
    coinbase: string;
}

interface QueuedEventEditInformationsRDispatch {
    resetEvent: () => void;
    resetCoinbase: (coinbase: string) => void;
}

type MergedQueuedEventEditInformationsProps = QueuedEventEditInformationsProps & I18NProps & QueuedEventEditInformationsRState & QueuedEventEditInformationsRDispatch;

interface QueuedEventEditInformationsState {
    values: any;
    saving: boolean;
    image_ref: EditImage;
    banners_ref: EditBanners;
}

class QueuedQueuedEventEditInformations extends React.Component<MergedQueuedEventEditInformationsProps, QueuedEventEditInformationsState> {

    state: QueuedEventEditInformationsState = {
        values: {},
        saving: false,
        image_ref: null,
        banners_ref: null
    };

    set_values = (field: string, value: any): void => {
        this.setState({
            values: {
                ...this.state.values,
                [field]: value
            }
        });
    }

    on_save = async (): Promise<void> => {
        this.setState({
            saving: true
        });

        let start = this.props.event.start ? new Date(this.props.event.start).getTime().toString() : 'none';
        let end = this.props.event.end ? new Date(this.props.event.end).getTime().toString() : 'none';

        if (this.state.values.dates) {

            if (this.state.values.dates.start) {
                start = this.state.values.dates.start.valueOf().toString();
            }

            if (this.state.values.dates.end) {
                end = this.state.values.dates.end.valueOf().toString();
            }

        }

        let location = this.props.event.location ? JSON.stringify(this.props.event.location) : 'none';

        if (this.state.values.location) {
            location = JSON.stringify(this.state.values.location);
        }

        const image = await this.state.image_ref.get_image(message);
        const banners = await this.state.banners_ref.get_banners(message);

        sign(this.props.web3, this.props.coinbase, [
                {
                    type: 'string',
                    name: 'name',
                    value: this.state.values.name || this.props.event.name
                },
                {
                    type: 'string',
                    name: 'description',
                    value: this.state.values.description || this.props.event.description
                },
                {
                    type: 'string',
                    name: 'start',
                    value: start
                },
                {
                    type: 'string',
                    name: 'end',
                    value: end
                },
                {
                    type: 'string',
                    name: 'location',
                    value: location
                },
                {
                    type: 'string',
                    name: 'image',
                    value: image !== null ? image.toString() : null
                },
                {
                    type: 'string',
                    name: 'banners',
                    value: JSON.stringify(banners)
                }
            ]
        ).then(async (res: any): Promise<void> => {
            try {
                await this.props.strapi.updateEntry('queuedevents', this.props.event.id.toString(), {
                    body: res.payload,
                    signature: res.result
                });

                this.setState({
                    saving: false
                });

                message.config({
                    top: 10,
                    duration: 2,
                    maxCount: 3,
                });
                message.success(this.props.t('event_edit_informations_upload_success'));

                this.props.resetEvent();
                this.props.resetCoinbase(this.props.coinbase);
                this.props.cancel();

            } catch (e) {
                this.setState({
                    saving: false
                });
                message.config({
                    top: 10,
                    duration: 2,
                    maxCount: 3,
                });
                message.error(this.props.t('event_edit_informations_upload_error'));
            }
        }).catch((e: Error): void => {
            this.setState({
                saving: false
            });
            message.config({
                top: 10,
                duration: 2,
                maxCount: 3,
            });
            message.error(this.props.t('event_edit_informations_upload_error'));
        });

    }

    set_image_ref = (ref: EditImage): void => {
        this.setState({
            image_ref: ref
        });
    }

    set_banners_ref = (ref: EditBanners): void => {
        this.setState({
            banners_ref: ref
        });
    }

    render(): React.ReactNode {

        return <div>
            <Typography.Text style={{fontSize: 42, color: theme.primary}}>{this.props.t('event_edit_informations_title')}</Typography.Text>
            <div style={{width: '50%', marginTop: 24, marginBottom: 24}}>
                <EditName
                    event={(this.props.event as any) as StrapiEvent}
                    on_change={this.set_values.bind(this, 'name')}
                />
                <br/>
                <EditDescription
                    event={(this.props.event as any) as StrapiEvent}
                    on_change={this.set_values.bind(this, 'description')}
                />
                <br/>
                <EditDates
                    event={(this.props.event as any) as StrapiEvent}
                    on_change={this.set_values.bind(this, 'dates')}
                />
                <br/>
                <EditLocation
                    event={(this.props.event as any) as StrapiEvent}
                    on_change={this.set_values.bind(this, 'location')}
                />
            </div>
            <Typography.Text style={{fontSize: 42, color: theme.primary}}>{this.props.t('event_edit_images_title')}</Typography.Text>
            <div style={{width: '50%', marginTop: 24}}>
                <EditImageC
                    event={(this.props.event as any) as StrapiEvent}
                    get_ref={this.set_image_ref}
                />
                <EditBannersC
                    event={(this.props.event as any) as StrapiEvent}
                    get_ref={this.set_banners_ref}
                />
            </div>
            <br/>
            <Button type='primary' style={{marginTop: 24}} onClick={this.on_save}>{this.props.t('event_edit_informations_save')}</Button>
        </div>;
    }
}

const mapStateToProps = (state: AppState): QueuedEventEditInformationsRState => ({
    strapi: state.app.strapi,
    web3: state.vtxconfig.web3,
    coinbase: state.vtxconfig.coinbase
});

const mapDispatchToProps = (dispatch: Dispatch, ownProps: QueuedEventEditInformationsProps): QueuedEventEditInformationsRDispatch => ({
    resetEvent: (): void => {
        StrapiHelper.resetEntry(dispatch, 'queuedevents', ownProps.event.id.toString());
        StrapiHelper.resetEntries(dispatch, 'queuedevents', {address: ownProps.event.address});
    },
    resetCoinbase: (coinbase: string): void => StrapiHelper.resetEntries(dispatch, 'addresses', {address: coinbase.toLowerCase()})
});

export default I18N.withNamespaces(['events'])(
    connect(mapStateToProps, mapDispatchToProps)(
        QueuedQueuedEventEditInformations
    )
) as React.ComponentType<QueuedEventEditInformationsProps>;
