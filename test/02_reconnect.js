"use strict";
var su = require('stream-url');
require('..');

var tape = require('tape');
if (typeof(window)==='object') {
    var tape_dom = require('tape-dom');
    tape_dom.installCSS();
    tape_dom.stream(tape);
}

tape ('2.A reconnect with limit number of attempts', function (t) {
    var url = 'tcp://localhost:1';
    var options = {reconnect: {maxRetries: 3, minDelay: 50}};
    var client = su.connect(url, options, function (err, sock) {
        t.notOk(sock, 'No socket expected');
        t.ok(err, 'Expected connection failure');
        t.end();
    });
});

tape ('2.B reconnect', function (t) {
    var port = Math.floor(Math.random()*10000) + 2000;
    var url = 'tcp://localhost:' + port;
    var options = {reconnect: {maxRetries: 2, minDelay: 100}};
    var client = su.connect(url, options, function (err, sock) {
        t.ok(sock, 'Expect established connection');
        t.notOk(err, 'No errors expected');
        client.disable();
        sock.end();
    });

    setTimeout(function () {
        var tcp_server = su.listen(url, function ready (err, serv) {
            t.pass('Server is listening');
            serv.on('connection', function (sock) {
                t.pass('New incoming connection');
                sock.write('something');
                sock.on('end', function () {
                    t.pass('Connection closed');
                    tcp_server.close();
                    t.end();
                });
            });
        });
    }, 50);
});

tape ('2.C reconnect after disconnect', function (t) {
    t.plan(7);

    var port = Math.floor(Math.random()*10000) + 2000;
    var url = 'tcp://localhost:' + port;

    var tcp_server = su.listen(url, function ready (err, serv) {
        t.pass('Server is listening');
        serv.on('connection', function (sock) {
            t.pass('New incoming connection');
            sock.end('something');
        });
    });

    var fired = 0;
    var options = {reconnect: {maxRetries: 2, minDelay: 100}};
    var client = su.connect(url, options, function (err, sock) {
        fired += 1;
        t.ok(sock, 'Expect established connection');
        t.notOk(err, 'No errors expected');
        if (fired >= 2) {
            client.disable();
            setTimeout(function () {
                tcp_server.close();
                t.end();
            }, 500);
        }
    });
});
