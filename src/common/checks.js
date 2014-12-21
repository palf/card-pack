var _ = require('../../server/public/libs/underscore.js');


module.exports = {

    countOf: function (list, predicate) {
        return _.filter(list, predicate).length;
    },

    isShowing: function (card) {
        return !!card.faceUp;
    },

    isSameSuit: function (cardA, cardB) {
        return cardA.suit === cardB.suit;
    },

    isDifferentColor: function (cardA, cardB) {
        return cardA.color !== cardB.color;
    },

    isOneLessThan: function (cardA, cardB) {
        return cardA.rank === cardB.rank - 1;
    },

    isOneMoreThan: function (cardA, cardB) {
        return cardA.rank === cardB.rank + 1;
    },

    isWithin: function (pile, card) {
        return _.contains(_.flatten(pile), card);
    },

    isTopCardOf: function (pile, card) {
        return _.last(pile) === card;
    }
};
