'use strict';
const EthSigUtil = require('eth-sig-util');

/**
 * Address.js controller
 *
 * @description: A set of functions called "actions" for managing `Address`.
 */

module.exports = {

    companionLink: async (ctx) => {
        const edit_body = ctx.request.body.body;
        const edit_signature = ctx.request.body.signature;
        const date = Date.now();

        if (!edit_body || !edit_signature) {
            return ctx.response.badRequest('Missing Body and Signature');
        }

        const authorized_fields = ['timestamp', 'code'];

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

            const code_idx = edit_body.findIndex((elem) => elem.name === 'code');

            const code = edit_body[code_idx].value.toUpperCase();

            const address_code = await strapi.services.addresscode.fetchAll({
                code
            });

            if (address_code.length === 0) {
                return ctx.response.notFound();
            }

            let companion_address = await strapi.services.address.fetchAll({
                address: address_code[0].address
            });

            if (companion_address.length === 0) {
                companion_address = [await strapi.services.address.add({
                    address: address_code[0].address,
                    event: false,
                    admin: false,
                    companion: true
                })];
            } else {
                if (companion_address[0].linked_wallet) {
                    return ctx.response.badRequest();
                }
            }

            let wallet_address = await strapi.services.address.fetchAll({
                address: signer
            });

            if (wallet_address.length === 0) {
                wallet_address = [await strapi.services.address.add({
                    address: signer,
                    event: false,
                    admin: false,
                    companion: false
                })];
            }

            let companion = await strapi.services.companion.add({
                device_identifier: address_code[0].device_identifier,
                wallet: wallet_address[0].id,
                companion: companion_address[0].id
            });

            await strapi.services.addresscode.remove({
                id: address_code[0].id
            });

            return companion;

        }
        catch (e) {
            return ctx.response.badRequest();
        }

    },

    /**
     * Retrieve all events linked to tickets owner by address
     *
     * @return {Object|Array}
     */
    eventsOfTickets: async (ctx, next, {populate} = {}) => {
        if (ctx.query._q) {
            const addresses = await strapi.services.address.search(ctx.query);

            const ret = [];
            const added = {};
            for (const address of addresses.models) {
                const tickets = await strapi.services.ticket.fetchAll({
                    owner: address.id
                });

                const add = {
                    id: address.id,
                    address: address.address,
                    events: tickets.models.map(ticket => ticket.relations.event)
                };

                add.events = add.events.filter((event, idx) => add.events.findIndex((sub_event) => sub_event.id === event.id) === idx);

                ret.push(add);
            }

            return ret;
        } else {
            const addresses = await strapi.services.address.fetchAll(ctx.query, populate);

            const ret = [];
            for (const address of addresses) {
                const tickets = await strapi.services.ticket.fetchAll({
                    owner: address.id
                });

                const add = {
                    id: address.id,
                    address: address.address,
                    events: tickets.map(ticket => ticket.event)
                };


                add.events = add.events.filter((event, idx) => add.events.findIndex((sub_event) => event && sub_event.id === event.id) === idx);

                ret.push(add);
            }

            return ret;
        }
    },

    /**
     * Retrieve address records.
     *
     * @return {Object|Array}
     */

    find: async (ctx, next, {populate} = {}) => {
        if (ctx.query._q) {
            return strapi.services.address.search(ctx.query);
        } else {
            return strapi.services.address.fetchAll(ctx.query, populate);
        }
    },

    /**
     * Retrieve a address record.
     *
     * @return {Object}
     */

    findOne: async (ctx) => {
        return strapi.services.address.fetch(ctx.params);
    },

    /**
     * Count address records.
     *
     * @return {Number}
     */

    count: async (ctx, next, {populate} = {}) => {
        return strapi.services.address.count(ctx.query, populate);
    },

    /**
     * Create a/an address record.
     *
     * @return {Object}
     */

    create: async (ctx) => {
        return strapi.services.address.add(ctx.request.body);
    },

    /**
     * Update a/an address record.
     *
     * @return {Object}
     */

    update: async (ctx, next) => {
        const edit_body = ctx.request.body.body;
        const edit_signature = ctx.request.body.signature;
        const date = Date.now();

        if (!edit_body || !edit_signature) {
            return ctx.response.badRequest('Missing Body and Signature');
        }

        const authorized_fields = ['username', 'timestamp'];

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

            const address = await strapi.services.address.fetch(ctx.params);

            if (!address || signer.toLowerCase() !== address.attributes.address.toLowerCase()) {
                return ctx.response.unauthorized();
            }

            const ignored_fields = ['timestamp'];

            const body = {};
            edit_body
                .filter((elem) => ignored_fields.indexOf(elem.name) === -1)
                .forEach((elem) => body[elem.name] = elem.value);

            return strapi.services.address.edit(ctx.params, body) ;

        } catch (e) {
            return ctx.response.badRequest();
        }
    },

    /**
     * Destroy a/an address record.
     *
     * @return {Object}
     */

    destroy: async (ctx, next) => {
        return strapi.services.address.remove(ctx.params);
    }
};
