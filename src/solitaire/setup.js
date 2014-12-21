var _ = require('../../server/public/libs/underscore.js');
var Deck = require('../common/deck');

function createEmptyArray () {
    return [];
}

var setupStock = createEmptyArray;
var setupWaste = createEmptyArray;

function setupTableaux () {
    return _.times(7, createEmptyArray);
}

function setupFoundations () {
    return _.times(4, createEmptyArray);
}

var sum = _.memoize(function (x) {
    return (x * (x + 1)) / 2;
});

function selectPosition (count, index) {
    var openSpaces = sum(count) - index;
    var row = 0;

    if (openSpaces > 0) {
        while (sum(row) < openSpaces) {
            row ++;
        }

        return index + sum(row - 1) - sum(count - 1);
    } else {
        return -1;
    }
}

function selectPile (piles, index) {
    if (index < 28) {
        var tabIndex = selectPosition(7, index);
        return piles.tableaux[tabIndex];
    } else {
        return piles.stock;
    }
}


module.exports = {

    createCards: function () {
        return Deck.createDeck(Deck.SUITS);
    },

    createPiles: function () {
        return {
            stock: setupStock(),
            waste: setupWaste(),
            tableaux: setupTableaux(),
            foundations: setupFoundations()
        };
    },

    deal: function (cards, piles) {
        _.each(cards, function (card, index) {
            var pile = selectPile(piles, index);
            pile.push(card);
            card.container = pile;
        });

        _.each(piles.tableaux, function (tableau) {
            var topCard = _.last(tableau);
            topCard.faceUp = true;
        });
    }
};
