import * as React     from 'react';
import { Typography } from 'antd';
import BigNumber      from 'bignumber.js';

const symbol = (style: any): React.ReactNode =>
    <Typography.Text style={style}>Ξ</Typography.Text>;

const toFixed = (value: string): string => {
    const bn = (new BigNumber(value)).div('1000000000000000000');

    return bn.toFormat(3, 6);
};

export default {
    symbol,
    toFixed
};
