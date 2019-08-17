'use strict';
const EthSigUtil = require('eth-sig-util');

/**
 * Ticket.js controller
 *
 * @description: A set of functions called "actions" for managing `Ticket`.
 */

module.exports = {


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

        const authorized_fields = ['timestamp', 'device_identifier'];

        for (const field of edit_body) {
            if (authorized_fields.indexOf(field.name) === -1) {
                return ctx.response.badRequest(`Illegal field in signature payload: ${field.name}`);
            }
        }

        const timestamp_idx = edit_body.findIndex((elem) => elem.name === 'timestamp');

        if (timestamp_idx === -1 || typeof edit_body[timestamp_idx].value !== 'number') {
            return ctx.response.badRequest('Missing timestamp');
        }

        if (date > edit_body[timestamp_idx].value + (2 * 60 * 1000)) {
            return ctx.response.clientTimeout();
        }

        try {
            const signer = EthSigUtil.recoverTypedSignature({
                data: edit_body,
                sig: edit_signature
            });

            const device_identifier_idx = edit_body.findIndex((elem) => elem.name === 'device_identifier');

            const companion = await strapi.services.companion.fetchAll({
                device_identifier: edit_body[device_identifier_idx].value
            });

            if (companion.length === 0) {
                return ctx.response.notFound();
            }

            if (companion[0].companion.address.toLowerCase() !== signer) {
                return ctx.response.forbidden();
            }

            const tickets = await strapi.services.ticket.fetchAll({
                owner: companion[0].wallet.id
            });

            return tickets;

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
