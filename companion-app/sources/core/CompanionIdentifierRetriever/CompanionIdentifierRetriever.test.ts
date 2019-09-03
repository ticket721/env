import { expect, use }                      from 'chai';
import * as chaiAsPromised                  from 'chai-as-promised';
import { CompanionIdentifierRetriever }     from './CompanionIdentifierRetriever';
import { CompanionIdentifierRetrieverMock } from './CompanionIdentifierRetrieverMock';

use(chaiAsPromised);

export async function getIdentifier(): Promise<void> {

    const id_one = await this.identifier_retriever.getIdentifier();
    const id_two = await this.identifier_retriever.getIdentifier();

    expect(id_one).to.not.equal(null);
    expect(id_one).to.not.equal(undefined);
    expect(id_one).to.not.equal('');
    expect(id_one).to.equal(id_two);

}

describe('CompanionIdentifierRetriever', (): void => {

    beforeEach(function (): void {
        this.identifier_retriever = new CompanionIdentifierRetrieverMock();
    });

    it('getIdentifier', getIdentifier);

});
