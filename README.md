# webpack-run
##### webpack 自动构建脚本

> 安装 cnpm install git://github.com/ajunflying/webpack-run.git

###### demo
```
  var path = require('path');
  var WebpackRun = require('webpack-run');
  var webpackRun = new WebpackRun(path.join(__dirname, 'page'));
  
  webpackRun.setRemoveFile([
    path.join(__dirname, 'page', 'a.js')
  ]);
  
  //webpackRun.setEnv(WebpackRun.Env.normal);

  webpackRun.do(function (error) {
      console.log(error); 
  });
```



###### 方法
* setRemoveFile  添加不构建的文件，完整绝对路径
* setEnv  运行方式，默认监听运行，normal watch，
* setPrefix 需要替换的文件名后缀 默认.bl
* do  运行入口
  
