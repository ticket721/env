import * as RxDB from 'rxdb';
import * as PouchDBAdapterIdb from 'pouchdb-adapter-idb';

import ConfigSchema from './schemas/Config';
import AuthSchema from './schemas/Auth';

RxDB.plugin(PouchDBAdapterIdb);

const collections = [
    {
        name: 'config',
        schema: ConfigSchema,
        sync: true
    },
    {
        name: 'auth',
        schema: AuthSchema,
        sync: true
    }
];

let saved_instance: RxDB.RxDatabase = null;

export const getRxDB = async (): Promise<RxDB.RxDatabase> => {

    if (!saved_instance) {
        try {
            saved_instance = await RxDB.create({
                name: 't721browserdb',
                adapter: 'idb',
                password: 'ethereumRocks',
                multiInstance: false
            });
        } catch (e) {
            console.error(e);
            console.log('Error while creating database: erasing and retrying');
            saved_instance = await RxDB.create({
                name: 't721browserdb',
                adapter: 'idb',
                password: 'ethereumRocks',
                multiInstance: false,
                ignoreDuplicate: true
            });
            await saved_instance.remove();
            console.log('Database t721browserdb deleted');
            saved_instance = await RxDB.create({
                name: 't721browserdb',
                adapter: 'idb',
                password: 'ethereumRocks',
                multiInstance: false
            });
            console.log('Database t721browserdb rebuilt');
        }

        await Promise.all(collections.map(async (colData: any) => saved_instance.collection(colData)));
    }

    return saved_instance;
};
