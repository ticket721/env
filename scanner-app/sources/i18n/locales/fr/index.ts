import boot_network_selection   from './boot_network_selection';
import events                   from './events';
import tickets                  from './tickets';
import settings                 from './settings';
import messages                 from './messages';

export default {
    ...boot_network_selection,
    ...events,
    ...tickets,
    ...settings,
    ...messages
};
