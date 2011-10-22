/*
 * bindings.js: Example for running daemons directly using methods exposed by add-on bindings.
 *
 * (C) 2010, Charlie Robbins.
 *
 */

var util = require('util'),
    fs = require('fs'),
    http = require('http');

var daemon;
try {
  daemon = require('../lib/daemon');
}
catch (ex) {
  util.puts("Couldn't find 'daemon' add-on, did you install it yet?");
  process.exit(0);
}

var config = {
  // Location of lockFile
  lockFile: process.argv[3] || '/tmp/testd.pid',  
  // Location of logFile
  logFile:  process.argv[4] || '/tmp/testd.log'   
};

var args = process.argv;

// Handle start stop commands
switch(args[2]) {
  case "stop":
    process.kill(parseInt(fs.readFileSync(config.lockFile)));
    process.exit(0);
    break;
    
  case "start":
    // Start HTTP Server
    http.createServer(function(req, res) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.write('I know nodejitsu.');
      res.end();
    }).listen(8000);
    
    fs.open(config.logFile, 'w+', function (err, fd) {
      if (err) {
        return util.puts('Error starting daemon: ' + err);
      }
      
      daemon.start(fd);
      daemon.lock(config.lockFile);
    });
    break;
    
  default:
    util.puts('Usage: [start|stop]');
    process.exit(0);
}