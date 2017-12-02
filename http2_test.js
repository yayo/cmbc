

/*

/usr/bin/node --expose-http2 http2_test.js

nodejs_core_http2 NOT compatible with express

CRASHED: curl --http2-prior-knowledge -v -k -A '' https://127.0.0.1:443/
OK: curl --http1.1 -v -k -A '' https://127.0.0.1:443/
*/

'use strict';
const config_file="./config";
const config=require(config_file);
const http2 = require('http2');
const fs = require("fs");

const express = require('express');
const app = express();
app.get('/', (req, res) => { res.send('With_express_OK\n'); });

const server = http2.createSecureServer({
  allowHTTP1: true,
  key: fs.readFileSync(config.server.listen.tls.key),
  cert: fs.readFileSync(config.server.listen.tls.cert), }
,app // CRASHED
);

server.on('error', (err) => console.error(err));
server.on('socketError', (err) => console.error(err));
server.on('stream', (stream, headers) => { stream.respond({ 'content-type': 'text/plain', ':status': 200 }); stream.end('Without_express_OK\n'); });

server.listen(443,"127.0.0.1");

/*
CRASHED: https://github.com/nodejs/node/issues/14672
_http_incoming.js:104            
  if (this.socket.readable)      
                  ^              

TypeError: Cannot read property 'readable' of undefined            
    at IncomingMessage._read (_http_incoming.js:104:19)            
    at IncomingMessage.Readable.read (_stream_readable.js:445:10)  
    at IncomingMessage.read (_http_incoming.js:96:15)              
    at resume_ (_stream_readable.js:825:12)                        
    at _combinedTickCallback (internal/process/next_tick.js:138:11)                                                                    
    at process._tickCallback (internal/process/next_tick.js:180:9) 
*/

