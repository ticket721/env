'use strict';
const EthSigUtil = require('eth-sig-util');
const { utils } = require('ethers');

/**
 * Addresscode.js controller
 *
 * @description: A set of functions called "actions" for managing `Addresscode`.
 */

module.exports = {

    /**
     * Retrieve addresscode records.
     *
     * @return {Object|Array}
     */

    find: async (ctx, next, { populate } = {}) => {
        if (ctx.query._q) {
            return strapi.services.addresscode.search(ctx.query);
        } else {
            return strapi.services.addresscode.fetchAll(ctx.query, populate);
        }
    },

    /**
     * Retrieve a addresscode record.
     *
     * @return {Object}
     */

    findOne: async (ctx) => {
        return strapi.services.addresscode.fetch(ctx.params);
    },

    /**
     * Count addresscode records.
     *
     * @return {Number}
     */

    count: async (ctx, next, { populate } = {}) => {
        return strapi.services.addresscode.count(ctx.query, populate);
    },

    /**
     * Create new addresscode
     *
     * @return {Number}
     */

    issue: async (ctx) => {
        const edit_body = ctx.request.body.body;
        const edit_signature = ctx.request.body.signature;
        const date = Date.now();

        console.log(ctx);

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

            let code           = '';
            const length = 6;
            const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            const charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
                code += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            const did_idx = edit_body.findIndex((elem) => elem.name === 'device_identifier');

            return strapi.services.addresscode.add({
                code,
                address: utils.getAddress(signer.toLowerCase()),
                device_identifier: edit_body[did_idx].value
            });

        }
        catch (e) {
            return ctx.response.badRequest();
        }

    },

    /**
     * Create a/an addresscode record.
     *
     * @return {Object}
     */

    create: async (ctx) => {
        return strapi.services.addresscode.add(ctx.request.body);
    },

    /**
     * Update a/an addresscode record.
     *
     * @return {Object}
     */

    update: async (ctx, next) => {
        return strapi.services.addresscode.edit(ctx.params, ctx.request.body) ;
    },

    /**
     * Destroy a/an addresscode record.
     *
     * @return {Object}
     */

    destroy: async (ctx, next) => {
        return strapi.services.addresscode.remove(ctx.params);
    }
};
