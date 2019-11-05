import { ScannerStorage }           from './ScannerStorage';
import { RxDBStore }                from '../RxDBStoreType';
import { Image }                    from '../../redux/state';

export class ScannerStorageMock implements ScannerStorage<void, RxDBStore> {

    public store: RxDBStore = null;
    private readonly imagestore: {[key: string]: Image} = {};
    private throwed: boolean = false;

    public setup = async (): Promise<void> => {
        if (this.store === null) {
            this.store = {
                networks: [
                    {
                        name: 'Mainnet',
                        strapi_url: 'https://api.ticket721.com',
                        eth_node_url: 'https://geth.ticket721.com',
                        events: [null]
                    },
                    {
                        name: 'Rinkeby',
                        strapi_url: 'https://api.rinkeby.ticket721.com',
                        eth_node_url: 'https://geth.rinkeby.ticket721.com',
                        events: [null]
                    }
                ],
                selected_network: 'Rinkeby'
            };
        }
    }

    public get = async (): Promise<RxDBStore> => this.store;

    public update = async (data: Partial<RxDBStore>): Promise<void> => {
        if (this.store === null) throw new Error('');
        this.store = {
            ...this.store,
            ...data
        };
    }

    public clear = async (): Promise<void> => {
        if (this.store === null) throw new Error('');
        this.store = null;
    }

    public get_image = async (image_hash: string): Promise<Image> =>
        this.imagestore[image_hash] || null

    public store_image = async (img: Image, hash: string): Promise<void> => {
        if (process.env.STORAGE_MOCK_THROW === 'true' && !this.throwed) {
            this.throwed = true;
            throw new Error('on purpose');
        }
        this.imagestore[hash] = img;
    }
}
