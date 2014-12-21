var expect = require('expect.js');
var checks = require('../../src/common/checks');

describe("Common Checks", function () {

    describe(".countOf(list, predicate)", function () {
        it("returns the number of list elements that match a predicate", function () {
            var list = [ true, false, true, true ],
                predicate = function (x) { return x; };

            var result = checks.countOf(list, predicate);
            expect(result).to.be(3);
        });

        it("returns 0 for an empty list", function () {
            var list = [ ],
                predicate = function (x) { return x; };

            var result = checks.countOf(list, predicate);
            expect(result).to.be(0);
        });
    });

    describe(".isShowing(card)", function () {
        it("returns true if the card is face up", function () {
            var card = { faceUp: true };
            var result = checks.isShowing(card);
            expect(result).to.be(true);
        });

        it("returns false if the card is face down", function () {
            var card = { faceUp: false };
            var result = checks.isShowing(card);
            expect(result).to.be(false);
        });

        it("returns false if the card face is not defined", function () {
            var card = {};
            var result = checks.isShowing(card);
            expect(result).to.be(false);
        });
    });

    describe(".isSameSuit(cardA, cardB)", function () {
        it("returns true when both cards are the same suit", function () {
            var suit = {},
                cardA = { suit: suit },
                cardB = { suit: suit },
                result = checks.isSameSuit(cardA, cardB);
            expect(result).to.be(true);
        });

        it("returns false when cards are different suits", function () {
            var cardA = { suit: {} },
                cardB = { suit: {} },
                result = checks.isSameSuit(cardA, cardB);
            expect(result).to.be(false);
        });
    });

    describe(".isDifferentColor(cardA, cardB)", function () {
        it("returns false when both cards are the same color", function () {
            var color = {},
                cardA = { color: color },
                cardB = { color: color },
                result = checks.isDifferentColor(cardA, cardB);
            expect(result).to.be(false);
        });

        it("returns true when cards are different colors", function () {
            var cardA = { color: {} },
                cardB = { color: {} },
                result = checks.isDifferentColor(cardA, cardB);
            expect(result).to.be(true);
        });
    });

    describe(".isOneLessThan(cardA, cardB)", function () {
        it("returns true when card A is one less than card B", function () {
            var cardA = { rank: 3 },
                cardB = { rank: 4 },
                result = checks.isOneLessThan(cardA, cardB);
            expect(result).to.be(true);
        });

        it("returns false when card A is much less than card B", function () {
            var cardA = { rank: 3 },
                cardB = { rank: 6 },
                result = checks.isOneLessThan(cardA, cardB);
            expect(result).to.be(false);
        });

        it("returns false when card A is the same rank as card B", function () {
            var cardA = { rank: 3 },
                cardB = { rank: 3 },
                result = checks.isOneLessThan(cardA, cardB);
            expect(result).to.be(false);
        });

        it("returns false when card A is one more than than card B", function () {
            var cardA = { rank: 4 },
                cardB = { rank: 3 },
                result = checks.isOneLessThan(cardA, cardB);
            expect(result).to.be(false);
        });
    });

    describe(".isOneMoreThan(cardA, cardB)", function () {
        it("returns true when card A is one more than card B", function () {
            var cardA = { rank: 3 },
                cardB = { rank: 2 },
                result = checks.isOneMoreThan(cardA, cardB);
            expect(result).to.be(true);
        });

        it("returns false when card A is much more than card B", function () {
            var cardA = { rank: 3 },
                cardB = { rank: 0 },
                result = checks.isOneMoreThan(cardA, cardB);
            expect(result).to.be(false);
        });

        it("returns false when card A is the same rank as card B", function () {
            var cardA = { rank: 3 },
                cardB = { rank: 3 },
                result = checks.isOneMoreThan(cardA, cardB);
            expect(result).to.be(false);
        });

        it("returns false when card A is one less than than card B", function () {
            var cardA = { rank: 2 },
                cardB = { rank: 3 },
                result = checks.isOneMoreThan(cardA, cardB);
            expect(result).to.be(false);
        });
    });

    describe(".isWithin(pile, card)", function () {
        it("returns true when the card is within the pile", function () {
            var card = {},
                pile = [ card ];
            var result = checks.isWithin(pile, card);
            expect(result).to.be(true);
        });

        it("returns false when the card is not within the pile", function () {
            var card = {},
                pile = [];
            var result = checks.isWithin(pile, card);
            expect(result).to.be(false);
        });

        it("can find cards nested within pile sets", function () {
            var card = {},
                piles = [ [], [card], [] ];
            var result = checks.isWithin(piles, card);
            expect(result).to.be(true);
        });
    });

    describe(".isTopCardOf(pile, card)", function () {
        it("returns true when the card is top of the pile", function () {
            var card = {},
                pile = [ {}, {}, card ];
            var result = checks.isTopCardOf(pile, card);
            expect(result).to.be(true);
        });

        it("returns false when the card is not top of the pile", function () {
            var card = {},
                pile = [ card, {}, {} ];
            var result = checks.isTopCardOf(pile, card);
            expect(result).to.be(false);
        });

        it("returns false when the card is not in the pile", function () {
            var card = {},
                piles = [ {}, {}, {} ];
            var result = checks.isTopCardOf(piles, card);
            expect(result).to.be(false);
        });
    });
});
