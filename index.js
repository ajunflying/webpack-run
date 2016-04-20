'use strict';

require('./lib/colors.js');
var readDir = require('./lib/readDir.js');

var fs = require('fs');
var path = require('path');

module.exports = WebpackRun;

/*
 * _path：要编译的文件夹路径，如：/fedev/page
 * config_path：webpack的配置文件路径，如：path.join(__dirname, 'webpack.config.js')，这个一定要绝对路径
 * */
function WebpackRun(_path, config_path) {
    this.relative_path = process.cwd();
    this._path = path.join(this.relative_path, _path).replace(/\\/g, '/');

    this.config_path = config_path || '';

    this.removeFile = [];
    this.prefix = 'bl';
    this.env = WebpackRun.Env.watch;
}

WebpackRun.Env = {
    watch: 'watch',
    normal: 'normal'
};

/*设置监听执行还是只执行一次*/
WebpackRun.prototype.setEnv = function (env) {
    var self = this;
    if (WebpackRun.Env.hasOwnProperty(env)) {
        self.env = env;
    }
};

/*设置不编译的文件，数组，值为全路径*/
WebpackRun.prototype.setRemoveFile = function (list) {
    var self = this;
    self.removeFile = list || [];
}

/*设置文件名后缀的替换*/
WebpackRun.prototype.setPrefix = function (str) {
    this.prefix = str;
}

/*执行*/
WebpackRun.prototype.do = function (callback) {
    var self = this;
    if (!self._path) {
        return callback(new Error('必须设置路径 完成路径 如: d:/work/dev/page'));
    }

    let pathList = self._path.split('/'),
        dirname = pathList[pathList.length - 1];// 获取入口文件夹

    /*判断webpack.config.js文件*/
    self.config_path = self.config_path ? self.config_path : path.join(self._path, 'webpack.config.js');
    self.config_path = self.config_path.replace(/\\/g, '/');
    let replacePath = self.config_path.replace('/webpack.config.js', '');

    if (!fs.existsSync(self.config_path)) {
        return callback(new Error('未找到webpack的配置文件'));
    }
    readDir(self._path, function (error, _list) {
        if (error) {
            return callback(error);
        }
        let obj = {};
        _list.sort();
        _list.forEach(function (item) {
            if (self.removeFile.indexOf(item) > -1) {
                return;
            }
            item = item.replace(/\\/g, '/');

            let temp = item.split('/');

            let _filename = temp[temp.length - 1].split('.');
            _filename.pop();

            if (self.prefix && _filename[_filename.length - 1] === self.prefix) {
                _filename.pop();
            }

            /*文件名转key*/
            let _key = _filename.join('_');
            temp[temp.length - 1] = _key;

            _key = temp.slice(temp.indexOf(dirname) + 1, temp.length);
            if (_key.length > 1) {
                _key = _key.join('/');
            } else {
                _key = _key[0];
            }
            obj[_key] = item.replace(replacePath, '.');
        });

        /*生成新文件*/
        fs.writeFileSync(path.join(self.config_path.replace('webpack.config.js', ''), 'webpack.config.entry.js'), 'module.exports = ' + JSON.stringify(obj));
        /*生成新文件*/

        console.log('webpack entry生成完成，若是有疑问可以查看webpack.config.entry.js文件，看看生成的entry对象是否正确\r\n'.info);

        var config = require(self.config_path);

        config.entry = obj;

        require('./lib/' + self.env + 'Run.js')(config);
    });
};