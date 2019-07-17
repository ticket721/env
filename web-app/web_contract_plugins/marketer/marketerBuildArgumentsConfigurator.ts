import { Argument }   from '../../web_views/events_overview/EventCreationForm/ContractArgumentForm';
import { getSaleEnd } from '../minter/getSaleEnd';

export const marketerBuildArgumentsConfigurator = (minter: string, build_args: Argument[], data: any): Argument[] => {
    switch (minter) {
        case 'MarketerDirectSale':
            for (const args of build_args) {
                if (args.name === 'marketer_end') {
                    if (data.minter_name && data.minter) {
                        const sale_end = getSaleEnd(data.minter_name, data.minter);
                        if (sale_end) {
                            args.options = {
                                limit: parseInt(sale_end) * 1000
                            };
                        }
                    }
                }
            }
            break ;
        default:
            break ;
    }
    return build_args;
};
