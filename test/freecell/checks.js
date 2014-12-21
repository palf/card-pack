var expect = require('expect.js');
var Checks = require('../../src/freecell/checks');

describe("FreeCell Checks", function () {
    var piles, checks;

    beforeEach(function () {
        piles = {
            depots: [ [], [], [], [] ],
            tableaux: [ [], [], [], [] ],
            foundations: [ [], [], [], [] ]
        };
        checks = new Checks(piles);
    });


    describe("#isOrderedFrom(card)", function () {
        var black = {}, red = {};

        describe("with one card", function () {
            var card;

            beforeEach(function () {
                card = { rank: 5 };
                piles.tableaux[0].push(card);
            });

            it("returns true if the card is in the hand", function () {
                var result = checks.isOrderedFrom(card);
                expect(result).to.be(true);
            });

            it("returns false if the card is not in the hand", function () {
                var result = checks.isOrderedFrom({});
                expect(result).to.be(false);
            });
        });

        describe("with two cards", function () {
            var card1, card2;

            beforeEach(function () {
                card1 = { rank: 5, color: black };
                card2 = { rank: 4, color: red };
                piles.tableaux[0].push(card1);
                piles.tableaux[0].push(card2);
            });

            it("returns true when ordered and switching colors", function () {
                var result = checks.isOrderedFrom(card1);
                expect(result).to.be(true);
            });

            it("returns false when ordered and matching colors", function () {
                card1.color = black;
                card2.color = black;

                var result = checks.isOrderedFrom(card1);
                expect(result).to.be(false);
            });

            it("returns false when not ordered and switching colors", function () {
                card1.rank = 5;
                card2.rank = 7;

                var result = checks.isOrderedFrom(card1);
                expect(result).to.be(false);
            });

            it("returns false when not ordered and matching colors", function () {
                card1.rank = 5;
                card1.color = black;
                card2.rank = 7;
                card2.color = black;

                var result = checks.isOrderedFrom(card1);
                expect(result).to.be(false);
            });

            it("ignores cards when looking for a partial ordering", function () {
                card1.rank = 5;
                card1.color = black;
                card2.rank = 7;
                card1.color = black;

                var result = checks.isOrderedFrom(card2);
                expect(result).to.be(true);
            });
        });

        describe("with three cards", function () {
            var card1, card2, card3;

            beforeEach(function () {
                card1 = { rank: 5, color: black };
                card2 = { rank: 4, color: red };
                card3 = { rank: 3, color: black };
                piles.tableaux[0].push(card1);
                piles.tableaux[0].push(card2);
                piles.tableaux[0].push(card3);
            });

            it("returns true when ordered and switching colors", function () {
                var result = checks.isOrderedFrom(card1);
                expect(result).to.be(true);
            });

            it("returns false when ordered and matching colors", function () {
                card1.rank = 5;
                card1.color = black;
                card2.rank = 4;
                card2.color = black;
                card3.rank = 3;
                card3.color = black;

                var result = checks.isOrderedFrom(card1);
                expect(result).to.be(false);
            });

            it("returns false when not ordered and switching colors", function () {
                card1.rank = 5;
                card1.color = black;
                card2.rank = 6;
                card2.color = red;
                card3.rank = 3;
                card3.color = black;

                var result = checks.isOrderedFrom(card1);
                expect(result).to.be(false);
            });

            it("returns false when not ordered and matching colors", function () {
                card1.rank = 5;
                card1.color = black;
                card2.rank = 6;
                card2.color = black;
                card3.rank = 3;
                card3.color = black;

                var result = checks.isOrderedFrom(card1);
                expect(result).to.be(false);
            });

            it("ignores cards when looking for a partial ordering", function () {
                card1.rank = 5;
                card1.color = red;
                card2.rank = 4;
                card2.color = red;
                card3.rank = 3;
                card3.color = black;

                var result = checks.isOrderedFrom(card2);
                expect(result).to.be(true);
            });
        });
    });
});
