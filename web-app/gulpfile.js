const {series} = require('gulp');
const {check_assets} = require('./tasks/check');
const {import_assets} = require('./tasks/import');

exports['webapp:setup'] = series(check_assets, import_assets);
