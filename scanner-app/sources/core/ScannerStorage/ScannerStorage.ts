import { Image } from '../../redux/state';

export abstract class ScannerStorage<SetupType = any, StoredType = any> {

    /**
     * Setup the ScannerStorage module
     */
    abstract setup: (arg?: SetupType) => Promise<void>;

    /**
     * Get current saved state
     */
    abstract get: () => Promise<StoredType>;

    /**
     * Update the current state
     */
    abstract update: (arg: Partial<StoredType>) => Promise<void>;

    /**
     * Clear all storage
     */
    abstract clear: () => Promise<void>;

    /**
     * Get image by its hash
     */
    abstract get_image: (image_hash: string) => Promise<Image>;

    /**
     * Store B64 image to given hash
     */
    abstract store_image: (img: Image, hash: string) => Promise<void>;

}
