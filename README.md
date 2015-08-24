# Node API adapter for stream-url (TCP)

[stream-url][su] marries streams and urls. 

This package implements protocol adaptors for all kinds of
streams Node.js API provides access to.
[v] TCP, `tcp://address:port`
[ ] filesystem sockets
[ ] UDP
[ ] HTTP
[ ] stdin/stdout

API user can start a server or a client connection using an
ultra-compact universal interface of two methods:
`listen` and `connect`.

    // Server

    var su = require('stream-url-node');

    // start a WebSocket echo server
    var server = su.listen ('tcp://localhost:1234', function ready() {

        server.on('connection', function (stream) {

            stream.on('data', stream.write.bind(stream));

        })

    });


    // Client

    var su = require('stream-url-ws');

    var stream = su.connect('tcp://localhost:1234', function ready() {

        stream.on ('data', function log (data) {
            console.log(''+data);
            stream.end();
        });

        stream.write('Hello world!');

    });


[su]: https://github.com/gritzko/stream-url
