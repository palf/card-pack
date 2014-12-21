function Input (game, actions) {
    "use strict";

    this.newGame = function () {
        return game.newGame();
    };

    this.restart = function () {
        return game.restart();
    };

    this.undoAction = function () {
        return game.undoAction();
    };

    this.singleClickCard = function (card) {
        var record = actions.selectCard(card);
        game.storeAction(record);
    };

    this.doubleClickCard = function (card) {
        var record = actions.sendToFoundations(card);
        game.storeAction(record);
    };

    this.selectEmptyStock = function () {
        var record = actions.flipAllWasteToStock();
        game.storeAction(record);
    };
}

module.exports = Input;
