import { expect, use }                      from 'chai';
import * as chaiAsPromised                  from 'chai-as-promised';
import { spy, assert }                      from 'sinon';
import { CompanionCore }                    from './CompanionCore';
import { CompanionStorageMock }             from './CompanionStorage/CompanionStorageMock';
import { CompanionIdentifierRetrieverMock } from './CompanionIdentifierRetriever/CompanionIdentifierRetrieverMock';
import { CompanionWalletMock }                  from './CompanionWallet/CompanionWalletMock';
import { log }                                  from './log';
import Logger = require('js-logger');
import { RxDBNetwork }                          from './RxDBStoreType';
import { CompanionStorage }                     from './CompanionStorage/CompanionStorage';
import { CompanionIdentifierRetriever }         from './CompanionIdentifierRetriever/CompanionIdentifierRetriever';
import { CompanionWallet }                      from './CompanionWallet/CompanionWallet';
import { CompanionServerLinkMock, mock_ticket } from './CompanionServerLink/CompanionServerLinkMock';
import { CompanionServerLink }                  from './CompanionServerLink/CompanionServerLink';
import { NetworkInfos, Ticket }                 from '../redux/state';

log.setLevel(Logger.OFF);

use(chaiAsPromised);

describe('CompanionCore', (): void => {

    beforeEach((): void => {
        this.storage = new CompanionStorageMock();

        this.identifier_retriever = new CompanionIdentifierRetrieverMock();

        this.wallet = new CompanionWalletMock();

        this.link = new CompanionServerLinkMock();

        this.companion_core = new CompanionCore(
            (): CompanionStorage =>
                this.storage,
            (): CompanionIdentifierRetriever =>
                this.identifier_retriever,
            (): CompanionWallet =>
                this.wallet,
            (): CompanionServerLink =>
                this.link
        );
    });

    it('clearStorage', async (): Promise<void> => {

        const setup_spy = spy(this.storage, 'setup');

        await this.companion_core.setupStorage(void 0);

        assert.calledOnce(setup_spy);

        await this.companion_core.clearStorage();
        await expect(this.companion_core.getDeviceID()).to.eventually.be.rejected;
        await expect(this.companion_core.getNetworks()).to.eventually.be.rejected;
        return expect(this.companion_core.getDeviceID()).to.eventually.be.rejected;

    });

    it('setupStorage', async (): Promise<void> => {

        const setup_spy = spy(this.storage, 'setup');

        await this.companion_core.setupStorage(void 0);

        assert.calledOnce(setup_spy);

    });

    it('setupDeviceIdentifier', async (): Promise<void> => {

        const getIdentifier_spy = spy(this.identifier_retriever, 'getIdentifier');

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupDeviceIdentifier();

        assert.calledOnce(getIdentifier_spy);

        const raw_ID = await this.identifier_retriever.getIdentifier();
        const ID = await this.companion_core.getDeviceID();

        expect(raw_ID).to.equal(ID);

    });

    it('setupDeviceIdentifier - without setupStorage', async (): Promise<void> => expect(this.companion_core.setupDeviceIdentifier()).to.eventually.be.rejected);

    it('setupDeviceIdentifier - device identifier already stored', async (): Promise<void> => {

        {
            const getIdentifier_spy = spy(this.identifier_retriever, 'getIdentifier');

            await this.companion_core.setupStorage(void 0);
            await this.companion_core.setupDeviceIdentifier();

            assert.calledOnce(getIdentifier_spy);

            getIdentifier_spy.restore();
        }

        this.companion_core = new CompanionCore(
            (): CompanionStorage =>
                this.storage,
            (): CompanionIdentifierRetriever =>
                this.identifier_retriever,
            (): CompanionWallet =>
                this.wallet,
            (): CompanionServerLink =>
                this.link
        );

        {
            const getIdentifier_spy = spy(this.identifier_retriever, 'getIdentifier');

            await this.companion_core.setupStorage(void 0);
            await this.companion_core.setupDeviceIdentifier();

            assert.calledOnce(getIdentifier_spy);

            getIdentifier_spy.restore();
        }

    });

    it('setupDeviceIdentifier - device identifier already stored but is invalid', async (): Promise<void> => {

        {
            const getIdentifier_spy = spy(this.identifier_retriever, 'getIdentifier');

            await this.companion_core.setupStorage(void 0);
            await this.companion_core.setupDeviceIdentifier();

            assert.calledOnce(getIdentifier_spy);

            getIdentifier_spy.restore();
        }

        this.companion_core = new CompanionCore(
            (): CompanionStorage =>
                this.storage,
            (): CompanionIdentifierRetriever =>
                this.identifier_retriever,
            (): CompanionWallet =>
                this.wallet,
            (): CompanionServerLink =>
                this.link
        );

        {
            const getIdentifier_spy = spy(this.identifier_retriever, 'getIdentifier');

            await this.companion_core.setupStorage(void 0);
            await this.storage.update({
                device_identifier: 'di'
            });
            await expect(this.companion_core.setupDeviceIdentifier()).to.eventually.be.false;

            assert.calledOnce(getIdentifier_spy);

            getIdentifier_spy.restore();
        }

    });

    it('setupWallet', async (): Promise<void> => {

        const generate_spy = spy(this.wallet, 'generate');
        const address_spy = spy(this.wallet, 'address');

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();

        assert.calledOnce(generate_spy);
        assert.calledOnce(address_spy);

    });

    it('setupWallet - without setupStorage', async (): Promise<void> =>

        expect(this.companion_core.setupWallet()).to.eventually.be.rejected);

    it('setupWallet - wallet already created', async (): Promise<void> => {

        {
            const generate_spy = spy(this.wallet, 'generate');
            const address_spy = spy(this.wallet, 'address');

            await this.companion_core.setupStorage(void 0);
            await this.companion_core.setupWallet();

            assert.calledOnce(generate_spy);
            assert.calledOnce(address_spy);

            generate_spy.restore();
            address_spy.restore();
        }

        this.companion_core = new CompanionCore(
            (): CompanionStorage =>
                this.storage,
            (): CompanionIdentifierRetriever =>
                this.identifier_retriever,
            (): CompanionWallet =>
                this.wallet,
            (): CompanionServerLink =>
                this.link
        );

        {
            const generate_spy = spy(this.wallet, 'generate');
            const address_spy = spy(this.wallet, 'address');

            await this.companion_core.setupStorage(void 0);
            await this.companion_core.setupWallet();

            assert.calledOnce(address_spy);
            assert.notCalled(generate_spy);

            generate_spy.restore();
            address_spy.restore();
        }

    });

    it('setupNetwork', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await expect(this.companion_core.setupNetwork()).to.eventually.be.true;

        expect((await this.companion_core.getNetworks()).length).to.equal(2);

    });

    it('setupNetwork - without storage setup', async (): Promise<void> =>

        expect(this.companion_core.setupNetwork()).to.eventually.be.rejected);

    it('setupNetwork - invalid selection', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.storage.update({
            selected_network: 'this_network_does_not_exist'
        });

        return expect(this.companion_core.setupNetwork()).to.eventually.be.false;

    });

    it('setupNetwork - network already stored', async (): Promise<void> => {
        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.storage.update({
            selected_network: 'Mainnet'
        });
        await expect(this.companion_core.setupNetwork()).to.eventually.be.true;
    });

    it('addNetwork', async (): Promise<void> => {
        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await this.companion_core.addNetwork('test', 'test', 'test');

        const nets = await this.companion_core.getNetworks();
        expect(nets.findIndex((net: NetworkInfos): boolean => net.name === 'test')).to.not.equal(-1);

    });

    it('addNetwork - already present name', async (): Promise<void> => {
        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        return expect(this.companion_core.addNetwork('Mainnet', 'test', 'test')).to.eventually.be.rejected;

    });

    it('addNetwork - no setup', async (): Promise<void> =>

        expect(this.companion_core.addNetwork('Mainnet', 'test', 'test')).to.eventually.be.rejected);

    it('setNetwork', async (): Promise<void> => {
        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await this.companion_core.setNetwork('Mainnet');

        const selected_network = await this.companion_core.getSelectedNetwork();

        expect(selected_network).to.equal('Mainnet');

    });

    it('setNetwork - clear by setting null', async (): Promise<void> => {
        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await this.companion_core.setNetwork(null);

        const selected_network = await this.companion_core.getSelectedNetwork();

        expect(selected_network).to.equal(null);

    });

    it('setNetwork - invalid network', async (): Promise<void> => {
        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        return expect(this.companion_core.setNetwork('tenniaM')).to.eventually.be.rejected;

    });

    it('getSelectedNetwork - without setup', async (): Promise<void> => expect(this.companion_core.getSelectedNetwork()).to.eventually.be.rejected);

    it('removeNetwork', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        expect((await this.companion_core.getNetworks()).findIndex((net: RxDBNetwork): boolean => net.name === 'Mainnet')).to.not.equal(-1);

        await this.companion_core.removeNetwork('Mainnet');

        expect((await this.companion_core.getNetworks()).findIndex((net: RxDBNetwork): boolean => net.name === 'Mainnet')).to.equal(-1);

    });

    it('removeNetwork - remove selected', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();
        await this.companion_core.setNetwork('Mainnet');

        await expect(this.companion_core.getSelectedNetwork()).to.eventually.equal('Mainnet');
        expect((await this.companion_core.getNetworks()).findIndex((net: RxDBNetwork): boolean => net.name === 'Mainnet')).to.not.equal(-1);

        await this.companion_core.removeNetwork('Mainnet');

        await expect(this.companion_core.getSelectedNetwork()).to.eventually.equal(null);
        expect((await this.companion_core.getNetworks()).findIndex((net: RxDBNetwork): boolean => net.name === 'Mainnet')).to.equal(-1);

    });

    it('removeNetwork - remove unknown network', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();
        return expect(this.companion_core.removeNetwork('tenniaM')).to.eventually.be.rejected;

    });

    it('removeNetwork - without setup', async (): Promise<void> =>

        expect(this.companion_core.removeNetwork('tenniaM')).to.eventually.be.rejected);

    it('getAuthProof', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        return expect(this.companion_core.getAuthProof()).to.eventually.deep.equal([0, 'ab']);
    });

    it('getAuthProof - without setup', async (): Promise<void> =>

        expect(this.companion_core.getAuthProof()).to.eventually.be.rejected);

    it('getTicketProof', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        return expect(this.companion_core.getTicketProof(123)).to.eventually.deep.equal([0, 'ab']);
    });

    it('getTicketProof - without setup', async (): Promise<void> =>

        expect(this.companion_core.getTicketProof(123)).to.eventually.be.rejected);

    it('getImage not already stored', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        return expect(this.companion_core.getImage('def', 'http://lol')).to.eventually.deep.equal({
            uri_source: 'testing_sources'
        });

    });

    it('storeImage + getImage', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await expect(this.companion_core.storeImage('abc', 'def')).to.eventually.be.fulfilled;
        return expect(this.companion_core.getImage('def', 'http://lol')).to.eventually.deep.equal({
            uri_source: 'abc'
        });
    });

    it('storeImage insist', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        process.env.STORAGE_MOCK_THROW = 'true';
        await expect(this.companion_core.storeImage('abc', 'def')).to.eventually.be.fulfilled;
        process.env.STORAGE_MOCK_THROW = undefined;
        return expect(this.companion_core.getImage('def', 'http://lol')).to.eventually.deep.equal({
            uri_source: 'abc'
        });
    });

    it('set net, set tickets, get saved state', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await this.companion_core.setNetwork('Mainnet');
        await this.companion_core.setTickets('0xabcd', [{event: {}} as Ticket]);

        const saved_state = await this.companion_core.getSavedState();

        expect(saved_state.tickets.length).to.equal(1);
        expect(saved_state.linked_to).to.equal('0xabcd');

    });

    it('set net, set null tickets, get saved state', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await this.companion_core.setNetwork('Mainnet');
        await this.companion_core.setTickets(null, []);

        const saved_state = await this.companion_core.getSavedState();

        expect(saved_state.tickets.length).to.equal(1);
        expect(saved_state.tickets[0]).to.equal(null);
        expect(saved_state.linked_to).to.equal(null);

    });

    it('set tickets without setup', async (): Promise<void> =>
        expect(this.companion_core.setTickets('0xabcd', [])).to.eventually.be.rejected);

    it('set tickets without net', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await this.companion_core.setNetwork(null);

        return expect(this.companion_core.setTickets('0xabcd', [])).to.eventually.be.rejected;
    });

    it('getState', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await this.companion_core.setNetwork('Mainnet');

        const state = await this.companion_core.getState();

        expect(state.tickets.length).to.equal(1);
        expect(state.tickets).to.deep.equal([{
            ...mock_ticket,
            owner: undefined
        }]);
        expect(state.linked_to).to.equal(null);
        expect(state.linked).to.equal(false);
    });

    it('getState without setup', async (): Promise<void> =>
        expect(this.companion_core.getState()).to.eventually.be.rejected);

    it('getSavedState without setup', async (): Promise<void> =>
        expect(this.companion_core.getSavedState()).to.eventually.be.rejected);

    it('issueCode', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await this.companion_core.setNetwork('Mainnet');

        const code = await this.companion_core.issueCode();

        expect(code).to.equal('ABCDEF');
    });

    it('issueCode without setup', async (): Promise<void> =>
        expect(this.companion_core.issueCode()).to.eventually.be.rejected);

    it('getTickets', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        await this.companion_core.setNetwork('Mainnet');

        const tickets = await this.companion_core.getTickets('Mainnet');
        expect(tickets).to.deep.equal([null]);
    });

    it('getTickets of unknown net', async (): Promise<void> => {

        await this.companion_core.setupStorage(void 0);
        await this.companion_core.setupWallet();
        await this.companion_core.setupDeviceIdentifier();
        await this.companion_core.setupNetwork();

        return expect(this.companion_core.getTickets('Mainnetus')).to.eventually.be.rejected;
    });

    it('getTickets without setup', async (): Promise<void> =>
        expect(this.companion_core.getTickets('Mainnetus')).to.eventually.be.rejected);
});
