//首先要启动一个redis 缓存的服务才行
var redis = require('redis');
var client = redis.createClient();

client.on('error', function(err) {
  console.error('Error:', err);
});

client.on('monitor', function(timestamp, args) { //<co id="callout-events-detect-2-1" />
  console.log('Time:', timestamp, 'arguments:', args);
});

client.on('ready', function() {
  // Start app here
  //   这里写redis 的业务代码  然后通过 monitor 来追踪是否有活动. 和 event的监听on 事件是一个意思吧
});
