const { series } = require('gulp');
const shell = require('gulp-shell');

const network = require('./network/gulpfile');
const contracts = require('./contracts/gulpfile');
const server = require('./server/gulpfile');

if (!process.env.T721_NETWORK) {
    process.env.T721_NETWORK = 'local';
}

if (!process.env.T721_SERVER) {
    process.env.T721_SERVER = 'development';
}

const PortalizeInit = 'portalize:init';
const PortalizeDismantle = 'portalize:dismantle';

const portalize_init = shell.task('./node_modules/.bin/portalize init ./portalize.config.json', {verbose: true});
portalize_init.displayName = PortalizeInit;

const portalize_dismantle = shell.task('./node_modules/.bin/portalize dismantle ./portalize.config.json', {verbose: true});
portalize_init.displayName = PortalizeDismantle;

exports.init = series(portalize_init);
exports.clean = series(server['server:clean'], contracts['contracts:clean'], network['network:clean']);
exports.dismantle = series(exports.clean, portalize_dismantle);
exports.deploy = series(network['network:start'], contracts['contracts:configure'], contracts['contracts:deploy']);
exports.simulation = series(contracts['contracts:simulation']);
exports.server_setup = series(server['server:setup']);
exports.server_start = series(server['server:start']);
exports.fake_mine = series(network['network:mine']);


