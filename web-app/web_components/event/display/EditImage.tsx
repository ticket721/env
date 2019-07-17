import * as React                            from 'react';
import { StrapiEvent }                       from '../../../utils/strapi/event';
import { I18N, I18NProps }                   from '../../../utils/misc/i18n';
import { Icon, Typography, Upload } from 'antd';
import { theme }                             from '../../../utils/theme';
import { AppState }                          from '../../../utils/redux/app_state';
import { connect }                           from 'react-redux';
import Strapi                                from 'strapi-sdk-javascript';

export interface EditImageProps {
    event: StrapiEvent;
    get_ref: (c: EditImage) => void;
}

interface EditImageRState {
    strapi_url: string;
    strapi: Strapi;
}

type MergedEditImageProps = EditImageProps & I18NProps & EditImageRState;

export interface StrapiImage {
    id?: number;
    url?: string;
    uploaded: boolean;
    file?: string;
    b64?: string;
}

interface EditImageState {
    value: StrapiImage;
    loading: boolean;
}

async function getBase64(img: any): Promise<string> {
    return new Promise<string>((ok: any, ko: any): void => {
        const reader = new FileReader();
        reader.addEventListener('load', () => ok(reader.result));
        reader.readAsDataURL(img);
    });
}

export class EditImage extends React.Component<MergedEditImageProps> {

    state: EditImageState;

    constructor(props: MergedEditImageProps) {
        super(props);

        this.state = {
            loading: false,
            value: this.props.event.image

                ?
                {
                    id: this.props.event.image.id,
                    url: this.props.event.image.url,
                    uploaded: true
                }

                :
                null
        };

        props.get_ref(this);
    }

    get_image = async (message: any): Promise<number> => {
        if (this.state.value === null) {
            return null;
        }

        if (this.state.value.uploaded === true) {
            return this.state.value.id;
        } else {
            try {
                const form = new FormData();
                form.append('files', this.state.value.file);
                const res = await this.props.strapi.upload(form) as any[];
                if (!res || !res.length) throw new Error('Invalid response');
                return res[0].id;
            } catch (e) {
                message.config({
                    top: 10,
                    duration: 2,
                    maxCount: 3,
                });
                message.error(this.props.t('edit_image_upload_error'));
                return null;
            }
        }

    }

    handleChange = async (info: any): Promise<void> => {
        switch (info.file.status) {
            case 'loading':
                return this.setState({
                    loading: true
                });
            case 'done':
                return this.setState({
                    loading: false,
                    value: {
                        uploaded: false,
                        file: info.file.originFileObj,
                        b64: await getBase64(info.file.originFileObj)
                    }
                });
        }

    }

    is_edited = (): boolean => {
        const current = this.props.event.image ? this.props.event.image.id : null;

        if (current === null && this.state.value !== null) return true;
        return current && this.state.value && current !== this.state.value.id;

    }

    render(): React.ReactNode {

        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className='ant-upload-text'>{this.props.t('edit_image_upload_button')}</div>
            </div>
        );

        const edited = this.is_edited();

        return <div id={'edit-image'}>
            <Typography.Text style={{fontSize: 22, color: theme.dark2}}>{this.props.t('edit_image_title')}</Typography.Text>
            <style>{`
                #edit-image .ant-upload.ant-upload-select-picture-card {
                    ${edited ? `border-color: ${theme.gold}` : ''}
                }
            `}</style>
            <div style={{marginTop: 12}}>
                <Upload
                    name='avatar'
                    listType='picture-card'
                    className='avatar-uploader'
                    showUploadList={false}
                    onChange={this.handleChange}
                >
                    {this.state.value ? <img src={this.state.value.url ? this.props.strapi_url + this.state.value.url : this.state.value.b64} width={250} alt='avatar' /> : uploadButton}
                </Upload>
            </div>
        </div>;

    }
}

const mapStateToProps = (state: AppState): EditImageRState => ({
    strapi_url: state.app.config.strapi_endpoint,
    strapi: state.app.strapi
});

export default I18N.withNamespaces(['events'])(
    connect(mapStateToProps)(
        EditImage
    )
) as React.ComponentType<EditImageProps>;
