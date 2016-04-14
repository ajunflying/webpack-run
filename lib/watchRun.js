'use strict';
var webpack = require('webpack');
require('./colors.js');

module.exports = function(config){
    let webpack_count = 0;
    var compiler = webpack(config);
    compiler.watch({
        aggregateTimeout: 300,
        poll: true
    }, function (err, stats) {
        if (err) {
            console.log(err);
            return;
        }
        webpack_count++;
        var jsonStats = stats.toJson();
        if (jsonStats.errors.length > 0) {
            console.log(('构建失败——错误：>>>>>>>>>>>>>>>>>第一次' + webpack_count).error);
            console.log(jsonStats.errors[0].error);
            console.log('\r\n\r\n');
            return;
        }
        if (jsonStats.warnings.length > 0) {
            console.log(('构建失败——警告：>>>>>>>>>>>>>>>>>第一次' + webpack_count).warn);
            console.log(jsonStats.warnings[0].warn);
            console.log('\r\n\r\n');
            return;
        }
        console.log(('很成功的构建完成开心吧^_^......' + new Date() + '   第一次' + webpack_count + '\r\n\r\n').info);
    });
}