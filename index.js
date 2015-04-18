// Module dependencies.
var http = require('http');
var express = require('express');
var path = require('path');
var GameManager = require('./library/gamemanager');

// express application
var app = express();

// jade setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// static file setup
app.use(express.static(path.join(__dirname, 'public')));

// routes setup
app.use('/', require('./routes/index'));
app.use('/game', require('./routes/game'));

// Create HTTP server.
var server = http.createServer(app);

// Listen on websocket
var io = require('socket.io')(server);

// Setup game manager
var gamemanager = new GameManager();

// Handle websocket
require('./library/sockethandler')(io, gamemanager);

// Listen on provided port, on all network interfaces.
server.listen(80);