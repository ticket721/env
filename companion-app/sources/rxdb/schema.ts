export const imagestore = {
    'title': 'imagesstore',
    'version': 0,
    'description': 'Images cache',
    'type': 'object',
    'properties': {

        'hash': {
            'type': 'string',
            'primary': true
        },

        'uri_source': {
            'type': ['string', 'null']
        },

    }
};

export const companionstore = {
    'title': 'companionstore',
    'version': 0,
    'description': 'The complete store of the application',
    'type': 'object',
    'properties': {

        'wallet': {
            'type': ['string', 'null']
        },

        'device_identifier': {
            'type': ['string', 'null']
        },

        'selected_network': {
            'type': ['string', 'null']
        },

        'networks': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {

                    'linked_to': {
                        'type': ['string', 'null']
                    },

                    'name': {
                        'type': 'string'
                    },

                    'strapi_url': {
                        'type': 'string'
                    },

                    'eth_node_url': {
                        'type': 'string'
                    },

                    'tickets': {
                        'type': 'array',
                        'items': {
                            'type': ['object', 'null'],
                            'properties': {

                                'id': {
                                    'type': 'number'
                                },

                                'ticket_id': {
                                    'type': 'number'
                                },

                                'mint_block': {
                                    'type': 'number'
                                },

                                'creation': {
                                    'type': 'number'
                                },

                                'mint_price': {
                                    'type': 'string'
                                },

                                'mint_currency': {
                                    'type': 'string'
                                },

                                'owner': {
                                    'type': 'string'
                                },

                                'event': {
                                    'type': 'object',
                                    'properties': {

                                        'name': {
                                            'type': 'string'
                                        }

                                    }
                                }

                            }
                        }
                    }

                }
            }
        },

    }
};
