"use strict";
var net = require('net');
var stream_url = require('stream-url');

stream_url.register('tcp:', tcp_listen, tcp_connect);

function tcp_listen (url, options, callback) {
    var server = new net.createServer(options);
    if (!url.port) {
        throw new Error('please specify port number');
    }
    server.listen(url.port, url.hostname || '0.0.0.0', function () {
        callback(null, server);
    });
}

function tcp_connect (url, options, callback) {
    var stream = new net.Socket(options);
    stream.connect({
        port: url.port,
        host: url.hostname
    }, function () {
        callback(null, stream);
    });
    return stream;
}
