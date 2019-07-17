import { Plugin }               from '@uppy/core';
import { EventCreationSetData } from '../../web_views/events_overview/EventCreationForm/EventCreationData';

export class UppyCustomUpload extends Plugin {

    set_data: EventCreationSetData;
    field: string;

    constructor (uppy: any, opts: any) {
        super(uppy, opts);
        this.id = opts.id || 'custom-upload';
        this.type = 'uploader';
        this.set_data = opts.set_data;
        this.field = opts.field;
    }

    upload = (files: any[]): any => {
    }

    install = (): void => {
        this.uppy.addUploader(this.upload);
    }

    uninstall = (): void => {
        this.uppy.removeUploader(this.upload);
    }

}
