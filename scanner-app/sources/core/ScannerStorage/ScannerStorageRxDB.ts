import { ScannerStorage }                   from './ScannerStorage';
import { initial_store, RxDBStore }         from '../RxDBStoreType';
import { scannerstore, imagestore }         from '../../rxdb/schema';
import { RxDatabase, create, RxDocument }   from 'rxdb';
import { log }                              from '../log';
import { Image }                            from '../../redux/state';
import { DEV }                              from 'react-native-dotenv';

const ALLOWED_FIELDS = [
    'selected_network',
    'networks',
];

export class ScannerStorageRxDB implements ScannerStorage<void, RxDBStore> {

    private rxdb: RxDatabase = null;
    private store: RxDocument<RxDBStore> = null;
    private adapter: string = 'asyncstorage';

    public get = async (): Promise<RxDBStore> => {
        if (this.store === null) return null;

        const ret: RxDBStore = {} as RxDBStore;

        for (const allowed of ALLOWED_FIELDS) {
            ret[allowed] = this.store[allowed];
        }

        return ret;
    }

    public setAdapter = (adapter: string): void => {
        this.adapter = adapter;
    }

    public update = async (arg: Partial<RxDBStore>): Promise<void> => {
        if (this.store === null) {
            log.error('[ScannerStorageRxDB::update] cannot update null document');
            throw new Error('[ScannerStorageRxDB::update] cannot update null document');
        }
        
        const changeFunction = (oldData: RxDBStore): RxDBStore =>
            ({
                ...oldData,
                ...arg
            });
        
        await this.store.atomicUpdate(changeFunction);
    }

    public clear = async (): Promise<void> => {
        if (this.rxdb === null) {
            log.error('[ScannerStorageRxDB::clear] cannot remove database without instance');
            throw new Error('[ScannerStorageRxDB::clear] cannot remove database without instance');
        }

        await this.rxdb.remove();
        this.rxdb = null;
        this.store = null;
    }

    public setup = async (): Promise<void> => {
        if (!this.rxdb) {

            this.rxdb = await create({
                name: 'scanner',
                adapter: this.adapter,
                password: 'T721Rocks',
                multiInstance: false,
                ignoreDuplicate: !!process.env.MOCHA_TESTING
            });

            try {

                await this.rxdb.collection({
                    name: 'scannerstore',
                    schema: scannerstore
                });
                await this.rxdb.collection({
                    name: 'imagestore',
                    schema: imagestore
                });

            } catch (e) {
                /* istanbul ignore next */
                log.warn('[ScannerStorageRxDB::setup] collection creation failed');
                /* istanbul ignore next */
                await this.clear();

                /* istanbul ignore next */
                await this.rxdb.collection({
                    name: 'scannerstore',
                    schema: scannerstore
                });
                /* istanbul ignore next */
                await this.rxdb.collection({
                    name: 'imagestore',
                    schema: imagestore
                });

            }

        }

        let store = await this.rxdb.collections.scannerstore
            .findOne()
            .exec();

        if (store === null) {
            if (DEV) {
                initial_store.selected_network = '';
            }

            await this.rxdb.collections.scannerstore
                .insert(initial_store);

            store = await this.rxdb.collections.scannerstore
                .findOne()
                .exec();

        }

        this.store = store;

    }

    public get_image = async (image_hash: string): Promise<Image> => {
        const img = await this.rxdb.collections.imagestore.findOne({
            hash: image_hash
        }).exec();

        if (img) {
            return {
                uri_source: img.uri_source
            };
        }

        return null;
    }

    public store_image = async (img: Image, hash: string): Promise<void> =>
        this.rxdb.collections.imagestore.insert({
            uri_source: img.uri_source,
            hash
        })
}
