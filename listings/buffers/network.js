var zlib = require('zlib')
/*
* zlib提供了两种压缩方法
* deflate 是压缩
* inflat 是解压缩*/
var database = [[], [], [], [], [], [], [], []]
var bitmasks = [1, 2, 4, 8, 16, 32, 64, 128]

function store(buf) {
    // 这里保存header[0] 是db  , header[1] 是 key
    var db = buf[0]
    var key = buf.readUInt8(1)
    /*通常压缩之后的第一个字节是 0x78 所以根据这个我们来判断是否要压缩
    * 那么这里为什么要在 buf[2]开始呢? 因为key=buf.readUInt8(1) 已经在第一位处理了 键值了*/
    if (buf[2] === 0x78) {
        zlib.inflate(buf.slice(2), function (er, inflatedBuf) {
            if (er) return console.error(er)
            var data = inflatedBuf.toString()

            bitmasks.forEach(function (bitmask, index) {
                if ((db & bitmask) === bitmask) {
                    database[index][key] = data
                }
            })

            console.log('updated db', database)
        })
    }
}

zlib.deflate('my message', function (er, deflateBuf) {
    var header = new Buffer(2)
    header[0] = 8 // which databases to store  存放在第4给数据库 (8=00001000)
    header[1] = 0 // key

    var message = Buffer.concat([header, deflateBuf])
    store(message)
})
