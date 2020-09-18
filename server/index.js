// key will contain host and port required for connection to redis
const keys = require('./keys');
const listeningPort = 5000;

/************************************************
Express App Setup
************************************************/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());


/************************************************
Postgres Client Setup
************************************************/
const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
// creates a table if it does not yet exist 
// and logs an error if unsuccessful
pgClient.on('connect', () => {
    pgClient
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((err) => console.log(err));
});

/************************************************
Redis Client Setup
************************************************/
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000  // reconnect automatically on 
                                // connection lost every second
});
// creating a duplicate so that main object is never blocked/waiting
const redisPublisher = redisClient.duplicate();


/************************************************
Express route handlers
************************************************/
app.get('/', (req, res) => {
    res.send('Hello there');
});

app.get('/values/all', async(req,res) => {
    const values = await pgClient.query('SELECT * from values');

    res.send(values.rows);
});

app.get('/values/current', async(req,res) => {
    // using not a fancy promise (await notation) here since the 
    // redis version used in this project do not have support for this.
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values/input', async(req,res) => {
    // index is the value input by user
    // not validated since this app is a prototype
    const index = req.body.index;

    // arbitrary limit on size for calculated values
    if(parseInt(index) > 1000){
        return res.status(422).send('Index too high');
    }

    // set value in redis black to before calculation
    redisClient.hset('values', index, '');
    // push value into redis to be processed by worker node
    redisPublisher.publish('insert', index);
    // store processed values
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.statusCode(202)
    res.send({working:true});
});

/************************************************
Express port listening
************************************************/
app.listen(listeningPort, err => {
    console.log('Listening on port ' + listeningPort);
});