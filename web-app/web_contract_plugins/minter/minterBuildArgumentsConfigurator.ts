import { Argument }          from '../../web_views/events_overview/EventCreationForm/ContractArgumentForm';
import { EventCreationData } from '../../web_views/events_overview/EventCreationForm/EventCreationData';

export const minterBuildArgumentsConfigurator = (minter: string, build_args: Argument[], data: EventCreationData): Argument[] => {
    switch (minter) {
        case 'MinterPayableFixed':
        case 'MinterPayableFixedCategories':
            for (const args of build_args) {
                if (args.name === 'minter_end') {
                    args.options = {
                        limit: data.dates ? data.dates.start : undefined
                    };
                }
            }
            break ;
        default:
            break ;
    }
    return build_args;
};
