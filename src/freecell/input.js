function Input (game, actions) {
    "use strict";

    this.singleClickCard = function () {
    };

    this.doubleClickCard = function (card) {
        var record = actions.sendToFoundations(card);
        if (_.isEmpty(record)) {
            record = actions.sendToDepots(card);
        }
        game.storeAction(record);
    };
}

module.exports = Input;
