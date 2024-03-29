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

function selectPileID (pileIDs, index) {
    if (index < 28) {
        var tabIndex = selectPosition(7, index);
        return pileIDs[tabIndex + 2];
    } else {
        return pileIDs[0];
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

    createSolitaire: function () {
        function q (prefix) { return _.uniqueId(prefix + '_'); }
        function pp (prefix) { return function () { return q(prefix); }; }

        var suits = [ 'hearts', 'diamonds', 'clubs', 'spades' ];
        var colors = [ 'red', 'black' ];

        var cardIDs = _.times(52, pp('card'));
        var cardRanks = {};
        var cardSuits = {};
        var cardColors = {};
        var showing = [];


        _.each(cardIDs, function (cardID, index) {
            cardRanks[cardID] = (index % 13) + 1;
            cardSuits[cardID] = suits[Math.floor(index / 13)];
            cardColors[cardID] = colors[Math.floor(index / 26)];
        });

        //shuffle(cardIDs);

        var pileIDs = _.map([
            'stock',
            'waste',
            'tableau',
            'tableau',
            'tableau',
            'tableau',
            'tableau',
            'tableau',
            'tableau',
            'foundation',
            'foundation',
            'foundation',
            'foundation'
        ], q);

        var cardPiles = {};
        _.each(cardIDs, function (cardID, index) {
            cardPiles[cardID] = selectPileID(pileIDs, index);
        });




        // return {
        //     cards: cards,
        //     suits: suits,
        //     colors: colors,
        //     showing: showing
        // };
        // console.log(cardIDs);
        // console.log(pileIDs);
        // console.log(cardPiles);
        // console.log(cardRanks);
        // console.log(cardSuits);
        // console.log(showing);

        var game = {
            cards: {
                ids: cardIDs,
                piles: cardPiles,
                ranks: cardRanks,
                suits: cardSuits,
                colors: cardColors,
                showing: showing
            },
            piles: {

            }
        };

        console.log(game.cards);
        console.log(game.piles);

        return game;
    },

    deal: function (cards, piles) {
        var allPiles = [
            piles.stock,
            piles.waste,
            piles.tableaux[0],
            piles.tableaux[1],
            piles.tableaux[2],
            piles.tableaux[3],
            piles.tableaux[4],
            piles.tableaux[5],
            piles.tableaux[6],
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
            var pile = selectPile(piles, index);
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
