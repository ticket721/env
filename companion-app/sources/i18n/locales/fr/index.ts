import boot_network_selection from './boot_network_selection';
import link_t721 from './link_t721';
import tickets from './tickets';
import settings from './settings';
import messages from './messages';

export default {
    ...boot_network_selection,
    ...link_t721,
    ...tickets,
    ...settings,
    ...messages
};
