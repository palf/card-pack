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
        var allPiles = [
            piles.stock,
            piles.tableaux[0],
            piles.tableaux[1],
            piles.tableaux[2],
            piles.tableaux[3],
            piles.tableaux[4],
            piles.tableaux[5],
            piles.tableaux[6],
            piles.tableaux[7],
            piles.tableaux[8],
            piles.tableaux[9],
            piles.foundations[0],
            piles.foundations[1],
            piles.foundations[2],
            piles.foundations[3],
            piles.foundations[4],
            piles.foundations[5],
            piles.foundations[6],
            piles.foundations[7]
        ];

        _.each(allPiles, function (pile) {
            while (pile.length > 0) {
                pile.pop();
            }
        });

        _.each(_.first(cards, 52), function (card, index) {
            var pile = selectPile(piles.tableaux, index);
            pile.push(card);
            card.faceUp = false;
            card.container = pile;
        });

        _.each(_.rest(cards, 52), function (card) {
            var pile = piles.stock;
            pile.push(card);
            card.faceUp = false;
            card.container = pile;
        });

        _.each(piles.tableaux, function (tableau) {
            var topCard = _.last(tableau);
            topCard.faceUp = true;
        });
    }
};
