import { StrapiAddress } from './address';
import { StrapiUpload }  from './strapiupload';

export interface StrapiQueuedEvent {
    address: string;
    banners: StrapiUpload[];
    image: StrapiUpload;
    description: string;
    name: string;
    owner: StrapiAddress;
    transaction_hash: string;
    type: any;
    start: string;
    end: string;
    location: any;
    creation: string;
    id: number;
}
