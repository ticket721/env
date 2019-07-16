export default {
    title: 'Auth Config Schema',
    description: 'Schema containg auth token',
    version: 0,
    type: 'object',
    properties: {
        token: {
            type: 'string'
        }
    },
    required: ['token']
};
