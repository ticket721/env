'use strict';
const EthSigUtil = require('eth-sig-util');
const CompanionAuthProof = require('../../../sign_utils/CompanionAuthProof');
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

            let code           = '';
            const length = 6;
            const characters       = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            const charactersLength = characters.length;
            for ( let i = 0; i < length; i++ ) {
                code += characters.charAt(Math.floor(Math.random() * charactersLength));
            }

            return strapi.services.addresscode.add({
                code,
                address: utils.getAddress(signer.toLowerCase()),
                device_identifier: edit_body.device_identifier
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
