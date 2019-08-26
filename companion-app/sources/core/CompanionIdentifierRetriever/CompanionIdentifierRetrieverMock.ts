import { CompanionIdentifierRetriever } from './CompanionIdentifierRetriever';

export class CompanionIdentifierRetrieverMock implements CompanionIdentifierRetriever {

    public getIdentifier = async (salt: string): Promise<string> =>
        'id'
}
