// next.config.js
const withLess = require('@zeit/next-less');
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');
const webpack = require('webpack');
const withVideos = require('next-videos');


const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');
const {parsed: localEnv} = require('dotenv').config();

const themeVariables = lessToJS(
    fs.readFileSync(path.resolve(__dirname, './static/less/antd.custom.less'), 'utf8')
);

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
    require.extensions['.less'] = file => {}
}

module.exports = {
    webpack(config) {

        config.plugins.push(new webpack.EnvironmentPlugin({
            strapi_endpoint: localEnv.strapi_endpoint,
            google_api_token: localEnv.google_api_token,
            google_analytics_token: localEnv.google_analytics_token,
            tx_explorer: localEnv.tx_explorer,
            NODE_ENV: localEnv.NODE_ENV
        }));

        return config
    },
    ...withTypescript(withLess(withCSS(withImages(withVideos({
        assetPrefix: '',
        lessLoaderOptions: {
            javascriptEnabled: true,
            modifyVars: themeVariables
        }
    })))))
};

