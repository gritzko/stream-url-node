# Node API adapters for stream-url (TCP)

[stream-url][su] marries streams and urls. 

This package implements protocol adapters for all kinds of
streams Node.js API provides access to.

- [x] TCP, `tcp://address:port`
- [ ] filesystem sockets
- [ ] UDP
- [ ] HTTP
- [ ] stdin/stdout

API user can start a server or a client connection using an
ultra-compact universal interface of two methods:
`listen` and `connect`.

    // Server

    var su = require('stream-url-node');

    // start a WebSocket echo server
    su.listen ('tcp://localhost:1234', function ready(err, server) {

        server.on('connection', function (stream) {

            stream.on('data', stream.write.bind(stream));

        })

    });


    // Client

    var su = require('stream-url-ws');

    su.connect('tcp://localhost:1234', function ready(err, stream) {

        stream.on ('data', function log (data) {
            console.log(''+data);
            stream.end();
        });

        stream.write('Hello world!');

    });


[su]: https://github.com/gritzko/stream-url
