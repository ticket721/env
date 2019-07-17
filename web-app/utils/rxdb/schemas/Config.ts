export default {
    title: 'App Config Schema',
    description: 'Schema containing informations that requires persistence',
    version: 0,
    type: 'object',
    properties: {
        wallet_provider: {
            type: 'number'
        }
    },
    required: ['wallet_provider']
};
