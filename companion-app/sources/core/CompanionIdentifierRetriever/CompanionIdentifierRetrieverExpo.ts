import Constants                        from 'expo-constants';
import { CompanionIdentifierRetriever } from './CompanionIdentifierRetriever';
import { utils } from 'ethers';

export class CompanionIdentifierRetrieverExpo implements CompanionIdentifierRetriever{

    getIdentifier = async (salt: string): Promise<string> =>
        utils.keccak256(Buffer.concat([Buffer.from(Constants.installationId), Buffer.from(salt)])).toUpperCase().slice(2).match(/.{1,8}/g).join('-')

}
