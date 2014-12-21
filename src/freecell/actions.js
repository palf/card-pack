var _ = require('../../server/public/libs/underscore.js');

function Actions (piles, check) {

    function takeCard (pile) {
        return pile.pop();
    }

    function addCard (pile, card) {
        card.container = pile;
        return pile.push(card);
    }

    function takeCardFrom (pile) {
        var card = takeCard(pile);
        return { card: card, origin: pile };
    }

    function addCardTo (pile, action) {
        addCard(pile, action.card);
        action.target = pile;
        return action;
    }


    return {

        moveCardToDepot: function (card, depot) {
            var pile = check.findPileFor(card);
            if (_.isEmpty(depot)) {
                var take = _.partial(takeCardFrom, pile);
                var add = _.partial(addCardTo, depot);
                var move = _.compose(add, take);
                return [ move() ];
            } else {
                return [];
            }
        },

        sendToDepots: function (card) {
            var pile = check.findPileFor(card);
            if (check.isTopCardOf(pile, card) &&
                !_.contains(piles.depots, pile)) {
                var depot = _.find(piles.depots, _.isEmpty);

                if (depot) {
                    var take = _.partial(takeCardFrom, pile);
                    var add = _.partial(addCardTo, depot);
                    var move = _.compose(add, take);

                    return [ move() ] ;
                } else {
                    return [];
                }
            } else {
                return [];
            }
        },

        moveCardsToTableau: function (cards, tableau) {
            var actionsTaken = [];
            var card = _.first(cards);
            if (check.tableauAllowsCard(tableau, card)) {
                var emptyTableauCount = check.countOf(piles.tableaux, _.isEmpty);
                var emptyDepotCount = check.countOf(piles.depots, _.isEmpty);

                if (_.isEmpty(tableau)) {
                    // can't include target tableau
                    emptyTableauCount --;
                }
                var carryLimit = check.getCarryLimit(emptyDepotCount, emptyTableauCount);

                if (cards.length <= carryLimit) {
                    var pile = card.container;
                    var temp = [];

                    var take1 = _.partial(takeCardFrom, pile);
                    var add1 = _.partial(addCardTo, temp);
                    var moveToTemp = _.compose(add1, take1);

                    var take2 = _.partial(takeCardFrom, temp);
                    var add2 = _.partial(addCardTo, tableau);
                    var moveToTableau = _.compose(add2, take2);

                    var a = _.times(cards.length, moveToTemp);
                    var b = _.times(cards.length, moveToTableau);
                    actionsTaken = a.concat(b);
                }
            }
            return actionsTaken;
        },

        moveCardToFoundation: function (card, foundation) {
            if (check.foundationAllowsCard(foundation, card)) {
                var pile = card.container;
                var take = _.partial(takeCardFrom, pile);
                var add = _.partial(addCardTo, foundation);
                var moveFromContainerToFoundation = _.compose(add, take);

                return [ moveFromContainerToFoundation() ];
            } else {
                return [];
            }
        },

        sendToFoundations: function (card) {
            var pile = card.container;
            if (card.faceUp && check.isTopCardOf(pile, card) && !check.isWithin(piles.foundations, card)) {
                var foundation = _.find(piles.foundations, function (foundation) {
                    return check.foundationAllowsCard(foundation, card);
                });

                if (foundation) {
                    var take = _.partial(takeCardFrom, pile);
                    var add = _.partial(addCardTo, foundation);
                    var moveFromContainerToFoundation = _.compose(add, take);

                    return [ moveFromContainerToFoundation() ] ;
                } else {
                    return [];
                }
            } else {
                return [];
            }
        }
    };
}

module.exports = Actions;
