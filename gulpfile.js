const { series } = require('gulp');
const shell = require('gulp-shell');

const load_net_config = async () => {

    if (!process.env.T721_CONFIG_PATH) {
        console.error(`Define T721_CONFIG_PATH env var`);
        process.exit(1);
    }

    const config = require(process.env.T721_CONFIG_PATH);

    process.env.T721_NETWORK = config.network.name;
    process.env.T721_NETWORK_ID = config.network.id;

    process.env.INFURA_PROJECT_KEY = config.infura.project_id;
    process.env.INFURA_SECRET_KEY = config.infura.project_secret;
    process.env.INFURA_URL = config.infura.node_endpoint;

    process.env.T721_SERVER_URL = config.server.url;

    process.env.T721_DEPLOYER = config.addresses.deployer;
    process.env.T721_ADMIN = config.addresses.admin;

    process.env.PORTALIZE_ARCHIVE_PREFIX = `${config.network.name}.portal`;

};


const network = require('./network/gulpfile');
const contracts = require('./contracts/gulpfile');
const server = require('./server/gulpfile');
const identity = require('./identity/gulpfile');

if (!process.env.T721_NETWORK) {
    process.env.T721_NETWORK = 'local';
}

if (!process.env.T721_SERVER) {
    process.env.T721_SERVER = 'development';
}

const PortalizeInit = 'portalize:init';
const PortalizeDismantle = 'portalize:dismantle';
const PortalizeFreeze = 'portalize:freeze';

const portalize_init = shell.task('./node_modules/.bin/portalize init ./portalize.config.json', {verbose: true});
portalize_init.displayName = PortalizeInit;

const portalize_dismantle = shell.task('./node_modules/.bin/portalize dismantle ./portalize.config.json', {verbose: true});
portalize_init.displayName = PortalizeDismantle;

const portalize_freeze = shell.task('./node_modules/.bin/portalize freeze ./portalize.config.json', {verbose: true});
portalize_freeze.displayName = PortalizeFreeze;


// Cleans all portals
exports.clean = series(server['server:clean'], contracts['contracts:clean'], network['network:clean'], identity['identity:clean']);

// Deploys contracts and get portal ready for api and web-app
exports.deploy = series(identity['identity:inject'], network['network:start'], contracts['contracts:configure'], contracts['contracts:deploy']);
exports.deploy_rinkeby = series(load_net_config, exports.deploy, portalize_freeze);

// Generate fake events and tickets
exports.simulation = series(contracts['contracts:simulation']);

exports.farm = series(load_net_config, network['network:farmer']);

// Mine blocks
exports.fake_mine = series(network['network:mine']);

// Main start and end, used once
exports.init = series(portalize_init);
exports.dismantle = series(exports.clean, portalize_dismantle);

