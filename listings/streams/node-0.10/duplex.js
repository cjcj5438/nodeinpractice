var stream = require('stream');

//这和util的拷贝对象 是一样的 吗?
HungryStream.prototype = Object.create(stream.Duplex.prototype, {
  constructor: { value: HungryStream }
});

function HungryStream(options) {
  stream.Duplex.call(this, options);
  // 添加一个写的状态
  this.waiting = false; //<co id="callout-streams-duplex-1" />
}
/*enoding 不知道是做什么的
* callback() 这样写除了代码可扩展, 有实际意义吗?*/
HungryStream.prototype._write = function(chunk, encoding, callback) {
  this.waiting = false;
  this.push('\u001b[32m' + chunk + '\u001b[39m'); // 把实现的数据推到内部队列,
  callback(); // 然后执行内部的回掉函数
};

HungryStream.prototype._read = function(size) {
  if (!this.waiting) {
    this.push('Feed me data! > '); //<co id="callout-streams-duplex-3" />
    this.waiting = true;
  }
};

var hungryStream = new HungryStream();
// 不知道为什么写完之后就 会有输出流  方法是自动调用的吗?
process.stdin.pipe(hungryStream).pipe(process.stdout); //<co id="callout-streams-duplex-4" />
