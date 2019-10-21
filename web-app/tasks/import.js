const ncp = require('ncp');
const {from_current} = require('./misc');

module.exports.import_assets = async function() {

    return new Promise((ok, ko) => {
        ncp(from_current('./portal/assets'), from_current('./static/assets'), (err) => {
            if (err) {
                console.error(err);
                ko(err);
            } else {
                console.log('Properly imported assets');
                ok();
            }
        });
    });

}
