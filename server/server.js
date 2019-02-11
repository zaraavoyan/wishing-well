const fs = require('fs');
const mime = require('mime');
const url = require('url');
const util = require('util');
const WebSocketServer = require('websocket').server;

const PORT=8080;

let server = require('http').createServer(async (req, res) => {
  console.log("Got request!", req.method, req.url);
  
  let path = url.parse(req.url, true).pathname
  
  switch (path) {
  //// custom paths go here, e.g.:
  // case '/api/new':
  //   callNewFunction();
  //   break;

  // Serve react-built files. 
  // - In real production these would be served by nginx or similar. 
  // - In dev, they're served by react-stripts.
  // This is for pseudo-production: avoids react-scripts but isn't super efficient.
  default:
    let safePath = path.split('/').filter(e => ! e.startsWith('.')).join('/')
    if (safePath === '/') {
      safePath = '/index.html';
    }
    try {
      let fullPath = 'build' + safePath;
      if ((await util.promisify(fs.stat)(fullPath)).isFile()) {
        res.writeHead(200, {'Content-Type': mime.getType(safePath)});
        fs.createReadStream(fullPath).pipe(res);
      } else {
        console.log("unknown request", path);
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("Couldn't find your URL...");
      }
    } catch (err) {
      console.log("Error reading static file?", err);
      res.writeHead(500, {'Content-Type': 'text/html'});
      res.end("Failed to load something...try again later?");
    }
  }
});
server.listen(PORT);

let allConnections = new Set();
allConnections.send = function(obj) {
  for (connection of this) {
    connection.send(JSON.stringify(obj));
  }
}

let wsServer = new WebSocketServer({
  httpServer: server
})
wsServer.on('request', (request) => {
  console.log(":: new connection");
  var connection = request.accept(null, request.origin);
  allConnections.add(connection);
    
  connection.on('message', (msg) => {
    if (msg.type !== 'utf8') {
      return;
    }
    msg = msg.utf8Data;
    console.log(":: message:", msg);
    
    let data = JSON.parse(msg);
    
    if (data.type == "broadcast") {
      allConnections.send(data);
    }
  });
  
  connection.on('close', (conn) => {
    console.log(":: connection closed");
    allConnections.delete(conn);
  });
});

console.log("Listening on port", PORT)