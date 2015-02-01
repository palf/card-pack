var shuffle = require('./common/shuffle'),
    Game = require('./common/game'),
    Undo = require('./common/undo'),
    Drag = require('./common/drag'),
    Render = require('./common/render'),
    Bindings = require('./common/bindings');

var Setup = require('./solitaire/setup'),
    Checks = require('./solitaire/checks'),
    Actions = require('./solitaire/actions'),
    Board = require('./solitaire/board'),
    Input = require('./solitaire/input');


$(document).ready(function () {
    "use strict";

    var cards = Setup.createCards();
    var piles = Setup.createPiles();

    var checks = new Checks(piles);
    var actions = new Actions(piles, checks);
    var board = new Board(actions, checks);

    board.createCardElements(cards);
    board.createContainers(piles);

    function deal () {
        Setup.createSolitaire();
        shuffle(cards);
        Setup.deal(cards, piles);
    }

    var render = new Render(board, checks);
    var undo = new Undo();
    var game = new Game(deal, render, undo);
    game.newGame();

    var drag = new Drag(render, game, board, checks);
    var input = new Input(game, actions);

    Bindings.bindDocumentEventHandlers(drag);
    Bindings.bindCardEventHandlers(input, drag);
    Bindings.bindMenuHandlers(game);

    $('#stock').click(function () {
        input.selectEmptyStock();
    });
});
