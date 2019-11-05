import { expect, use }                          from 'chai';
import * as chaiAsPromised                      from 'chai-as-promised';
import { spy, assert }                          from 'sinon';
import { ScannerCore }                          from './ScannerCore';
import { ScannerStorageMock }                   from './ScannerStorage/ScannerStorageMock';
import { log }                                  from './log';
import Logger = require('js-logger');
import { RxDBNetwork }                          from './RxDBStoreType';
import { ScannerStorage }                       from './ScannerStorage/ScannerStorage';
import { ScannerServerLinkMock, mock_event }    from './ScannerServerLink/ScannerServerLinkMock';
import { ScannerServerLink }                    from './ScannerServerLink/ScannerServerLink';
import { NetworkInfos, Ticket }                 from '../redux/state';
import { TicketProofMock, mock_qr }             from './TicketProof/TicketProofMock';
import { TicketProof }                          from './TicketProof/TicketProof';

log.setLevel(Logger.OFF);

use(chaiAsPromised);

describe('ScannerCore', function(): void {

    beforeEach(function(): void {
        this.storage = new ScannerStorageMock();

        this.link = new ScannerServerLinkMock();

        this.tp = new TicketProofMock();

        this.scanner_core = new ScannerCore(
            (): ScannerStorage =>
                this.storage,
            (): ScannerServerLink =>
                this.link,
            (): TicketProof =>
                this.tp
        );
    });

    describe('Storage', function(): void {

        it('clearStorage', async function(): Promise<void> {

            const setup_spy = spy(this.storage, 'setup');
    
            await this.scanner_core.setupStorage(void 0);
    
            assert.calledOnce(setup_spy);
    
            await this.scanner_core.clearStorage();
            await expect(this.scanner_core.getNetworks()).to.eventually.be.rejected;
    
        });
    
        it('setupStorage', async function(): Promise<void> {
    
            const setup_spy = spy(this.storage, 'setup');
    
            await this.scanner_core.setupStorage(void 0);
    
            assert.calledOnce(setup_spy);
    
        });

    });

    describe('Network', function(): void {

        describe('Without storage setup', function(): void {
    
            it('setupNetwork', async function(): Promise<void> {

                expect(this.scanner_core.setupNetwork()).to.eventually.be.rejected;

            });

            it('addNetwork', async function(): Promise<void> {

                expect(this.scanner_core.addNetwork('Mainnet', 'test', 'test')).to.eventually.be.rejected;

            });

            it('getSelectedNetwork', async function(): Promise<void> {

                expect(this.scanner_core.getSelectedNetwork()).to.eventually.be.rejected;

            });

            it('removeNetwork', async function(): Promise<void> {

                expect(this.scanner_core.removeNetwork('tenniaM')).to.eventually.be.rejected;

            });

            it('pingServer', async function(): Promise<void> {

                expect(this.scanner_core.pingServer()).to.eventually.be.rejected;

            });
        
        });

        describe('Bad use', function(): void {

            beforeEach(async function(): Promise<void> {

                await this.scanner_core.setupStorage(void 0);

            });

            it('setupNetwork - invalid selection', async function(): Promise<void> {

                await this.storage.update({
                    selected_network: 'this_network_does_not_exist'
                });
        
                return expect(this.scanner_core.setupNetwork()).to.eventually.be.false;
        
            });

            it('setupNetwork - network already stored', async function(): Promise<void> {

                await this.storage.update({
                    selected_network: 'Mainnet'
                });

                return expect(this.scanner_core.setupNetwork()).to.eventually.be.true;

            });

            it('addNetwork - already present name', async function(): Promise<void> {

                await this.scanner_core.setupNetwork();
        
                return expect(this.scanner_core.addNetwork('Mainnet', 'test', 'test')).to.eventually.be.rejected;
        
            });

            it('setNetwork - invalid network', async function(): Promise<void> {

                await this.scanner_core.setupNetwork();
        
                return expect(this.scanner_core.setNetwork('tenniaM')).to.eventually.be.rejected;
        
            });

            it('removeNetwork - remove unknown network', async function(): Promise<void> {

                await this.scanner_core.setupNetwork();

                return expect(this.scanner_core.removeNetwork('tenniaM')).to.eventually.be.rejected;
        
            });

            it('pingServer - no selected network', async function(): Promise<void> {

                expect(this.scanner_core.pingServer()).to.eventually.be.rejected;

            });

            it('pingServer - server unreachable', async function(): Promise<void> {

                await this.scanner_core.setupNetwork();

                await this.scanner_core.addNetwork('test', 'test', 'test');

                await this.scanner_core.setNetwork('test');

                expect(this.scanner_core.pingServer()).to.eventually.be.false;

            });

        });

        describe('Success', function(): void {

            beforeEach(async function(): Promise<void> {

                await this.scanner_core.setupStorage(void 0);

            });

            it('setupNetwork', async function(): Promise<void> {

                await expect(this.scanner_core.setupNetwork()).to.eventually.be.true;
        
                expect((await this.scanner_core.getNetworks()).length).to.equal(2);
        
            });
        
            it('addNetwork', async function(): Promise<void> {

                await this.scanner_core.setupNetwork();
        
                await this.scanner_core.addNetwork('test', 'test', 'test');
        
                const nets = await this.scanner_core.getNetworks();

                expect(nets.findIndex((net: NetworkInfos): boolean => net.name === 'test')).to.not.equal(-1);
        
            });
        
            it('setNetwork', async function(): Promise<void> {

                await this.scanner_core.setupNetwork();
        
                await this.scanner_core.setNetwork('Mainnet');
        
                const selected_network = await this.scanner_core.getSelectedNetwork();
        
                expect(selected_network).to.equal('Mainnet');
        
            });
        
            it('setNetwork - clear by setting null', async function(): Promise<void> {

                await this.scanner_core.setupNetwork();
        
                await this.scanner_core.setNetwork(null);
        
                const selected_network = await this.scanner_core.getSelectedNetwork();
        
                expect(selected_network).to.equal(null);
        
            });
        
            it('removeNetwork', async function(): Promise<void> {
        
                await this.scanner_core.setupNetwork();
        
                expect((await this.scanner_core.getNetworks()).findIndex((net: RxDBNetwork): boolean => net.name === 'Mainnet')).to.not.equal(-1);
        
                await this.scanner_core.removeNetwork('Mainnet');
        
                expect((await this.scanner_core.getNetworks()).findIndex((net: RxDBNetwork): boolean => net.name === 'Mainnet')).to.equal(-1);
        
            });
        
            it('removeNetwork - remove selected', async function(): Promise<void> {
        
                await this.scanner_core.setupNetwork();
                await this.scanner_core.setNetwork('Mainnet');
        
                await expect(this.scanner_core.getSelectedNetwork()).to.eventually.equal('Mainnet');
                expect((await this.scanner_core.getNetworks()).findIndex((net: RxDBNetwork): boolean => net.name === 'Mainnet')).to.not.equal(-1);
        
                await this.scanner_core.removeNetwork('Mainnet');
        
                await expect(this.scanner_core.getSelectedNetwork()).to.eventually.equal(null);
                expect((await this.scanner_core.getNetworks()).findIndex((net: RxDBNetwork): boolean => net.name === 'Mainnet')).to.equal(-1);
        
            });

            it('pingServer', async function(): Promise<void> {

                await this.scanner_core.setupNetwork();
                await this.scanner_core.setNetwork('Rinkeby');

                expect(this.scanner_core.pingServer()).to.eventually.be.true;

            });

        });

    });

    describe('Event', function(): void {

        describe('Without storage setup', function(): void {

            it('getEventInfos', async function(): Promise<void> {
                
                expect(this.scanner_core.getEventInfos('mock_address')).to.eventually.be.rejected;
            
            });

            it('addEvent', async function(): Promise<void> {
                
                expect(this.scanner_core.addEvent(mock_event)).to.eventually.be.rejected;
            
            });

            it('removeEvent', async function(): Promise<void> {
                
                expect(this.scanner_core.removeEvent(1)).to.eventually.be.rejected;
                
            });

            it('getEvents', async function(): Promise<void> {
                
                expect(this.scanner_core.getEvents('Mainnet')).to.eventually.be.rejected;
                
            });

            it('refreshEvents', async function(): Promise<void> {

                expect(this.scanner_core.refreshEvents()).to.eventually.be.rejected;
                
            });

            it('getSavedEvents', async function(): Promise<void> {
                
                expect(this.scanner_core.getSavedEvents()).to.eventually.be.rejected;
                
            });

            it('setEvents', async function(): Promise<void> {

                expect(this.scanner_core.setEvents([mock_event])).to.eventually.be.rejected;
                
            });

        });

        describe('With no selected or nonexistent network', function(): void {

            beforeEach(async function(): Promise<void> {

                await this.scanner_core.setupStorage(void 0);
                await this.scanner_core.setupNetwork();
                await this.scanner_core.setNetwork(null);

            });

            it('getEventInfos', async function(): Promise<void> {
                
                expect(this.scanner_core.getEventInfos('mock_address')).to.eventually.be.rejected;
            
            });

            it('addEvent', async function(): Promise<void> {
                
                expect(this.scanner_core.addEvent(mock_event)).to.eventually.be.rejected;
            
            });

            it('removeEvent', async function(): Promise<void> {
                
                expect(this.scanner_core.removeEvent(1)).to.eventually.be.rejected;
                
            });

            it('getEvents', async function(): Promise<void> {
                
                expect(this.scanner_core.getEvents('tenniaM')).to.eventually.be.rejected;
                
            });

            it('refreshEvents', async function(): Promise<void> {
                
                expect(this.scanner_core.refreshEvents()).to.eventually.be.rejected;
                
            });

            it('getSavedEvents', async function(): Promise<void> {
                
                expect(this.scanner_core.getSavedEvents()).to.eventually.be.rejected;
                
            });

            it('setEvents', async function(): Promise<void> {
                
                expect(this.scanner_core.setEvents([mock_event])).to.eventually.be.rejected;
                
            });

        });

        describe('Bad use', function(): void {
            
            beforeEach(async function(): Promise<void> {

                await this.scanner_core.setupStorage(void 0);
                await this.scanner_core.setupNetwork();
                await this.scanner_core.setNetwork('Mainnet');

            });

            it('getEventInfos - nonexistent address', async function(): Promise<void> {

                expect(this.scanner_core.getEventInfos('nonexistent_address')).to.eventually.be.rejected;
                
            });

            it('removeEvent - nonexistent event id', async function(): Promise<void> {
                
                await this.scanner_core.addEvent(mock_event);

                const saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events.length).to.equal(1);
                
                return expect(this.scanner_core.removeEvent(2)).to.eventually.be.rejected;

            });

        });

        describe('Success', function(): void {

            beforeEach(async function(): Promise<void> {

                await this.scanner_core.setupStorage(void 0);
                await this.scanner_core.setupNetwork();
                await this.scanner_core.setNetwork('Mainnet');

            });

            it('getEventInfos', async function(): Promise<void> {

                expect(this.scanner_core.getEventInfos('mock_address')).to.eventually.be.equal(mock_event);
                
            });

            it('addEvent and getSavedEvents', async function(): Promise<void> {
                await this.scanner_core.addEvent(mock_event);

                const saved_events = await this.scanner_core.getSavedEvents();
                
                expect(saved_events.length).to.equal(1);
                expect(saved_events[0]).to.deep.equal(mock_event);

            });

            it('addEvent twice and getSavedEvents', async function(): Promise<void> {
                await this.scanner_core.addEvent(mock_event);

                let saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events.length).to.equal(1);
                expect(saved_events[0]).to.deep.equal(mock_event);

                await this.scanner_core.addEvent(mock_event);

                saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events.length).to.equal(2);
                expect(saved_events[1]).to.deep.equal(mock_event);

            });

            it('removeEvent and getSavedEvents', async function(): Promise<void> {

                await this.scanner_core.addEvent(mock_event);

                let saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events.length).to.equal(1);

                await this.scanner_core.removeEvent(1);

                saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events.length).to.equal(0);

            });

            it('refreshEvents and getSavedEvents', async function(): Promise<void> {

                await this.scanner_core.addEvent(mock_event);

                let saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events[0]).to.deep.equal(mock_event);

                await this.scanner_core.refreshEvents();

                saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events[0]).to.deep.equal(mock_event);

            });

            it('refreshEvents with no events added', async function(): Promise<void> {

                let saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events.length).to.equal(1);
                expect(saved_events[0]).to.equal(null);

                await this.scanner_core.refreshEvents();

                saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events.length).to.equal(1);
                expect(saved_events[0]).to.equal(null);

            });

            it('getEvents', async function(): Promise<void> {

                await this.scanner_core.addEvent(mock_event);

                const events = await this.scanner_core.getEvents('Mainnet');

                expect(events.length).to.equal(1);
                expect(events[0]).to.deep.equal(mock_event);
            });

            it('setEvents and getSavedEvents', async function(): Promise<void> {

                await this.scanner_core.setEvents([mock_event]);

                const saved_events = await this.scanner_core.getSavedEvents();

                expect(saved_events.length).to.equal(1);
                expect(saved_events[0]).to.equal(mock_event);

            });

        });

    });

    describe('Ticket', function(): void {

        const mock_ticket: Ticket = {
            timestamp: Date.now(),
            ticket_id: 1,
            owner: {
                user_id: 1,
                username: 'mock_owner'
            }
        };

        describe('Without storage setup', function(): void {

            it('checkOwnedTicket', async function(): Promise<void> {
                
                expect(this.scanner_core
                    .checkOwnedTicket(mock_qr.timestamp, mock_event.id, mock_qr.ticket_id, mock_qr.signature))
                    .to.eventually.be.rejected;
                    
            });

            it('addVerifiedTicket', async function(): Promise<void> {
                
                expect(this.scanner_core.addVerifiedTicket(mock_event.id, mock_ticket)).to.eventually.be.rejected;
                
            });

            it('removeVerifiedTicket', async function(): Promise<void> {
                
                expect(this.scanner_core.removeVerifiedTicket(mock_event.id, mock_ticket.ticket_id)).to.eventually.be.rejected;
                
            });

            it('getVerifiedTickets', async function(): Promise<void> {
            
                expect(this.scanner_core.getVerifiedTickets(mock_event.id)).to.eventually.be.rejected;
                
            });

            it('updateVerifiedTickets', async function(): Promise<void> {
            
                expect(this.scanner_core.updateVerifiedTickets(mock_event.id, [mock_ticket])).to.eventually.be.rejected;
                
            });
            
        });

        describe('With no selected or nonexistent network', function(): void {

            beforeEach(async function(): Promise<void> {

                await this.scanner_core.setupStorage(void 0);
                await this.scanner_core.setupNetwork();
                await this.scanner_core.setNetwork(null);

            });

            it('checkOwnedTicket', async function(): Promise<void> {
                
                expect(this.scanner_core
                    .checkOwnedTicket(mock_qr.timestamp, mock_event.id, mock_qr.ticket_id, mock_qr.signature))
                    .to.eventually.be.rejected;
                    
            });

            it('addVerifiedTicket', async function(): Promise<void> {
                
                expect(this.scanner_core.addVerifiedTicket(mock_event.id, mock_ticket)).to.eventually.be.rejected;
                
            });

            it('removeVerifiedTicket', async function(): Promise<void> {
                
                expect(this.scanner_core.removeVerifiedTicket(mock_event.id, mock_ticket.ticket_id)).to.eventually.be.rejected;
                
            });

            it('getVerifiedTickets', async function(): Promise<void> {
            
                expect(this.scanner_core.getVerifiedTickets(mock_event.id)).to.eventually.be.rejected;
                
            });

            it('updateVerifiedTickets', async function(): Promise<void> {
            
                expect(this.scanner_core.updateVerifiedTickets(mock_event.id, [mock_ticket])).to.eventually.be.rejected;
                
            });

        });

        describe('With nonexistent event id', function(): void {

            beforeEach(async function(): Promise<void> {

                await this.scanner_core.setupStorage(void 0);
                await this.scanner_core.setupNetwork();
                await this.scanner_core.setNetwork('Mainnet');

            });

            it('addVerifiedTicket', async function(): Promise<void> {
                
                expect(this.scanner_core.addVerifiedTicket(mock_event.id, mock_ticket)).to.eventually.be.rejected;
                
            });

            it('removeVerifiedTicket', async function(): Promise<void> {
                
                expect(this.scanner_core.removeVerifiedTicket(mock_event.id, mock_ticket.ticket_id)).to.eventually.be.rejected;
                
            });

            it('getVerifiedTickets', async function(): Promise<void> {
            
                expect(this.scanner_core.getVerifiedTickets(mock_event.id)).to.eventually.be.rejected;
                
            });

            it('updateVerifiedTickets', async function(): Promise<void> {
            
                expect(this.scanner_core.updateVerifiedTickets(mock_event.id, [mock_ticket])).to.eventually.be.rejected;
                
            });

        });

        describe('Bad use', function(): void {

            beforeEach(async function(): Promise<void> {

                await this.scanner_core.setupStorage(void 0);
                await this.scanner_core.setupNetwork();
                await this.scanner_core.setNetwork('Mainnet');
                await this.scanner_core.addEvent(mock_event);

            });

            it('checkOwnedTicket - invalid signature', async function(): Promise<void> {
                
                expect(await this.scanner_core.checkOwnedTicket(mock_qr.timestamp, mock_event.id, mock_qr.ticket_id, 'invalid_signature')).to.equal(null);
                
            });

            it('removeVerifiedTicket - nonexistent ticket', async function(): Promise<void> {
                
                expect(this.scanner_core.removeVerifiedTicket(mock_event.id, mock_ticket.ticket_id)).to.eventually.be.rejected;
                
            });

        });

        describe('Success', function(): void {

            beforeEach(async function(): Promise<void> {

                await this.scanner_core.setupStorage(void 0);
                await this.scanner_core.setupNetwork();
                await this.scanner_core.setNetwork('Mainnet');
                await this.scanner_core.addEvent(mock_event);

            });

            it('checkOwnedTicket', async function(): Promise<void> {
                
                expect(await this.scanner_core.checkOwnedTicket(mock_qr.timestamp, mock_event.id, mock_qr.ticket_id, 'mock_signature')).to.deep.equal(mock_ticket.owner);
                
            });

            it('addVerifiedTicket and getVerifiedTickets', async function(): Promise<void> {

                await this.scanner_core.addVerifiedTicket(mock_event.id, mock_ticket);

                const verified_tickets = await this.scanner_core.getVerifiedTickets(mock_event.id);

                expect(verified_tickets.length).to.equal(1);
                expect(verified_tickets[0]).to.deep.equal(mock_ticket);

            });

            it('removeVerifiedTicket and getVerifiedTickets', async function(): Promise<void> {

                await this.scanner_core.addVerifiedTicket(mock_event.id, mock_ticket);

                let verified_tickets = await this.scanner_core.getVerifiedTickets(mock_event.id);

                expect(verified_tickets.length).to.equal(1);

                await this.scanner_core.removeVerifiedTicket(mock_event.id, mock_ticket.ticket_id);

                verified_tickets = await this.scanner_core.getVerifiedTickets(mock_event.id);

                expect(verified_tickets.length).to.equal(0);

            });

            it('updateVerifiedTickets and getVerifiedTickets', async function(): Promise<void> {

                await this.scanner_core.updateVerifiedTickets(mock_event.id, [mock_ticket]);

                let verified_tickets = await this.scanner_core.getVerifiedTickets(mock_event.id);

                expect(verified_tickets.length).to.equal(1);
                expect(verified_tickets[0]).to.deep.equal(mock_ticket);

                await this.scanner_core.updateVerifiedTickets(mock_event.id, []);

                verified_tickets = await this.scanner_core.getVerifiedTickets(mock_event.id);

                expect(verified_tickets.length).to.equal(0);

            });
    
        });

    });

    describe('Image', function(): void {

        beforeEach(async function(): Promise<void> {

            await this.scanner_core.setupStorage(void 0);
            await this.scanner_core.setupNetwork();

        });

        it('getImage not already stored', async function(): Promise<void> {

            expect(this.scanner_core.getImage('def', 'http://lol')).to.eventually.deep.equal({
                uri_source: 'testing_sources'
            });
                
        });
    
        it('storeImage + getImage', async function(): Promise<void> {
    
            await expect(this.scanner_core.storeImage('abc', 'def')).to.eventually.be.fulfilled;
            return expect(this.scanner_core.getImage('def', 'http://lol')).to.eventually.deep.equal({
                uri_source: 'abc'
            });

        });
    
        it('storeImage insist', async function(): Promise<void> {
    
            process.env.STORAGE_MOCK_THROW = 'true';
            await expect(this.scanner_core.storeImage('abc', 'def')).to.eventually.be.fulfilled;
            process.env.STORAGE_MOCK_THROW = undefined;
            return expect(this.scanner_core.getImage('def', 'http://lol')).to.eventually.deep.equal({
                uri_source: 'abc'
            });

        });

    });
});
