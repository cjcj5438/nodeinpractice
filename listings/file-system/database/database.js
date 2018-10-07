var fs = require('fs')
var EventEmitter = require('events').EventEmitter

var Database = function (path) {
    this.path = path
    // 创建在内存中所有,记录的映射;
    this._records = Object.create(null)
    // 创建一个仅添加模式的写入流.处理磁盘写入;
    this._writeStream = fs.createWriteStream(this.path, {
        encoding: 'utf8',
        flags: 'a'//用于追加;如果文件不存在那么会创建文件;
    })
    //然后加载数据库
    this._load()
}

// 这里为什么要继承 事件;是为了 要在流存储完了之后.发出load 事件;
Database.prototype = Object.create(EventEmitter.prototype)

Database.prototype._load = function () {
    // 使用流来处理数据.有时候要在异步的时候.处理其他事件
    var stream = fs.createReadStream(this.path, {encoding: 'utf8'})
    var database = this

    var data = ''
    stream.on('readable', function () {
        // 为什么?
        data += stream.read()//读取可用数据
        var records = data.split('\n')//按行分割数据记录.
        data = records.pop()//获取最后一个可能未完成的记录
        // 当readable事件触发时.我么那只是咋最后pop()一下.是要做什么呢?而且最后记录的通常是一个空字符串,,
        //     因为我们每一行都是以换行符(\n) 结束

        // 这里是处理每一个 不符合要求的records[i]
        for (var i = 0; i < records.length; i++) {
            try {
                var record = JSON.parse(records[i])
                // 如果是null 那么就删除这个 属性
                if (record.value == null)
                    delete database._records[record.key]
                else
                    database._records[record.key] = record.value
            } catch (e) {
                database.emit('error', 'found invalid record:', records[i])
            }
        }
    })
// 流读完 准备好  然后触发 load 事件
    stream.on('end', function () {
        database.emit('load')
    })
}

Database.prototype.get = function (key) {
    return this._records[key] || null
}

Database.prototype.set = function (key, value, cb) {
    var toWrite = JSON.stringify({key: key, value: value}) + '\n'
    if (value == null)
        delete this._records[key]
    else
        this._records[key] = value
    this._writeStream.write(toWrite, cb)
}

Database.prototype.del = function (key, cb) {
    return this.set(key, null, cb)
}

module.exports = Database
