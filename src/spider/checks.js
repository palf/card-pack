var _ = require('../../server/public/libs/underscore.js');
var CommonChecks = require('../common/checks');
var Deck = require('../common/deck');


function Checks (piles) {

    function isClickable (card) {
        return isFlippable(card) || isDraggable(card);
    }

    function isFlippable (card) {
        return !card.faceUp && (isTopCardInTableaux(card) || isTopCardInStock(card));
    }

    function isDraggable (card) {
        return CommonChecks.isWithin(piles.tableaux, card) && isOrderedAndSameSuit(card);
    }

    function isTopCardInStock (card) {
        return CommonChecks.isTopCardOf(piles.stock, card);
    }

    function isTopCardInFoundations (card) {
        return _.some(piles.foundations, function (foundation) {
            return CommonChecks.isTopCardOf(foundation, card);
        });
    }

    function isTopCardInTableaux (card) {
        return _.some(piles.tableaux, function (tableau) {
            return CommonChecks.isTopCardOf(tableau, card);
        });
    }

    function isOrderedAndSameSuit (card) {
        var pile = card.container;
        var index = _.indexOf(pile, card);
        var remainder = _.rest(pile, index);
        return isDescendingAndSameSuit(remainder);
    }

    function isDescendingAndSameSuit (pile) {
        var lastCard = _.first(pile);

        function decreasesWithinSuit (memo, card) {
            var value = memo.value &&
                CommonChecks.isOneLessThan(card, memo.prev) &&
                CommonChecks.isSameSuit(card, memo.prev);
            return { prev: card, value: value };
        }

        return _.reduce(
            _.rest(pile, 1),
            decreasesWithinSuit,
            { prev: lastCard, value: true }
        ).value;
    }

    function isFullOrderedSuit (pile) {
        var topCard = _.first(pile);

        function decreasesWithinSuit (memo, card) {
            var value = memo.value &&
                CommonChecks.isOneLessThan(card, memo.prev) &&
                CommonChecks.isSameSuit(card, memo.prev);
            return { prev: card, value: value };
        }

        return pile.length === 13 &&
            topCard.rank === Deck.KING &&
            _.reduce(
                _.rest(pile, 1),
                decreasesWithinSuit,
                { prev: topCard, value: true }
            ).value;
    }

    function depotAllowsCard (depot) {
        return _.isEmpty(depot);
    }

    function tableauAllowsCard (tableau, card) {
        if (_.isEmpty(tableau)) {
            return true;
        } else {
            var topCard = _.last(tableau);
            return CommonChecks.isShowing(topCard) &&
                CommonChecks.isOneLessThan(card, topCard);
        }
    }

    function foundationAllowsCard (foundation, card) {
        return _.isEmpty(foundation) && (card.rank === Deck.KING);
    }

    this.countOf = CommonChecks.countOf;
    this.isWithin = CommonChecks.isWithin;
    this.isTopCardOf = CommonChecks.isTopCardOf;
    this.isShowing = CommonChecks.isShowing;

    this.isClickable = isClickable;
    this.isDraggable = isDraggable;

    this.depotAllowsCard = depotAllowsCard;
    this.tableauAllowsCard = tableauAllowsCard;
    this.foundationAllowsCard = foundationAllowsCard;

    this.isTopCardInTableaux = isTopCardInTableaux;
    this.isTopCardInFoundations = isTopCardInFoundations;

    this.isFullOrderedSuit = isFullOrderedSuit;
}

module.exports = Checks;
