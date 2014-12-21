// duplicated in actions
function flipCard (card) {
    card.faceUp = !card.faceUp;
}

function undoActionPart (part) {
    if (part.target) {
        var cardIndex = _.indexOf(part.target, part.card);
        if (cardIndex > -1) {
            var card = _.first(part.target.splice(cardIndex, 1));
            part.origin.push(card);
            card.container = part.origin;
        }
    }
    if (part.flip) { flipCard(part.card); }
}

function undoAction (action) {
    _.each(action.reverse(), undoActionPart);
}


function Undo () {

    var undoStack = [];

    this.clear = function () {
        undoStack = [];
    };

    this.all = function () {
        var action;
        while ( undoStack.length > 0 ) {
            action = undoStack.pop();
            undoAction(action);
        }
    };

    this.once = function () {
        var action = undoStack.pop();
        if (action) { undoAction(action); }
        return action || [];
    };

    this.store = function (action) {
        if (!_.isEmpty(action)) {
            undoStack.push(action);
        }
    };
}

module.exports = Undo;
