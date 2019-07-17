const {series} = require('gulp');
const {inject} = require('./tasks/inject');
const {clean} = require('./tasks/clean');

exports['identity:inject'] = series(inject);
exports['identity:clean'] = series(clean);
