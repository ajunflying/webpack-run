'use strict';
var path = require('path');
var WebpackRun = require('./index.js');

var webpackRun = new WebpackRun(path.join(__dirname, 'lib'), path.join(__dirname, 'webpack.config.js'));

webpackRun.do(function(err){
    if(err){
        console.log(err);
    }
});