const ncp = require('ncp');
const {from_current} = require('./misc');
const signale = require('signale');

module.exports.import_assets = async function() {

    return new Promise((ok, ko) => {
        ncp(from_current('./portal/assets'), from_current('./static/assets'), (err) => {
            if (err) {
                signale.fatal(err);
                ko(err);
            } else {
                signale.success('Properly imported assets');
                ok();
            }
        });
    });

}
