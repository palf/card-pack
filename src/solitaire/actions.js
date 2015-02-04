var _ = require('underscore');

function Actions (piles, check) {

    function withCardAction (card) {
        return { card: card };
    }

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

    function flipCardAction (action) {
        action.card.faceUp = !action.card.faceUp;
        action.flip = true;
        return action;
    }


    function isFoundation (pile) {
        return _.contains(piles.foundations, pile);
    }

    return {

        // TODO : remove self reference
        selectCard: function (card) {
            if (_.contains(piles.stock, card)) {
                return this.flipFromStockToWaste();
            } else if (!check.isShowing(card) && check.isTopCardInTableaux(card)) {
                var flip = _.compose(flipCardAction, withCardAction);
                return [ flip(card) ];
            } else {
                return [];
            }
        },

        flipFromStockToWaste: function () {
            var take = _.partial(takeCardFrom, piles.stock);
            var add = _.partial(addCardTo, piles.waste);
            var count = Math.min(3, piles.stock.length);
            var flipFromStockToWaste = _.compose(flipCardAction, add, take);

            return _.times(count, flipFromStockToWaste);
        },

        flipAllWasteToStock: function () {
            if (_.isEmpty(piles.stock)) {
                var take = _.partial(takeCardFrom, piles.waste);
                var add = _.partial(addCardTo, piles.stock);
                var flipFromWasteToStock = _.compose(flipCardAction, add, take);

                return _.map(piles.waste, flipFromWasteToStock);
            } else {
                return [];
            }
        },

        moveCardsToTableau: function (cards, tableau) {
            var card = _.first(cards);
            if (check.tableauAllowsCard(tableau, card)) {
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
                return a.concat(b);

            } else {
                return [];
            }
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
            if (!isFoundation(pile) && check.canTakeCardFrom(pile, card)) {
                var targetFoundation = _.find(piles.foundations, function (foundation) {
                    return check.foundationAllowsCard(foundation, card);
                });

                if (targetFoundation) {
                    var take = _.partial(takeCardFrom, pile);
                    var add = _.partial(addCardTo, targetFoundation);
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
