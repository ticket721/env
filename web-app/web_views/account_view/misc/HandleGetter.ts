import { StrapiAddress } from '../../../utils/strapi/address';

export const HandleGetter = (strapi_address: StrapiAddress, queried_address: string, coinbase: string): [string, boolean] =>
    strapi_address
        ?
        (
            strapi_address.username
                ?
                [strapi_address.username, true]
                :
                [(`User #${strapi_address.id}`), false]
        )
        :
        (
            queried_address
                ?
                [queried_address, false]
                :
                [coinbase, false]
        );
