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
        var allPiles = [
            piles.depots[0],
            piles.depots[1],
            piles.depots[2],
            piles.depots[3],
            piles.tableaux[0],
            piles.tableaux[1],
            piles.tableaux[2],
            piles.tableaux[3],
            piles.tableaux[4],
            piles.tableaux[5],
            piles.tableaux[6],
            piles.tableaux[7],
            piles.foundations[0],
            piles.foundations[1],
            piles.foundations[2],
            piles.foundations[3]
        ];

        _.each(allPiles, function (pile) {
            while (pile.length > 0) {
                pile.pop();
            }
        });

        _.each(cards, function (card, index) {
            var tableau = piles.tableaux[index % 8];
            tableau.push(card);
            card.container = tableau;
            card.faceUp = true;
        });
    }
};
