import moment       from 'moment';
import { to_ascii } from '@utils/misc/ascii';

export const MinterPayableFixed = (args: any, t: any): string => {
    const desc = t('MinterPayableFixed_concise_description');

    const price = args.minter_price;
    const cap = args.minter_cap;
    const end = moment(args.minter_end);

    return desc
        .replace('//minter_price//', price.div('1000000000000000000').toString())
        .replace('//minter_cap//', cap.toString())
        .replace('//minter_end//', end.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

export const MinterPayableFixedCategories = (args: any, t: any): string => {

    const end = moment(args.minter_end);

    let desc = t('MinterPayableFixedCategories_concise_description')
        .replace('//minter_end//', end.format('dddd, MMMM Do YYYY, h:mm:ss a'));

    const cat_desc = t('MinterPayableFixedCategories_category_concise_description');

    for (let idx = 0; idx < args.minter_names.length; ++idx) {
        desc += cat_desc
            .replace('//name//', to_ascii(args.minter_names[idx]))
            .replace('//price//', args.minter_prices[idx].div('1000000000000000000').toString())
            .replace('//cap//', args.minter_caps[idx].toString());
    }

    return desc;
};
