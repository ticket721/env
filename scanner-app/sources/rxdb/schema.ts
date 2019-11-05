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

export const scannerstore = {
    'title': 'scannerstore',
    'version': 0,
    'description': 'The complete store of the application',
    'type': 'object',
    'properties': {

        'selected_network': {
            'type': ['string', 'null']
        },

        'networks': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {

                    'name': {
                        'type': 'string'
                    },

                    'strapi_url': {
                        'type': 'string'
                    },

                    'eth_node_url': {
                        'type': 'string'
                    },

                    'events': {
                        'type': 'array',
                        'items': {
                            'type': ['object', 'null'],
                            'properties': {

                                'address': {
                                    'type': 'string'
                                },

                                'name': {
                                    'type': 'string'
                                },
                                
                                'description': {
                                    'type': 'string'
                                },

                                'location': {
                                    'type': 'string'
                                },

                                'id': {
                                    'type': 'number'
                                },

                                'start': {
                                    'type': 'string'
                                },

                                'end': {
                                    'type': 'string'
                                },

                                'verified_tickets': {
                                    'type': 'array',
                                    'items': {
                                        'type': ['object', 'null'],
                                        'properties': {

                                            'ticket_id': {
                                                'type': 'number'
                                            },

                                            'owner': {
                                                'type': ['object', 'null'],
                                                'properties': {

                                                    'username': {
                                                        'type': ['string', 'null']
                                                    },

                                                    'user_id': {
                                                        'type': 'number'
                                                    }
                                                }
                                            },

                                            'timestamp': {
                                                'type': 'number'
                                            }
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
