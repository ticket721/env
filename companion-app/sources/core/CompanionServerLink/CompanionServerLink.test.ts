import { CompanionServerLinkMock, mock_ticket } from './CompanionServerLinkMock';
import { expect, use }                          from 'chai';
import * as chaiAsPromised                      from 'chai-as-promised';
import { AuthProof }                            from '../AuthProof';
import { Wallet }                               from 'ethers';
import { ServerState }                          from './CompanionServerLink';

use(chaiAsPromised);

export async function issue_code(): Promise<void> {

    const ap = new AuthProof();

    const wallet = Wallet.createRandom();

    const device_identifier = '981293-321982-8234';

    const proof = await ap.generateProof(wallet.privateKey, device_identifier);

    const code = await this.link.issue_code('test_url', device_identifier, proof[0], proof[1]);

    expect(code).to.equal('ABCDEF');

}

export async function get_state(): Promise<void> {

    const ap = new AuthProof();

    const wallet = Wallet.createRandom();

    const device_identifier = '981293-321982-8234';

    const proof = await ap.generateProof(wallet.privateKey, device_identifier);

    const state: ServerState = await this.link.get_state('test_url', device_identifier, proof[0], proof[1]);

    expect(state.linked_to).to.equal(null);
    expect(state.linked).to.equal(false);
    expect(state.tickets).to.deep.equal([mock_ticket]);

}

describe('CompanionStorage', (): void => {

    beforeEach(function (): void {
        this.link = new CompanionServerLinkMock();
    });

    it('issue_code', issue_code);
    it('get_state', get_state);

});
