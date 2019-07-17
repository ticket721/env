import * as React                                  from 'react';
import { EventCreationData, EventCreationSetData } from './EventCreationData';
import { Typography }                              from 'antd';
import Uppy            from '@uppy/core';
import { Dashboard }   from '@uppy/react';
import Url             from '@uppy/url';
import GDrive          from '@uppy/google-drive';
import { Store }       from 'redux';
import * as ReduxStore from '@uppy/store-redux';

import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import { theme }       from '../../../utils/theme';

// Props

export interface EventCreationImageProps {
    form_data: EventCreationData;
    set_data: EventCreationSetData;
    t: any;
    store: Store;
}

export default class EventCreationImage extends React.Component<EventCreationImageProps> {

    // @ts-ignore
    uppy: Uppy;

    constructor(props: EventCreationImageProps) {
        super(props);

        // @ts-ignore
        this.uppy = (new Uppy({
            id: 'image',
            autoProceed: true,
            debug: false,
            restrictions: {
                maxNumberOfFiles: 1,
                minNumberOfFiles: 1,
                maxFileSize: 20000000,
                allowedFileTypes: [
                    '.jpg', '.jpeg', '.png', '.gif'
                ],
            },
            store: ReduxStore({
                store: this.props.store,
                id: 'image'
            })
        }))
            .use(Url, {
                companionUrl: 'https://companion.uppy.io/',
            })
            .use(GDrive, {
                companionUrl: 'https://companion.uppy.io/',
            });

        this.uppy.on('upload', (files: any): void => {

            const generate_formdata = (): FormData => {
                const data = new FormData();

                for (const file of files.fileIDs) {
                    const file_data = this.uppy.getFile(file);
                    data.append('files', file_data.data, file_data.name);
                }

                return data;
            };

            this.props.set_data('image', generate_formdata);
        });

    }

    render(): React.ReactNode {
        return <div style={{marginTop: 30}}>
            <Typography.Text style={{fontSize: 32, color: theme.dark2}}>{this.props.t('image_title')}</Typography.Text>
            <br/>
            <br/>
            <div style={{marginLeft: 10}}>
                <Typography.Text style={{fontSize: 18, color: theme.dark3}}>{this.props.t('image_description')}</Typography.Text>
                <br/>
                <br/>
                <Dashboard
                    uppy={this.uppy}
                    hideUploadButton={true}
                    height={400}
                    //plugins={['GoogleDrive', 'Url']}

                />
            </div>
        </div>;
    }
}
