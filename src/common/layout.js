function spreadDown (base, index) {
    return { top: base.top + (25 * index), left: base.left };
}

function stacked (base, index) {
    var offset = Math.floor(Math.max(0, index) / 3);
    return { top: base.top - offset, left: base.left + offset };
}

function stackedTopSpread (base, index, limit) {
    var stackedBase, offset;
    if (limit < 4) {
        // all cards are spread cards
        offset = 20 * index;
        return { top: base.top, left: base.left + offset };
    } else {
        if (index < limit - 2) {
            // not a spread card
            stackedBase = stacked(base, index);
            return { top: stackedBase.top, left: stackedBase.left };
        } else {
            stackedBase = stacked(base, limit - 3);
            offset = 20 * (index + 3 - limit);
            return { top: stackedBase.top, left: stackedBase.left + offset };
        }
    }
}

module.exports = {
    spreadDown: spreadDown,
    stacked: stacked,
    stackedTopSpread: stackedTopSpread
};
