export const overrides = {
    'MinterPayableFixed': {
        'minter_end': 'date',
        'minter_price': 'price'
    },
    'MinterPayableFixedCategories': {
        'minter_end': 'date',
        'minter_prices': 'ignored',
        'minter_names': 'ignored',
        'mitner_caps': 'ignored'
    }
};

export const extras = {
    'MinterPayableFixedCategories': {
        'dynamic_categories': {
            type: 'dynamics',
            fields: {
                'minter_names': 'bytes32',
                'minter_prices': 'price',
                'minter_caps': 'uint256'
            },
            dispatcher: (elems: any[]): any => {
                const ret = {
                    'minter_names': [],
                    'minter_prices': [],
                    'minter_caps': []
                };
                for (const elem of elems) {
                    ret['minter_names'].push(elem['minter_names']);
                    ret['minter_prices'].push(elem['minter_prices']);
                    ret['minter_caps'].push(elem['minter_caps']);
                }

                return ret;
            },
            recover: (current: any): any[] => {
                if (current && current.minter_names && current.minter_prices && current.minter_caps) {
                    const ret = [];
                    for (let idx = 0; idx < current['minter_names'].length; ++idx) {
                        ret.push({
                            minter_names: current['minter_names'][idx],
                            minter_prices: current['minter_prices'][idx],
                            minter_caps: current['minter_caps'][idx]
                        });
                    }
                    return ret;
                }
                return [];
            }
        }
    }
};
