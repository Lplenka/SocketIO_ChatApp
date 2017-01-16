var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');
var serveIndex = require('serve-index')
app.use(express.static(__dirname + "/"));
app.use('/node_modules', serveIndex('/node_modules'));

// app.use('/scripts', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));


users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server running at port 3000');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');

});

//socket part starts
io.sockets.on('connection', function(socket) {

    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length);
    //Disconnect
    socket.on('disconnect', function(data) {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected %s sockets connected', connections.length);
    });

    //send Message
    socket.on('send message', function(data) {
        io.sockets.emit('new message', {
            msg: data,
            user: socket.username
        });
    });
    //New User
    socket.on('new user', function(data, callback) {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames() {
        io.sockets.emit('get users', users);
    }

});
