import { ScannerStorageRxDB }                           from './ScannerStorageRxDB';
import {
    clear, clear_without_setup, get_inexisting_image,
    get_with_setup,
    get_without_setup, set_get_image,
    setup,
    update,
    update_array,
    update_without_setup
}                                                       from './ScannerStorage.test';
import { plugin }                                       from 'rxdb';

// tslint:disable-next-line
plugin(require('pouchdb-adapter-memory'));

describe('ScannerStorageRxDB', (): void => {

    beforeEach(function(): void {
        this.store = new ScannerStorageRxDB();
        this.store.setAdapter('memory');
    });

    it('setup', setup);

    it('get - with setup', get_with_setup);

    it('get - without setup', get_without_setup);

    it('update', update);

    it('update - array', update_array);

    it('update - without setup', update_without_setup);

    it('clear', clear);

    it('clear - without setup', clear_without_setup);

    it('get inexisting image', get_inexisting_image);

    it('store + get image', set_get_image);

});
