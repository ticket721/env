import { use }                                                           from 'chai';
import * as chaiAsPromised                                               from 'chai-as-promised';
import { address, generate, generate_auth_proof, generate_ticket_proof } from './CompanionWallet.test';
import { CompanionWalletEthers }                                         from './CompanionWalletEthers';

use(chaiAsPromised);

describe('CompanionWalletEthers', (): void => {

    beforeEach(function (): void {
        this.wallet = new CompanionWalletEthers();
    });

    it('generate', generate);

    it('address', address);

    it('generate_auth_proof', generate_auth_proof);

    it('generate_ticket_proof', generate_ticket_proof);

});
