import { StrapiUpload }        from './strapiupload';

export interface StrapiEvent {
    id: number;
    address: any;
    banners: StrapiUpload[];
    tickets: any[];
    image: StrapiUpload;
    description: string;
    name: string;
    owner: any;
    eventcontract: any;
    start: string;
    end: string;
    location: any;
    creation: string;
}
