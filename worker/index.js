// key will contain host and port required for connection to redis
const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000  // reconnect automatically on 
                                // connection lost every second
});
// creating a duplicate so that main object is never blocked/waiting
const redisSubscriber = redisClient.duplicate();

// fibonacci sequence calculated using memoization
function fib(num, mem) {
    mem = mem || {};
  
    if (mem[num]) return mem[num];
    if (num <= 1) return 1;
  
    return mem[num] = fib(num - 1, mem) + fib(num - 2, mem);
}

redisSubscriber.on('message', (channel, message) => {
    redisClient.hset('values', message, fib(parseInt(message)))
})
redisSubscriber.subscribe('insert');