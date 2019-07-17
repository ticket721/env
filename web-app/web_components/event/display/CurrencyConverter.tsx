import * as React     from 'react';
import { BigNumber }  from 'bignumber.js';
import { Typography } from 'antd';

const ether = (value: string, size?: number): React.ReactNode => {
    const val = new BigNumber(value);

    const end_val = val.div('1000000000000000000');

    return <div style={{textAlign: 'center'}}>
        <Typography.Text style={{fontSize: size || 60}}>Ξ</Typography.Text>
        <Typography.Text style={{fontSize: size || 60, marginLeft: 12}}>{end_val.toFormat(3, 6)}</Typography.Text>
    </div>;

};

export default {
    ether
};
