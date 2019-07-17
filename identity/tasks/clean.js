const { from_current } = require('./misc');
const rimraf = require('rimraf').sync;
const signale = require('signale');
const fs = require('fs');
const {Portalize} = require('portalize');

module.exports.clean = async function clean() {
    if (!fs.existsSync(from_current('./portal'))) {
        throw new Error('Portal does not exist');
    }

    Portalize.get.setPortal(from_current('./portal'));
    Portalize.get.setModuleName('identity');

    try {
        rimraf(from_current('./portal/assets'));
        Portalize.get.clean();
        signale.success('Removed assets')
    } catch (e) {
        signale.fatal(e);
    }

};
