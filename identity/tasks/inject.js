const { from_current } = require('./misc');
const ncp = require('ncp');
const signale = require('signale');
const fs = require('fs');
const {Portalize} = require('portalize');

module.exports.inject = async function inject() {
    if (!fs.existsSync(from_current('./portal'))) {
        throw new Error('Portal does not exist');
    }

    Portalize.get.setPortal(from_current('./portal'));
    Portalize.get.setModuleName('identity');

    return new Promise((ok, ko) => {
        ncp(from_current('./assets/raw'), from_current('./portal/assets'), (err) => {
            if (err) {
                signale.fatal(err);
                ko(err);
            } else {
                signale.success('Imported assets into portal');
                Portalize.get.add('asset_manifest.json', {assets_added: new Date(Date.now())});
                ok();
            }
        })
    });
};
