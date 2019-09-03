import { expect, use }         from 'chai';
import * as chaiAsPromised     from 'chai-as-promised';
import { CompanionWalletMock } from './CompanionWalletMock';
import { AuthProof }           from '../AuthProof';
import { TicketProof }         from '../TicketProof';

use(chaiAsPromised);

export async function generate(): Promise<void> {

    const wallet_one = await this.wallet.generate();
    const wallet_two = await this.wallet.generate();

    expect(wallet_one).to.not.equal(undefined);
    expect(wallet_one).to.not.equal(null);
    expect(wallet_one.length).to.equal(66);
    expect(wallet_one).to.not.equal(wallet_two);
}

export async function address(): Promise<void> {

    const wallet_one = await this.wallet.generate();
    const wallet_two = await this.wallet.generate();

    const wallet_one_address_one = await this.wallet.address(wallet_one);
    const wallet_one_address_two = await this.wallet.address(wallet_one);

    const wallet_two_address_one = await this.wallet.address(wallet_two);
    const wallet_two_address_two = await this.wallet.address(wallet_two);

    expect(wallet_one_address_one).to.not.equal(undefined);
    expect(wallet_one_address_one).to.not.equal(null);
    expect(wallet_one_address_one.length).to.equal(42);
    expect(wallet_one_address_two).to.equal(wallet_one_address_one);

    expect(wallet_two_address_one).to.not.equal(undefined);
    expect(wallet_two_address_one).to.not.equal(null);
    expect(wallet_two_address_one.length).to.equal(42);
    expect(wallet_two_address_two).to.equal(wallet_two_address_one);
}

export async function generate_auth_proof(): Promise<void> {

    const wallet_one = await this.wallet.generate();

    const proof = await this.wallet.generate_auth_proof(wallet_one, 'abcd');

    const ap = new AuthProof();

    const signer = await ap.verify(ap.generatePayload({
        device_identifier: 'abcd',
        timestamp: proof[0]
    }), proof[1]);

    expect(signer.toLowerCase()).to.equal((await this.wallet.address(wallet_one)).toLowerCase());

}

export async function generate_ticket_proof(): Promise<void> {

    const wallet_one = await this.wallet.generate();

    const proof = await this.wallet.generate_ticket_proof(wallet_one, 123);

    const tp = new TicketProof();

    const signer = await tp.verify(tp.generatePayload({
        ticket_id: 123,
        timestamp: proof[0]
    }), proof[1]);

    expect(signer.toLowerCase()).to.equal((await this.wallet.address(wallet_one)).toLowerCase());

}

describe('CompanionWallet', (): void => {

    beforeEach(function (): void {
        this.wallet = new CompanionWalletMock();
    });

    it('generate', generate);

    it('address', address);

    it('tests mocked signatures', async function(): Promise<void> {
        await expect(this.wallet.generate_auth_proof('a', 'b')).to.eventually.deep.equal([0, 'ab']);
        return expect(this.wallet.generate_ticket_proof('a', 123)).to.eventually.deep.equal([0, 'ab']);
    });

});
