import NextI18Next from 'next-i18next';

export interface I18NProps {
    t: (field: string) => string;
}

export const I18N = new NextI18Next({
    otherLanguages: ['fr'],
    localeSubpaths: true
});

const base = ['navbar', 'provider_selection', 'auth', 'local_wallet_creation', 'lwmodals', 'address', 'messages'];

export const namespaces = {
    '/': base.concat(['home']),
    '/marketplace': base.concat(['marketplace']),
    '/account': base.concat(['account', 'tickets']),
    '/_error': base,
    '/events': base.concat(['event_creation', 'minters', 'marketers', 'approvers', 'events']),
    '/event': base.concat(['event_creation', 'minters', 'marketers', 'approvers', 'events']),
    '/ticket': base.concat(['events'])
};
