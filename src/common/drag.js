// duplicated in render
function getPosition (element) {
    var wrap = $(element);
    return {
        top: parseFloat(wrap.css('top')),
        left: parseFloat(wrap.css('left'))
    };
}

// duplicated in render
function setZIndex (element, value) {
    return $(element).css('z-index', value);
}


function Drag (render, game, board, check) {
    var cardWidth = 70,
        cardHeight = 98;

    var cardsInHand = [];
    var mousePosition = { x: 0, y: 0 };


    function getDragCards (card, pile) {
        var index = _.indexOf(pile, card);
        return pile.slice(index);
    }

    function calculateOverlap (aMin, aMax, bMin, bMax) {
        if ( (aMin > bMax) || (aMax < bMin) ) {
            return 0;
        } else {
            var aDiff = Math.max(aMin, bMin),
                bDiff = Math.min(aMax, bMax);
            return bDiff - aDiff;
        }
    }

    function boundingBox (card) {
        var position = getPosition(card.element);
        position.bottom = position.top + cardHeight;
        position.right = position.left + cardWidth;
        return position;
    }

    function boundingBoxTableau (container) {
        var baseArea = boundingBox(container);
        var offset = Math.max(container.pile.length - 1, 0);

        baseArea.top = baseArea.top + offset * 25;
        baseArea.bottom = baseArea.bottom + offset * 25;

        return baseArea;
    }

    function findOverlapArea (container, card) {
        var cardBox = boundingBox(card),
            handBox = boundingBoxTableau(container);

        var hDiff = calculateOverlap(cardBox.left, cardBox.right, handBox.left, handBox.right);
        var vDiff = calculateOverlap(cardBox.top, cardBox.bottom, handBox.top, handBox.bottom);

        return hDiff * vDiff;
    }

    function getHitTargets (card) {
        function isValidTargetForCard(container) {
            if (_.contains(container.pile, card)) {
                return true;
            }
            return container.allowsCard(card);
        }

        function pairWithOverlap (container) {
            return { container: container, overlap: findOverlapArea(container, card) };
        }
        function hasPositiveOverlap (target) { return target.overlap > 0; }

        return _.chain(board.allContainers()).
            filter(isValidTargetForCard).
            map(pairWithOverlap).
            filter(hasPositiveOverlap).
            pluck('container').
            sortBy('overlap').
            reverse().
            value();
    }


    this.start = function (card, x, y) {
        if (check.isDraggable(card, card.container)) {
            cardsInHand = getDragCards(card, card.container);
            var someHighNumber = 300;

            _.each(cardsInHand, function (card, index) {
                setZIndex(card.element, index + someHighNumber);
            });

            mousePosition = { x: x, y: y };
        } else {
            cardsInHand = [];
        }
    };

    this.update = function (x, y) {
        if (!_.isEmpty(cardsInHand)) {
            var dx = x - mousePosition.x;
            var dy = y - mousePosition.y;
            mousePosition = { x: x, y: y };
            render.moveCardsByDelta(cardsInHand, dx, dy);
        }
    };

    this.stop = function () {
        if (!_.isEmpty(cardsInHand)) {
            var hitTargets = getHitTargets(_.first(cardsInHand));

            if (!_.isEmpty(hitTargets)) {
                var container = _.first(hitTargets);
                var action = container.dropAction(cardsInHand);
                game.storeAction(action);
            } else {
                // move card back to container
                var card = _.first(cardsInHand);
                render.forceUpdate(card.container);
            }
        }
        cardsInHand = [];
    };
}

module.exports = Drag;
