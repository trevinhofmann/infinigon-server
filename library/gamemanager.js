'use strict';

var Infinigon = require('infinigon');
var Piece = Infinigon.Piece;

function GameManager() {
  this.games = {};
  this.games['free-for-all'] = new Infinigon();
  this.games['free-for-all'].start();
}

GameManager.prototype.getRoom = function(room) {
  for (var i in this.games) {
    if (i == room) {
      return this.games[i];
    }
  }
  throw new Error('Game room does not exist.');
};

GameManager.prototype.newPlayer = function(room, id) {
  var options = {
    board: this.games[room].board,
    position: {
      x: 500,
      y: 500
    },
    class: 'piece human'
  };
  return new Piece(id, options);
};

GameManager.prototype.removePlayer = function(room, id) {
  delete this.games[room].board.pieces[id];
};

module.exports = GameManager;