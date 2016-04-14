'use strict';
var fs = require('fs');
var path = require('path');

module.exports = function(_path, callback) {
    let list = [];
    let count = 0;

    let doneLoop = function () {
        count--;
        if (count === 0) {
            callback(null, list);
        }
    };
    let toExec = function (_path) {
        count++;
        fs.readdir(_path, function (err, files) {
            if (err) {
                return callback(err);
            }

            if (files.length === 0) {
                doneLoop();
            }

            files.forEach(function (file, i) {
                var stat = fs.lstatSync(path.join(_path, file));
                if (stat.isFile()) {
                    if (path.extname(path.join(_path, file)) === '.js') {
                        list.push(path.join(_path, file));
                    }
                } else {
                    toExec(path.join(_path, file));
                }

                if ((i + 1) === files.length) {
                    doneLoop();
                }
            });
        });
    }
    toExec(_path);
};