var fs = require('fs');
var path = require('path');
var async = require('async');
var exec = require('child_process').exec;
var log = require('winston');
var express = require('express');
var BinaryServer = require('binaryjs').BinaryServer;

async.waterfall([function(callback) {
  exec('ps aux | grep [r]aspistill', function(err, stdout, stderr) {
    if (stdout) {
      try {
        var pid = stdout.match(/\s+(\d{4,6})+\s+/gi)[0].trim();
        if (pid) {
          log.info('Raspistill running. PID:' + pid);
          callback(null, true);
         }
       } catch (e) {
        log.warn('Raspistill PID not found'); 
        callback(null, false);
      }
    } else {
      log.warn('Raspistill PID not found'); 
      callback(null, false);
    }
  });
}, function(isRunning, callback) {

  if (isRunning) return;

  var path = '/tmp/stream';
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, 0777);
  }

  log.info('Starting raspistill');

  var spawn = require('child_process').spawn;
  var raspistill = spawn('raspistill', ['-w', '640', '-h', '480', '-q', '5', '-o', '/tmp/stream/pic.jpg', '-tl', '1000', '-t', '9999999', '-th', '0:0:0', '-n', '-rot', '180']);

  raspistill.on('close', function(code, signal) {
    log.info('child process terminated due to receipt of signal ' + signal);
  });

  raspistill.stdout.on('data', function(data) {
    log.info('stdout:' + data);
  });

  raspistill.stderr.on('data', function(data) {
    log.error('stderr:' + data);
  });

  raspistill.stdin.on('data', function(data) {
    log.info('stdin:' + data);
  });

  callback(null, 'done');
}], function(err, result) {
  if (err) throw new Error(err);
  log.info(result);
});

var app = express();
var port = process.env.PORT || 9000;

app.use(express.static(__dirname + '/public'));

app.listen(port, function() {
  log.info('Listening on port ' + port);
});

var server = BinaryServer({port: 9001});

server.on('connection', function(client){
  log.info('BinaryJS connected');
  client.on('stream', function() {
    console.log('sending stream');
    var file = fs.createReadStream('/tmp/stream/pic.jpg');
    client.send(file);
  });
});

process.on('exit', function() {
  log.error('Fatal error. Exiting.'); 
});
