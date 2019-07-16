// tslint:disable-next-line:no-var-requires
const Index = require('next-routes');

export const routes = Index()
    .add('account', '/account/:address?', 'account')
    .add('events', '/events/:id?', 'events')
    .add('event', '/event/:address', 'event')
    .add('marketplace', '/marketplace', 'marketplace')
    .add('ticket', '/ticket/:id', 'ticket');
