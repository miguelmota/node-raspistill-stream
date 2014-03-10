var express = require('express');
var log = require('winston');
var fs = require('fs');
var BinaryServer = require('binaryjs').BinaryServer;

var app = express();
var port = process.env.PORT || 9000;

app.get('/', function(req, res) {
  log.info('/ route called');
  res.sendfile(__dirname + '/index.html');
});

app.listen(port, function() {
  log.info('Listening on port ' + port);
});

var server = BinaryServer({port: 9001});

server.on('connection', function(client){
  log.info('BinaryJS connected');
  var file = fs.createReadStream('/tmp/stream/pic.js');
  client.send(file);
});
