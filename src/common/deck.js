var _ = require('../../server/public/libs/underscore.js');

var ACE = 1,
    JACK = 11,
    QUEEN = 12,
    KING = 13;

var HEARTS = 'hearts',
    CLUBS = 'clubs',
    DIAMONDS = 'diamonds',
    SPADES = 'spades';

var COLOR = {
    RED: 'red',
    BLACK: 'black'
};

var SUITS = [ HEARTS, CLUBS, DIAMONDS, SPADES ];
var CARD_VALUES = [ ACE, 2, 3, 4, 5, 6, 7, 8, 9, 10, JACK, QUEEN, KING ];


function determineColor (suit) {
    switch (suit) {
        case HEARTS:
        case DIAMONDS:
            return COLOR.RED;

        case CLUBS:
        case SPADES:
            return COLOR.BLACK;
    }
}

function PlayingCard (suit, rank) {
    this.suit = suit;
    this.rank = rank;
    this.color = determineColor(suit);
    this.faceUp = false;
}

function createCard (suit, rank) {
    return new PlayingCard (suit, rank);
}

function createSuit (suit) {
    return _.map(CARD_VALUES, function (rank) {
        return createCard(suit, rank);
    });
}

function createDeck (suits) {
    return _.flatten(_.map(suits, createSuit));
}


module.exports = {
    createDeck: createDeck,
    createCard: createCard,
    SUITS: SUITS,
    ACE: ACE,
    KING: KING
};
