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
        return CommonChecks.isShowing(card) && (
            isTopCardInWaste(card) ||
            CommonChecks.isWithin(piles.tableaux, card) ||
            isTopCardInFoundations(card) );
    }

    function isTopCardInStock (card) {
        return CommonChecks.isTopCardOf(piles.stock, card);
    }

    function isTopCardInWaste (card) {
        return CommonChecks.isTopCardOf(piles.waste, card);
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

    function tableauAllowsCard (tableau, card) {
        if (_.isEmpty(tableau)) {
            return card.rank === Deck.KING;
        } else {
            var topCard = _.last(tableau);
            return CommonChecks.isShowing(topCard) &&
                CommonChecks.isOneLessThan(card, topCard) &&
                CommonChecks.isDifferentColor(card, topCard);
        }
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

    function canTakeCardFrom (pile, card) {
        return CommonChecks.isShowing(card) &&
            CommonChecks.isTopCardOf(pile, card);
    }

    this.countOf = CommonChecks.countOf;
    this.isWithin = CommonChecks.isWithin;
    this.isTopCardOf = CommonChecks.isTopCardOf;
    this.isShowing = CommonChecks.isShowing;

    this.isClickable = isClickable;
    this.isDraggable = isDraggable;

    this.tableauAllowsCard = tableauAllowsCard;
    this.foundationAllowsCard = foundationAllowsCard;

    this.canTakeCardFrom = canTakeCardFrom;
    this.isTopCardInTableaux = isTopCardInTableaux;
}

module.exports = Checks;
