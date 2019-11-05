import { ScannerStorage }       from './ScannerStorage';
import { initial_store }        from '../RxDBStoreType';
import { expect, use }          from 'chai';
import * as chaiAsPromised      from 'chai-as-promised';
import { ScannerStorageMock }   from './ScannerStorageMock';

use(chaiAsPromised);

export async function setup(): Promise<void> {

    return expect(this.store.setup()).to.be.fulfilled;

}

export async function get_with_setup(): Promise<void> {

    await expect(this.store.setup()).to.be.fulfilled;
    const store = await this.store.get();
    expect(store).to.deep.equal(initial_store);

}

export async function get_without_setup(): Promise<void> {

    const store = await this.store.get();
    expect(store).to.equal(null);

}

export async function update(): Promise<void> {
    await expect(this.store.setup()).to.be.fulfilled;
    await this.store.update({
        selected_network: 'test'
    });

    expect((await this.store.get()).selected_network).to.equal('test');

}

export async function update_array(): Promise<void> {
    await expect(this.store.setup()).to.be.fulfilled;
    await this.store.update({
        networks: []
    });
    const nets = (await this.store.get()).networks;
    expect(nets.length).to.equal(0);

}

export async function update_without_setup(): Promise<void> {
    return expect(this.store.update({
        selected_network: 'test'
    })).to.eventually.be.rejected;

}

export async function clear(): Promise<void> {

    await expect(this.store.setup()).to.be.fulfilled;
    await this.store.update({
        networks: []
    });

    const nets = (await this.store.get()).networks;
    expect(nets.length).to.equal(0);

    await this.store.clear();

    const cleared = (await this.store.get());
    expect(cleared).to.equal(null);

}

export async function clear_without_setup(): Promise<void> {

    return expect(this.store.clear()).to.eventually.be.rejected;

}

export async function get_inexisting_image(): Promise<void> {

    await expect(this.store.setup()).to.be.fulfilled;

    const image = await this.store.get_image('def');

    expect(image).to.equal(null);

}

export async function set_get_image(): Promise<void> {

    await expect(this.store.setup()).to.be.fulfilled;

    delete process.env.STORAGE_MOCK_THROW;
    await expect(this.store.store_image({
        uri_source: 'abc'
    }, 'def')).to.be.fulfilled;

    const image = await this.store.get_image('def');

    expect(image.uri_source).to.equal('abc');

}

describe('ScannerStorage', (): void => {

    beforeEach(function (): void {
        this.store = new ScannerStorageMock() as ScannerStorage;
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
