process.title = 'dirtSocket';
var http = require('http');
var WebSocket = require('ws');
var nopt = require('nopt');
var osc = require('osc');

// parse command-line options
var knownOpts = { "osc-port" : [Number, null], "tcp-port" : [Number, null], "help": Boolean };
var shortHands = { "o" : ["--osc-port"], "t" : ["--tcp-port"], "h" : ["--help"] };
var parsed = nopt(knownOpts,shortHands,process.argv,2);
if(parsed['help']!=null) {
  console.log("usage:");
  console.log(" --help (-h)               this help message");
  console.log(" --osc-port (-o) [number]  UDP port for OSC messages from Dirt (default: 7771)");
  console.log(" --tcp-port (-t) [number]  TCP port for WebSocket connection (default: 7771)");
  process.exit(1);
}
var tcpPort = parsed['tcp-port'];
if(tcpPort==null) tcpPort = 7771;
var oscPort = 7771;

// create WebSocket server
var server = http.createServer();
var wss = new WebSocket.Server({server: server});
wss.on('connection',function(ws) {
  var ip = ws.upgradeReq.connection.remoteAddress;
  console.log("new WebSocket connection from " + ip);
});
wss.broadcast = function(data) {
  for (var i in this.clients) {
    try {
      this.clients[i].send(data);
    }
    catch(e) {
      console.log("warning: exception in websocket broadcast");
    }
  }
};

// make it go
server.listen(tcpPort, function () { console.log('Listening on ' + server.address().port) });

var udp = new osc.UDPPort( { localAddress: "127.0.0.1", localPort: oscPort });
udp.open();
udp.on('message', function(m) {
  var response = JSON.stringify(m);
  wss.broadcast(response);
  console.log(m);
});
