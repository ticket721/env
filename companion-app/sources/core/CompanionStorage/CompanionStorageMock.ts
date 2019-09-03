import { CompanionStorage }         from './CompanionStorage';
import { initial_store, RxDBStore } from '../RxDBStoreType';
import { Image }                    from '../../redux/state';

export class CompanionStorageMock implements CompanionStorage<void, RxDBStore> {

    private store: RxDBStore = null;
    private readonly imagestore: {[key: string]: Image} = {};
    private throwed: boolean = false;

    public setup = async (): Promise<void> => {
        if (this.store === null) {
            this.store = initial_store;
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
