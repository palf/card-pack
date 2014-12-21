function suppressEvent (event) {
    event.stopPropagation();
    event.preventDefault();
}

module.exports = {

    bindMenuHandlers: function (game) {
        $('a[href="#newgame"]').click(function (event) {
            suppressEvent(event);
            game.newGame();
        });

        $('a[href="#restart"]').click(function (event) {
            suppressEvent(event);
            game.restart();
        });

        $('a[href="#undo"]').click(function (event) {
            suppressEvent(event);
            game.undoAction();
        });
    },

    bindDocumentEventHandlers: function (drag) {
        var doc = $(document);
        doc.mouseup(function (ev) {
            drag.stop(ev.pageX, ev.pageY);
        });
        doc.mousemove(function (ev) {
            drag.update(ev.pageX, ev.pageY);
        });
    },

    bindCardEventHandlers: function (click, drag) {
        var cardDivs = $('.card');

        cardDivs.dblclick(function () {
            return click.doubleClickCard(this.card);
        });

        cardDivs.mousedown(function (ev) {
            return drag.start(this.card, ev.pageX, ev.pageY);
        });

        cardDivs.click(function () {
            return click.singleClickCard(this.card);
        });

        cardDivs.bind('contextmenu', function () {
            return false;
        });
    }
};
