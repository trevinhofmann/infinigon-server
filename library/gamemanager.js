'use strict';

var Infinigon = require('infinigon');
var FreeForAll = require('infinigon-free-for-all');
var Piece = Infinigon.Piece;

function GameManager() {
  this.games = {};
  this.games['free-for-all'] = new FreeForAll();
}

GameManager.prototype.getRoom = function(room) {
  return this.games[room].getGame();
};

GameManager.prototype.newPlayer = function(room, id) {
  return this.games[room].newPlayer(id);
};

GameManager.prototype.removePlayer = function(room, id) {
  this.games[room].removePlayer(id);
};

module.exports = GameManager;