const { series } = require('gulp');
const shell = require('gulp-shell');

const PortalizeInit = 'portalize:init';
const PortalizeDismantle = 'portalize:dismantle';

const portalize_init = shell.task('./node_modules/.bin/portalize init ./portalize.config.json', {verbose: true});
portalize_init.displayName = PortalizeInit;

const portalize_dismantle = shell.task('./node_modules/.bin/portalize dismantle ./portalize.config.json', {verbose: true});
portalize_init.displayName = PortalizeDismantle;

exports.init = series(portalize_init);
exports.clean = series(portalize_dismantle);

