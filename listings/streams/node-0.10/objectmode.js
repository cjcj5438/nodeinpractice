var stream = require('stream');
var util = require('util');

util.inherits(MemoryStream, stream.Readable);

function MemoryStream(options) {
  options = options || {};
  options.objectMode = true; //<co id="listing-streams-objectmode-1" />
  stream.Readable.call(this, options); //把参数传给 stream.Readable 构造函数
}

MemoryStream.prototype._read = function(size) {
  // console.log(this)
  this.push(process.memoryUsage());// 用node 内置方法来创建一个对象 //<co id="listing-streams-objectmode-2" />
};

var memoryStream = new MemoryStream();
memoryStream.on('readable', function() { //添加一个监听器 <co id="listing-streams-objectmode-3" />
  var output = memoryStream.read();
  console.log('Type: %s, value: %j', typeof output, output);
});

// 为什么最后会输出三遍 console.log 应该是有一定的时效性把