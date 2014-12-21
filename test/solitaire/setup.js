var expect = require('expect.js');
var sinon = require('sinon');

var Setup = require('../../src/solitaire/setup');
var Deck = require('../../src/common/deck');
var _ = require('../../server/public/libs/underscore.js');


describe("Solitaire Setup", function () {
    describe("#createCards()", function () {
        var fakeDeck;

        beforeEach(function () {
            fakeDeck = [];
            sinon.stub(Deck, "createDeck").returns(fakeDeck);
        });

        afterEach(function () {
            Deck.createDeck.restore();
        });

        it("creates cards for hearts, diamonds, clubs and spades", function () {
            Setup.createCards();
            expect(Deck.createDeck.calledOnce).to.be(true);
            expect(Deck.createDeck.calledWith(Deck.SUITS)).to.be(true);
        });

        it("returns all cards", function () {
            var cards = Setup.createCards();
            expect(cards).to.be(fakeDeck);
        });
    });

    describe("#createPiles()", function () {
        it("creates an empty stock", function () {
            var piles = Setup.createPiles();
            expect(piles.stock).to.be.an(Array);
            expect(piles.stock).to.be.empty();
        });

        it("creates an empty waste", function () {
            var piles = Setup.createPiles();
            expect(piles.waste).to.be.an(Array);
            expect(piles.waste).to.be.empty();
        });

        it("creates seven tableaus", function () {
            var piles = Setup.createPiles();
            expect(piles.tableaux).to.be.an(Array);
            expect(piles.tableaux).to.have.length(7);
        });

        it("creates all tableaus as empty", function () {
            var piles = Setup.createPiles();
            _.each(piles.tableaux, function (tableau) {
                expect(tableau).to.be.an(Array);
                expect(tableau).to.be.empty();
            });
        });

        it("creates four foundations", function () {
            var piles = Setup.createPiles();
            expect(piles.foundations).to.be.an(Array);
            expect(piles.foundations).to.have.length(4);
        });

        it("creates all foundations as empty", function () {
            var piles = Setup.createPiles();
            _.each(piles.foundations, function (foundation) {
                expect(foundation).to.be.an(Array);
                expect(foundation).to.be.empty();
            });
        });
    });

    describe("#deal(cards, piles)", function () {
        var cards, piles;

        beforeEach(function () {
            cards = Setup.createCards();
            piles = Setup.createPiles();
        });

        it("spreads the first 7 cards over all tableaus", function () {
            Setup.deal(cards, piles);
            expect(piles.tableaux[0][0]).to.be(cards[0]);
            expect(piles.tableaux[1][0]).to.be(cards[1]);
            expect(piles.tableaux[2][0]).to.be(cards[2]);
            expect(piles.tableaux[3][0]).to.be(cards[3]);
            expect(piles.tableaux[4][0]).to.be(cards[4]);
            expect(piles.tableaux[5][0]).to.be(cards[5]);
            expect(piles.tableaux[6][0]).to.be(cards[6]);
        });

        it("spreads the 8th to 13th cards from the second tableau onwards", function () {
            Setup.deal(cards, piles);
            expect(piles.tableaux[1][1]).to.be(cards[7]);
            expect(piles.tableaux[2][1]).to.be(cards[8]);
            expect(piles.tableaux[3][1]).to.be(cards[9]);
            expect(piles.tableaux[4][1]).to.be(cards[10]);
            expect(piles.tableaux[5][1]).to.be(cards[11]);
            expect(piles.tableaux[6][1]).to.be(cards[12]);
        });

        it("spreads the 14th to 18th cards from the third tableau onwards", function () {
            Setup.deal(cards, piles);
            expect(piles.tableaux[2][2]).to.be(cards[13]);
            expect(piles.tableaux[3][2]).to.be(cards[14]);
            expect(piles.tableaux[4][2]).to.be(cards[15]);
            expect(piles.tableaux[5][2]).to.be(cards[16]);
            expect(piles.tableaux[6][2]).to.be(cards[17]);
        });

        it("spreads the 19th to 22th cards from the fourth tableau onwards", function () {
            Setup.deal(cards, piles);
            expect(piles.tableaux[3][3]).to.be(cards[18]);
            expect(piles.tableaux[4][3]).to.be(cards[19]);
            expect(piles.tableaux[5][3]).to.be(cards[20]);
            expect(piles.tableaux[6][3]).to.be(cards[21]);
        });

        it("spreads the 23th to 25th cards from the fifth tableau onwards", function () {
            Setup.deal(cards, piles);
            expect(piles.tableaux[4][4]).to.be(cards[22]);
            expect(piles.tableaux[5][4]).to.be(cards[23]);
            expect(piles.tableaux[6][4]).to.be(cards[24]);
        });

        it("spreads the 26th to 27th cards from the sixth tableau onwards", function () {
            Setup.deal(cards, piles);
            expect(piles.tableaux[5][5]).to.be(cards[25]);
            expect(piles.tableaux[6][5]).to.be(cards[26]);
        });

        it("places the 28th card in the last tableau", function () {
            Setup.deal(cards, piles);
            expect(piles.tableaux[6][6]).to.be(cards[27]);
        });

        it("places all remaining cards in the stock", function () {
            Setup.deal(cards, piles);
            _.each(_.last(cards, 24), function (card) {
                expect(piles.stock).to.contain(card);
            });
        });

        it("sets all top cards in the tableaux as face up", function () {
            Setup.deal(cards, piles);
            _.each(piles.tableaux, function (tableau) {
                expect(_.last(tableau).faceUp).to.be(true);
            });
        });
    });
});
