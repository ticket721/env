export abstract class CompanionIdentifierRetriever {

    /**
     * Retrieves constant device identifier
     */
    abstract getIdentifier: (salt: string) => Promise<string>;
}
