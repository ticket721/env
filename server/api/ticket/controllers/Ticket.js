'use strict';
const CompanionAuthProof = require('../../../sign_utils/CompanionAuthProof');

/**
 * Ticket.js controller
 *
 * @description: A set of functions called "actions" for managing `Ticket`.
 */

module.exports = {

    /**
     * Check if owner owned ticket and return username
     *
     * @return {string}
     */

    checkOwner: async (ctx) => {
        const edit_event_id = ctx.request.body.event_id;
        const edit_companion_address = ctx.request.body.companion_address;
        const edit_ticket_id = ctx.request.body.ticket_id;
        if (!edit_event_id || !edit_companion_address || !edit_ticket_id) {
            return ctx.response.badRequest('Body is incomplete');
        }

        const address = await strapi.services.address.fetchAll({
            address: edit_companion_address
        });

        const companion = await strapi.services.companion.fetchAll({
            companion: address[0].id
        });

        const ticket = await strapi.services.ticket.fetchAll({
            ticket_id: edit_ticket_id,
            owner: companion[0].wallet.id,
            event: edit_event_id
        });

        const event_ticket = await strapi.services.ticket.fetchAll({
            event: edit_event_id,
            ticket_id: edit_ticket_id
        });

        if (ticket) {
            if (event_ticket.length === 0) {
                return ctx.response.badRequest('Unrelated Event');
            }

            return {
                username: ticket[0].owner.username,
                user_id: ticket[0].owner.id
            };
        }

        return ctx.response.badRequest('Not the owner');
    },

    /**
     * Retrieve ticket records of wallet linked to companion
     *
     * @return {Object|Array}
     */
    companionList: async (ctx) => {
        const edit_body = ctx.request.body.body;
        const edit_signature = ctx.request.body.signature;
        const date = Date.now();

        if (!edit_body || !edit_signature) {
            return ctx.response.badRequest('Missing Body and Signature');
        }

        if (typeof edit_body.timestamp !== 'number') {
            return ctx.response.badRequest('Missing timestamp');
        }

        if (date > edit_body.timestamp + (2 * 60 * 1000)) {
            return ctx.response.clientTimeout();
        }


        try {

            const cap = new CompanionAuthProof();
            const signer = await cap.verifyProof(edit_body.timestamp, edit_body.device_identifier, edit_signature);

            const companion = await strapi.services.companion.fetchAll({
                device_identifier: edit_body.device_identifier
            });

            if (companion.length === 0) {
                return {
                    linked: false,
                    linked_to: null,
                    tickets: []
                }
            }

            if (companion[0].companion.address.toLowerCase() !== signer.toLowerCase()) {
                return {
                    linked: false,
                    linked_to: null,
                    tickets: []
                };
            }

            if (companion[0].wallet === null) {

                console.log('delete crippled companion');
                await strapi.services.companion.remove({id: companion[0].id});

                return {
                    linked: false,
                    linked_to: null,
                    tickets: []
                };

            }

            const tickets = await strapi.services.ticket.fetchAll({
                owner: companion[0].wallet.id
            }, ['event', 'event.address', 'event.banners', 'event.image']);

            return {
                linked: true,
                linked_to: companion[0].wallet.address,
                tickets
            };

        } catch (e) {
            console.error(e);
            return ctx.response.badRequest();
        }

    },

    /**
     * Retrieve ticket records.
     *
     * @return {Object|Array}
     */

    find: async (ctx, next, {populate} = {}) => {
        if (ctx.query._q) {
            return strapi.services.ticket.search(ctx.query);
        } else {
            return strapi.services.ticket.fetchAll(ctx.query, populate);
        }
    },

    /**
     * Retrieve a ticket record.
     *
     * @return {Object}
     */

    findOne: async (ctx) => {
        return strapi.services.ticket.fetch(ctx.params);
    },

    /**
     * Count ticket records.
     *
     * @return {Number}
     */

    count: async (ctx, next, {populate} = {}) => {
        if (ctx.query._q) {
            return strapi.services.ticket.filterableCountSearch(ctx.query);
        } else {
            return strapi.services.ticket.filterableCountFetchAll(ctx.query, populate);
        }
    },

    /**
     * Create a/an ticket record.
     *
     * @return {Object}
     */

    create: async (ctx) => {
        return strapi.services.ticket.add(ctx.request.body);
    },

    /**
     * Update a/an ticket record.
     *
     * @return {Object}
     */

    update: async (ctx, next) => {
        return strapi.services.ticket.edit(ctx.params, ctx.request.body) ;
    },

    /**
     * Destroy a/an ticket record.
     *
     * @return {Object}
     */

    destroy: async (ctx, next) => {
        return strapi.services.ticket.remove(ctx.params);
    }
};
