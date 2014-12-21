var _ = require('../../server/public/libs/underscore.js');
var CommonChecks = require('../common/checks');
var Deck = require('../common/deck');


function Checks (piles) {

    function isClickable (card) {
        return isFlippable(card) || isDraggable(card);
    }

    function isFlippable (card) {
        return !card.faceUp;
    }

    function isDraggable (card) {
        return isTopCardInDepot(card) ||
            isTopCardInFoundations(card) ||
            (isOrderedFrom(card) && isWithinLimit(card));
    }

    function isTopCardInDepot (card) {
        return _.some(piles.depots, function (depot) {
            return CommonChecks.isTopCardOf(depot, card);
        });
    }

    function isTopCardInFoundations (card) {
        return _.some(piles.foundations, function (foundation) {
            return CommonChecks.isTopCardOf(foundation, card);
        });
    }

    function findPileFor (card) {
        var allPiles = piles.depots.
            concat(piles.tableaux).
            concat(piles.foundations);
        return  _.find(allPiles, function (pile) {
            return _.contains(pile, card);
        });
    }

    function isOrderedFrom (card) {
        var pile = findPileFor(card);
        if (pile) {
            var index = _.indexOf(pile, card);
            var remainder = _.rest(pile, index);
            return isDescendingAndAlternating(remainder);
        } else {
            return false;
        }
    }

    function isDescendingAndAlternating (pile) {
        var lastCard = _.first(pile);

        function decreasesAndAlternates (memo, card) {
            var value = memo.value &&
                CommonChecks.isOneLessThan(card, memo.prev) &&
                CommonChecks.isDifferentColor(card, memo.prev);
            return { prev: card, value: value };
        }

        return _.reduce(
            _.rest(pile, 1),
            decreasesAndAlternates,
            { prev: lastCard, value: true }
        ).value;
    }

    function isWithinLimit (card) {
        var pile = card.container;
        var index = _.indexOf(pile, card);

        var emptyDepotCount = CommonChecks.countOf(piles.depots, _.isEmpty);
        var emptyTableauCount = CommonChecks.countOf(piles.tableaux, _.isEmpty);
        var carryLimit = getCarryLimit(emptyDepotCount, emptyTableauCount);

        return carryLimit >= (pile.length - index);
    }

    function getCarryLimit (d, t) {
        /* carryable amount is calculated as follows:

        move d cards to depot  ( d = count of empty depots )
        move next card to empty tableau
        move all depot cards to last card (you have now moved d+1 cards)

        repeat these steps, building groups in the tableau. the goal is to get
        one tableau as large as possible, then start on the next. the target of
        the move is the final tableau and can be considered to hold (d+1) cards.
        working backwards, the next tableau can hold (d+1) cards
        the next can hold 2*(d+1) cards (using the previous to build up)

        for 0 empty tableaus, limit = (d+1)
        for 1 empty tableaus, limit = (d+1) + (d+1)
        for 2 empty tableaus, limit = (d+1) + (d+1) + 2*(d+1)

        the next empty tableau can be twice the size of the previous;
        inductively, we can see limit = (d+1) * 2^t
        */

        return (d + 1) * (Math.pow(2, t));
    }

    function depotAllowsCard (depot) {
        return _.isEmpty(depot);
    }

    function foundationAllowsCard (foundation, card) {
        if (_.isEmpty(foundation)) {
            return card.rank === Deck.ACE;
        } else {
            var topCard = _.last(foundation);
            return CommonChecks.isSameSuit(card, topCard) &&
                CommonChecks.isOneMoreThan(card, topCard);
        }
    }

    function tableauAllowsCard (tableau, card) {
        if (_.isEmpty(tableau)) {
            return true;
        } else {
            var topCard = _.last(tableau);
            return CommonChecks.isShowing(topCard) &&
                CommonChecks.isOneLessThan(card, topCard) &&
                CommonChecks.isDifferentColor(card, topCard);
        }
    }

    // used by actions
    this.countOf = CommonChecks.countOf;
    this.isWithin = CommonChecks.isWithin;
    this.isTopCardOf = CommonChecks.isTopCardOf;

    this.isClickable = isClickable;
    this.isDraggable = isDraggable;

    // this.isDescendingAndAlternating = isDescendingAndAlternating;
    this.isOrderedFrom = isOrderedFrom;
    this.findPileFor = findPileFor;

    // used by actions and board
    this.depotAllowsCard = depotAllowsCard;
    this.tableauAllowsCard = tableauAllowsCard;
    this.foundationAllowsCard = foundationAllowsCard;

    this.getCarryLimit = getCarryLimit;
}

module.exports = Checks;
