var Layout = require('../common/layout');

function Board (actions, check) {

    function doNothing () { return []; }
    function alwaysFalse () { return false; }

    function dropOnTableau (pile, cards) {
        return actions.moveCardsToTableau(cards, pile);
    }

    function dropOnFoundation (pile, cards) {
        if (cards.length === 1) {
            var dropCard = _.first(cards);
            return actions.moveCardToFoundation(dropCard, pile);
        } else {
            return [];
        }
    }

    function setupStockContainer (stock) {
        return {
            pile: stock,
            element: $('#stock'),
            layout: Layout.stacked,
            allowsCard: alwaysFalse,
            dropAction: doNothing
        };
    }

    function setupWasteContainer (waste) {
        return {
            pile: waste,
            element: $('#waste'),
            layout: Layout.stackedTopSpread,
            allowsCard: alwaysFalse,
            dropAction: doNothing
        };
    }

    function setupTableauContainers (tableaux) {
        return _.map(tableaux, function (tableau, index) {
            return {
                pile: tableau,
                element: $($('.tableau')[index]),
                layout: Layout.spreadDown,
                allowsCard: _.partial(check.tableauAllowsCard, tableau),
                dropAction: _.partial(dropOnTableau, tableau)
            };
        });
    }

    function setupFoundationContainers (foundations) {
        return _.map(foundations, function (foundation, index) {
            return {
                pile: foundation,
                element: $($('.foundation')[index]),
                layout: Layout.stacked,
                allowsCard: _.partial(check.foundationAllowsCard, foundation),
                dropAction: _.partial(dropOnFoundation, foundation)
            };
        });
    }

    var containers = [];

    this.allContainers = function () {
        return containers;
    };

    this.createCardElements = function (cards) {
        var tableDiv = $('#cards');
        return _.each(cards, function (card) {
            var element = document.createElement('div');
            $(element).addClass('card');
            tableDiv.append(element);
            card.element = element;
            element.card = card;
            return element;
        });
    };

    this.createContainers = function (solitaire) {
        var stockContainer = setupStockContainer(solitaire.stock);
        var wasteContainer = setupWasteContainer(solitaire.waste);
        var tableauContainers = setupTableauContainers(solitaire.tableaux);
        var foundationContainers = setupFoundationContainers(solitaire.foundations);

        containers.push(stockContainer);
        containers.push(wasteContainer);
        _.map(tableauContainers, function (x) { containers.push(x); });
        _.map(foundationContainers, function (x) { containers.push(x); });
    };

    this.removeAllElements = function (cards) {
        _.each(cards, function (card) {
            $(card.element).remove();
        });
    };

    this.containerForPile = function (pile) {
        return _.find(containers, function (container) {
            return container.pile === pile;
        });
    };
}

module.exports = Board;
