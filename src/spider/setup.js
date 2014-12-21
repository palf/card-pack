var _ = require('../../server/public/libs/underscore.js');
var Deck = require('../common/deck');

function createEmptyArray () {
    return [];
}

var setupStock = createEmptyArray;

function setupTableaux () {
    return _.times(10, createEmptyArray);
}

function setupFoundations () {
    return _.times(8, createEmptyArray);
}

function selectPile (tableaux, index) {
    return tableaux[index % 10];
}

module.exports = {

    createCards: function () {
        return Deck.createDeck(
            _.flatten([
                _.times(4, _.constant('hearts')),
                _.times(4, _.constant('spades'))
            ])
        );
    },

    createPiles: function () {
        return {
            stock: setupStock(),
            tableaux: setupTableaux(),
            foundations: setupFoundations()
        };
    },

    deal: function (cards, piles) {
        _.each(_.first(cards, 52), function (card, index) {
            var pile = selectPile(piles.tableaux, index);
            pile.push(card);
            card.container = pile;
        });

        _.each(_.rest(cards, 52), function (card) {
            var pile = piles.stock;
            pile.push(card);
            card.container = pile;
        });

        _.each(piles.tableaux, function (tableau) {
            var topCard = _.last(tableau);
            topCard.faceUp = true;
        });
    }
};
