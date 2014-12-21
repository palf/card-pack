var _ = require('../../server/public/libs/underscore.js');

function Actions (piles, check) {

    function withCardAction (card) {
        return { card: card };
    }

    function takeCardFrom (pile) {
        if (pile.length > 0) {
            var card = pile.pop();
            return { card: card, origin: pile };
        } else {
            return {};
        }
    }

    function addCardTo (pile, action) {
        if (action.card) {
            pile.push(action.card);
            action.card.container = pile;
            action.target = pile;
            return action;
        } else {
            return {};
        }
    }

    function flipCardAction (action) {
        if (action.card) {
            action.card.faceUp = !action.card.faceUp;
            action.flip = true;
            return action;
        } else {
            return {};
        }
    }


    return {

        // TODO : remove self reference
        selectCard: function (card) {
            if (check.isWithin(piles.stock, card)) {
                return this.selectStock(piles.stock);
            } else if (!check.isShowing(card) && check.isTopCardInTableaux(card)) {
                var flip = _.compose(flipCardAction, withCardAction);
                return [ flip(card) ];
            } else {
                return [];
            }
        },

        selectStock: function (stock) {
            var takeStock = _.partial(takeCardFrom, stock);
            function moveFromStockToTableau (tableau) {
                var addToTableau = _.partial(addCardTo, tableau);
                var move = _.compose(flipCardAction, addToTableau, takeStock);
                return move();
            }

            return _.chain(piles.tableaux).
                map(moveFromStockToTableau).
                reject(_.isEmpty).
                value();
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

                return _.flatten([
                    _.times(cards.length, moveToTemp),
                    _.times(cards.length, moveToTableau)
                ]);

            } else {
                return [];
            }
        },

        moveCardsToFoundation: function (cards, foundation) {
            if (_.isEmpty(foundation) && check.isFullOrderedSuit(cards)) {
                var card = _.first(cards);
                var pile = card.container;

                var take = _.partial(takeCardFrom, pile);
                var add = _.partial(addCardTo, foundation);
                var move = _.compose(add, take);

                return _.each(cards, move);
            } else {
                return [];
            }
        }
    };
}

module.exports = Actions;
