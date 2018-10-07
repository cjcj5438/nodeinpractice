var fs = require('fs')
var join = require('path').join
// 传入正则. 开始文件的位置
exports.findSync = function (nameRe, startPath) {
    var results = []

    function finder(path) {
        // 这里读取文件目录为什么可以拿 . 做参数? . 表示从开始文件进行搜索  . 也表示当前工作目录
        var files = fs.readdirSync(path)

        for (var i = 0; i < files.length; i++) {
            var fpath = join(path, files[i])
            // 获取文件状态同步  返回文件信息.比如时间.大小.类型 基本上所有的内容都有
            var stats = fs.statSync(fpath)
            // 是不是文件目录
            if (stats.isDirectory()) finder(fpath) //接着找
            // 是不是文件
            if (stats.isFile() && nameRe.test(files[i])) results.push(fpath)
        }
    }

    finder(startPath)
    return results
}

exports.find = function (nameRe, startPath, cb) {
    var results = []
    var asyncOps = 0

    function finder(path) {
        asyncOps++
        fs.readdir(path, function (er, files) {
            if (er) return cb(er)

            files.forEach(function (file) {
                var fpath = join(path, file)

                asyncOps++
                fs.stat(fpath, function (er, stats) {
                    if (er) return cb(er)

                    if (stats.isDirectory()) finder(fpath)
                    if (stats.isFile() && nameRe.test(file)) results.push(fpath)

                    asyncOps--
                    if (asyncOps == 0) cb(null, results)
                })
            })

            asyncOps--
            if (asyncOps == 0) cb(null, results)
        })
    }

    finder(startPath)
}

console.log(exports.findSync(/file.*/, '.'))
exports.find(/file.*/, '.', console.log)
