import { ScannerServerLinkMock, mock_event }    from './ScannerServerLinkMock';
import { expect, use }                          from 'chai';
import * as chaiAsPromised                      from 'chai-as-promised';
import { RxDBEvent }                            from '../RxDBStoreType';

use(chaiAsPromised);

export async function check_owner(): Promise<void> {
    const owner = await this.link.check_owner('test_url', 1, 'mock_companion_address', 1);

    expect(owner).to.deep.equal({
        username: 'mock_owner',
        user_id: 1
    });

}

export async function get_event_by_address(): Promise<void> {
    const event: RxDBEvent = await this.link.get_event_by_address('test_url', 'mock_address');

    expect(event).to.equal(mock_event);
}

export async function get_state(): Promise<void> {
    const state: RxDBEvent[] = await this.link.get_state(
        'test_url',
        [{
            event_id: 1,
            tickets: [{
                ticket_id: 1,
                username: 'mock_username',
                timestamp: Date.now()
            }]
        }]);

    expect(state).to.deep.equal([mock_event]);

}

describe('ScannerServerLink', (): void => {

    beforeEach(function (): void {
        this.link = new ScannerServerLinkMock();
    });

    it('check_owner', check_owner);
    it('get_event_by_address', get_event_by_address);
    it('get_state', get_state);
});
