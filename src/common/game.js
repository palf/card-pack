function Game (deal, render, undo) {

    this.newGame = function () {
        undo.clear();
        deal();
        render.everything();
    };

    this.restart = function () {
        undo.all();
        render.everything();
    };

    this.undoAction = function () {
        var record = undo.once();
        render.everything(record);
    };

    this.storeAction = function (record) {
        undo.store(record);
        render.everything(record);
    };
}

module.exports = Game;
