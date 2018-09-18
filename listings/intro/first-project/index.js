var CountStream = require('./countstream'); //<co id="callout-intro-countstream-index-1" />
// 正则是book的
var countStream = new CountStream('book'); //<co id="callout-intro-countstream-index-2" />
var https = require('https');

https.get('https://www.manning.com', function(res) { //<co id="callout-intro-countstream-index-3" />
  // pipe 通过打印发现,是dom 树  直接调用了  _write   私有方法.
  res.pipe(countStream); //<co id="callout-intro-countstream-index-4" />
});

countStream.on('total', function(count) {
  console.log('Total matches:', count);
});
