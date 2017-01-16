var express =require('express');
var app= express();
var server =require('http').createServer(app);
var io=  require('socket.io').listen(server);
var path = require('path');
var serveIndex = require('serve-index')
app.use(express.static(__dirname + "/"));
app.use('/node_modules', serveIndex('/node_modules'));

// app.use('/scripts', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));


users=[];
connections=[];

server.listen(process.env.PORT || 3000);
console.log('server running at port 3000');

app.get('/',function (req,res) {
         res.sendFile(__dirname + '/index.html');

});


io.sockets.on('connection', function(socket){

         connections.push(socket);
         console.log('connected: %s sockets connected',connections.length);
});
