'use strict';

var crypto = require('crypto');

var sockets = {};

function SocketHandler(io, gamemanager){

  setInterval(function() {
    updateSockets(gamemanager);
  }, 50);

  io.on('connection', function(socket){

    var id = crypto.randomBytes(32).toString('hex');
    var room;
    var game;
    var piece;

    socket.on('join', function(roomName) {
      room = roomName;
      try {
        game = gamemanager.getRoom(room);
      } catch (e) {
        console.log(e.message);
        socket.emit('err', e.message);
        return;
      }
      piece = gamemanager.newPlayer(room, id);
      emitToRoom(room, 'instantiate', [piece.getOptions()])
      var init = game.getInitialization(id);
      socket.emit('welcome', init);
      try {
        addToRoom(room, socket);
      } catch (e) {
        console.log(e.message);
        socket.emit('err', e.message);
      }
    });

    socket.on('disconnect', function() {
      //try {
        removeFromRoom(room, socket);
        gamemanager.removePlayer(room, id);
        emitToRoom(room, 'remove', [id]);
      //} catch (e) {
      //  console.log(e.message);
      //  socket.emit('err', e.message);
      //}
    });

    socket.on('leftClick', function(target) {
      try {
        piece.fire(target);
      } catch (e) {
        console.log(e.message);
      }
    });

    socket.on('rightClick', function(target) {
      try {
        piece.updateTarget(target);
      } catch (e) {
        console.log(e.message);
      }
    });

  });

}

function addToRoom(room, socket) {
  if (typeof sockets[room] === 'undefined') {
    sockets[room] = [];
  }
  if (sockets[room].indexOf(socket) > -1) {
    return; //throw new Error('This socket is already connected to this game room.');
  }
  sockets[room].push(socket);
}

function removeFromRoom(room, socket) {
  if (typeof sockets[room] === 'undefined') {
    return; // throw new Error('This room does not exist.');
  }
  var i = sockets[room].indexOf(socket);
  if (i > -1) {
    sockets[room].splice(i, 1);
  }
}

function updateSockets(gamemanager) {
  for (var r in sockets) {
    var update = gamemanager.getRoom(r).getUpdate();
    emitToRoom(r, 'update', update);
  }
}

function emitToRoom(room, command, message) {
  for (var s in sockets[room]) {
    sockets[room][s].emit(command, message);
  }
}

module.exports = SocketHandler;
