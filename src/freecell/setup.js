var Deck = require('../common/deck');

function createEmptyArray () {
    return [];
}

function setupDepots () {
    return _.times(4, createEmptyArray);
}

function setupTableaux () {
    return _.times(8, createEmptyArray);
}

function setupFoundations () {
    return _.times(4, createEmptyArray);
}

module.exports = {

    createCards: function () {
        return Deck.createDeck(Deck.SUITS);
    },

    createPiles: function () {
        return {
            depots: setupDepots(),
            tableaux: setupTableaux(),
            foundations: setupFoundations()
        };
    },

    deal: function (cards, piles) {
        _.each(cards, function (card, index) {
            var tableau = piles.tableaux[index % 8];
            tableau.push(card);
            card.container = tableau;
            card.faceUp = true;
        });
    }
};
