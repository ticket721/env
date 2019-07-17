const { Portalize } = require('portalize');
const {from_current} = require('./misc');

module.exports.check_assets = async function() {
    Portalize.get.setPortal(from_current('./portal'));
    Portalize.get.setModuleName('web-app');

        if (!Portalize.get.requires({
            action: 'add',
            file: 'asset_manifest.json',
            from: 'identity'
        })) {
            throw new Error('Unable to find asset manifest attesting asset injection');
        }


}
