import bootnetwork  from './boot_network_selection';
import events       from './events';
import tickets      from './tickets';
import settings     from './settings';
import messages     from './messages';

export default {
    ...bootnetwork,
    ...events,
    ...tickets,
    ...settings,
    ...messages
};
