"use strict";
var su = require('stream-url');
require('..');

var tape = require('tape');
if (typeof(window)==='object') {
    var tape_dom = require('tape-dom');
    tape_dom.installCSS();
    tape_dom.stream(tape);
}

tape ('1.A create echo server', function (t) {
    var port = Math.floor(Math.random()*10000) + 2000;
    var url = 'tcp://localhost:'+port;
    t.plan(4);
    var tcp_server = su.listen(url, function ready(err, serv) {
        console.log('ready');
        serv.on('connection', function (stream) {
            console.log('conn in');
            stream.on('data', function (data) {
                console.log('data', data);
                stream.write(data);
            });
            stream.on('end', function () {
                t.pass('server stream ends');
                serv.close();
            });
        });
        var sock_outer = su.connect(url, function (err, sock) {
            console.log('connected');
            sock.on('data', function (data) {
                t.equal(''+data, 'test');
                sock.end(); // TODO on(end)
            });
            sock.write('test', function () {
                t.pass('sent');
            });
            sock.on('end', function () {
                t.pass('client stream ends');
                t.end();
            });
        });
    });
});

tape ('1.B listen fails', function (t) {
    t.plan(2);
    var server = su.listen('tcp://localhost:1', function on_fail(err, serv) {
        t.ok(err);
        t.equal(serv, null);
        t.end();
    });
});
