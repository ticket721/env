import * as React                          from 'react';
import { StrapiEvent }                     from '../../../utils/strapi/event';
import { I18N, I18NProps }                 from '../../../utils/misc/i18n';
import { Icon, Modal, Typography, Upload } from 'antd';
import { theme }                           from '../../../utils/theme';
import { AppState }                        from '../../../utils/redux/app_state';
import { connect }                         from 'react-redux';
import Strapi                              from 'strapi-sdk-javascript';
import { StrapiUpload }                    from '../../../utils/strapi/strapiupload';

export interface EditBannersProps {
    event: StrapiEvent;
    get_ref: (c: EditBanners) => void;
}

interface EditBannersRState {
    strapi_url: string;
    strapi: Strapi;
}

type MergedEditBannersProps = EditBannersProps & I18NProps & EditBannersRState;

export interface StrapiImage {
    id?: number;
    url?: string;
    uploaded: boolean;
    file?: string;
    b64?: string;
}

interface EditBannersState {
    value: StrapiImage[];
    loading: boolean;
    previewVisible: boolean;
    previewImage: any;
}

async function getBase64(img: any): Promise<string> {
    return new Promise<string>((ok: any, ko: any): void => {
        const reader = new FileReader();
        reader.addEventListener('load', () => ok(reader.result));
        reader.readAsDataURL(img);
    });
}

export class EditBanners extends React.Component<MergedEditBannersProps> {

    state: EditBannersState;

    constructor(props: MergedEditBannersProps) {
        super(props);

        this.state = {
            loading: false,
            value: this.props.event.banners

                ?
                this.props.event.banners.map((banner: StrapiUpload) => ({
                    id: banner.id,
                    url: banner.url,
                    uploaded: true
                }))

                :
                null,
            previewVisible: false,
            previewImage: null
        };

        props.get_ref(this);
    }

    handlePreviewCancel = (): void => {
        this.setState({
            previewVisible: false
        });
    }

    get_banners = async (message: any): Promise<number[]> => {
        if (this.state.value === null || this.state.value.length === 0) {
            return [];
        }

        const ret = [];

        for (const file of this.state.value) {

            if (file.uploaded === true) {
                ret.push(file.id);
            } else {
                try {
                    const form = new FormData();
                    form.append('files', file.file);
                    const res = await this.props.strapi.upload(form) as any[];
                    if (!res || !res.length) throw new Error('Invalid response');
                    ret.push(res[0].id);
                } catch (e) {
                    message.config({
                        top: 10,
                        duration: 2,
                        maxCount: 3,
                    });
                    message.error(this.props.t('edit_banners_upload_error'));
                    return null;
                }
            }
        }

        return ret;

    }

    handleChange = async (info: any): Promise<void> => {
        const value = [];
        for (const file of info.fileList) {
            if (file.raw) {
                value.push(file.raw);
            } else {
                value.push({
                    uploaded: false,
                    file: file.originFileObj,
                    b64: await getBase64(file.originFileObj)
                });
            }
        }
        return this.setState({
            value
        });

    }

    is_edited = (): boolean => {
        if (!this.props.event.banners && this.state.value.length === 0) return false;
        if (!this.props.event.banners && this.state.value) return true;
        const current = this.props.event.banners.map((banner: StrapiUpload): number => banner.id);
        const state = this.state.value.map((image: StrapiImage): number => image.id);
        if (state.length !== current.length) return true;
        if (state.indexOf(undefined) !== -1) return true;
        const diff = current.map((id: number, idx: number): boolean => (id !== state[idx]));
        return diff.indexOf(true) !== -1;

    }

    handlePreview = async (file: any): void => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    }

    render(): React.ReactNode {

        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className='ant-upload-text'>{this.props.t('edit_banners_upload_button')}</div>
            </div>
        );

        const limitUploadButton = (
            <div>
                <Icon type='exclamation' />
                <div className='ant-upload-text'>{this.props.t('edit_banners_upload_limit_button')}</div>
            </div>
        );

        const images = this.state.value ? this.state.value.map((image: StrapiImage, idx: number): any => {
                if (image.uploaded === true) {
                    return {
                        raw: image,
                        uid: idx.toString(),
                        name: 'image',
                        status: 'done',
                        url: this.props.strapi_url + image.url
                    };
                } else {
                    return {
                        raw: image,
                        uid: idx.toString(),
                        name: 'image',
                        status: 'done',
                        url: image.b64
                    };
                }
            })
            :
            [];

        const edited = this.is_edited();

        return <div id={'edit-banners'} style={{marginTop: 12}}>
            <Typography.Text style={{fontSize: 22, color: theme.dark2}}>{this.props.t('edit_banners_title')}</Typography.Text>
            <style>{`
                #edit-banners .ant-upload-list-picture .ant-upload-list-item, .ant-upload-list-picture-card .ant-upload-list-item {
                    ${edited ? `border: 1px solid ${theme.gold}` : ''}
                }
                #edit-banners .banners-uploader .ant-upload-list-item {
                    width: 200px;
                }
            `}</style>
            <div style={{marginTop: 12}}>
                <Upload
                    name='avatar'
                    listType='picture-card'
                    className='banners-uploader'
                    fileList={images}
                    onChange={this.handleChange}
                    onPreview={this.handlePreview}
                    disabled={images.length >= 6 ? true : false}
                >
                    {images.length >= 6 ? limitUploadButton : uploadButton}

                </Upload>
                <style>{`
                    .banner_preview .ant-modal-content {
                        background-color: ${theme.dark0}
                    }
                    
                    .banner_preview .ant-modal-close-x {
                        color: ${theme.primary};
                    }
                `}</style>
                <Modal wrapClassName={'banner_preview'} width={1000} visible={this.state.previewVisible} footer={null} onCancel={this.handlePreviewCancel}>
                    <div style={{padding: 24}}>
                        <img alt='example' style={{ width: '100%' }} src={this.state.previewImage} />
                    </div>
                </Modal>
            </div>
        </div>;

    }
}

const mapStateToProps = (state: AppState): EditBannersRState => ({
    strapi_url: state.app.config.strapi_endpoint,
    strapi: state.app.strapi
});

export default I18N.withNamespaces(['events'])(
    connect(mapStateToProps)(
        EditBanners
    )
) as React.ComponentType<EditBannersProps>;
