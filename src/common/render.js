// duplicated in drag
function getPosition (element) {
    var wrap = $(element);
    return {
        top: parseFloat(wrap.css('top')),
        left: parseFloat(wrap.css('left'))
    };
}

// duplicated in drag
function setZIndex (element, value) {
    return $(element).css('z-index', value);
}


function Render (board, check) {
    "use strict";

    var ANIMATION_MS = 100;

    function applyFlipped (card) {
        var element = $(card.element);
        var cardClass = card.suit + card.rank;
        if (card.faceUp) {
            element.removeClass('flipped');
            element.addClass(cardClass);
        } else {
            element.addClass('flipped');
            element.removeClass(cardClass);
        }
    }

    function setCardCursor (card) {
        if (check.isClickable(card)) {
            $(card.element).css('cursor', 'pointer');
        } else {
            $(card.element).css('cursor', 'auto');
        }
    }

    function setPosition (element, top, left) {
        return $(element).css({
            top: top,
            left: left
        });
    }

    function animateMove (card, target, callback) {
        $(card.element).animate(
            target, {
                complete: function () { callback(); },
                duration: ANIMATION_MS,
                queue: false
            }
        );
    }

    function animateFlip (card) {
        var pos = getPosition(card.element);
        var toLeft = { left: pos.left + 7 };
        var origin = { left: pos.left };

        $(card.element).animate(
            toLeft,
            ANIMATION_MS / 2,
            function () { applyFlipped(card); }
        ).animate(
            origin,
            ANIMATION_MS / 2
        );
    }

    function renderContainerContent (container) {
        var basePosition = getPosition(container.element);
        var layoutFunc = _.partial(container.layout, basePosition);
        var limit = container.pile.length;

        _.each(container.pile, function (card, index) {
            setZIndex(card.element, index);

            var currentPosition = getPosition(card.element),
                targetPosition = layoutFunc(index, limit);

            var topDiff = targetPosition.top - currentPosition.top,
                leftDiff = targetPosition.left - currentPosition.left;

            var elementIsFaceUp = !_.contains(card.element.classList, 'flipped');
            var cardIsFaceUp = card.faceUp;
            var requiresFlip;

            if (cardIsFaceUp === elementIsFaceUp) {
                requiresFlip = false;
            } else {
                requiresFlip = true;
            }


            if (topDiff !== 0 || leftDiff !== 0) {
                // arbitrary large number; greater than card deck length
                setZIndex(card.element, 300 + index);
                applyFlipped(card);

                animateMove(card, targetPosition, function () {
                    setZIndex(card.element, index);
                });
            } else if (requiresFlip) {
                animateFlip(card);
            } else {
                applyFlipped(card);
            }

            setCardCursor(card);
        });
    }


    this.everything = function (callback) {
        _.each(board.allContainers(), renderContainerContent);
        if (_.isFunction(callback)) {
            setTimeout(callback, ANIMATION_MS);
        }
    };

    this.renderAction = function (parts) {
        var affectedOrigins = _.pluck(parts, 'origin'),
            affectedTargets = _.pluck(parts, 'target'),
            affectedPiles = affectedOrigins.concat(affectedTargets);

        var affectedContainers = _.chain(affectedPiles).
            uniq().
            map(board.containerForPile).
            compact().
            value();

        _.each(affectedContainers, renderContainerContent);
    };

    this.forceUpdate = function (pile) {
        var container = board.containerForPile(pile);
        renderContainerContent(container);
    };

    this.moveCardsByDelta = function (cards, dx, dy) {
        _.each(cards, function (card) {
            setPosition(card.element, '+=' + dy, '+=' + dx);
        });
    };
}

module.exports = Render;
