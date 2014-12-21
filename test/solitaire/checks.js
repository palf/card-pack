var assert = require('assert');
var Checks = require('../../src/solitaire/checks');
var Deck = require('../../src/common/deck');

describe("Solitaire Checks", function () {
    var piles, checks;

    beforeEach(function () {
        piles = {
            stock: [],
            waste: [],
            tableaux: [ [], [], [], [], [], [], [] ],
            foundations: [ [], [], [], [] ]
        };
        checks = new Checks(piles);
    });

    describe("#tableauAllowsCard(tableau, card)", function () {
        describe("when the tableau is empty", function () {
            var tableau = [];

            it("allows Kings to be placed", function () {
                var card = { rank: Deck.KING };
                var result = checks.tableauAllowsCard(tableau, card);
                assert.equal(result, true);
            });

            it("does not allow other ranks to be placed", function () {
                var card = { rank: Deck.ACE };
                var result = checks.tableauAllowsCard(tableau, card);
                assert.equal(result, false);
            });
        });

        describe("when the tableau has one face-up card", function () {
            var topCard = Deck.createCard('hearts', 4);
            topCard.faceUp = true;
            var tableau = [ topCard ];

            it("allows opposite color and lower-by-one rank cards only", function () {
                var cardSpades = Deck.createCard('spades', 3);
                var spadesResult = checks.tableauAllowsCard(tableau, cardSpades);
                assert.equal(spadesResult, true);

                var cardClubs = Deck.createCard('clubs', 3);
                var clubsResult = checks.tableauAllowsCard(tableau, cardClubs);
                assert.equal(clubsResult, true);
            });

            it("does not allow same color cards", function () {
                var cardHearts = Deck.createCard('hearts', 3);
                var heartsResult = checks.tableauAllowsCard(tableau, cardHearts);
                assert.equal(heartsResult, false);

                var cardDiamonds = Deck.createCard('diamonds', 3);
                var diamondsResult = checks.tableauAllowsCard(tableau, cardDiamonds);
                assert.equal(diamondsResult, false);
            });

            it("does not allow other ranks of cards", function () {
                var cardSpades = Deck.createCard('spades', 4);
                var spadesResult = checks.tableauAllowsCard(tableau, cardSpades);
                assert.equal(spadesResult, false);

                var cardClubs = Deck.createCard('clubs', 2);
                var clubsResult = checks.tableauAllowsCard(tableau, cardClubs);
                assert.equal(clubsResult, false);
            });
        });

        describe("when the tableau has one face-down card", function () {
            var topCard = Deck.createCard('hearts', 4);
            topCard.faceUp = false;
            var tableau = [ topCard ];

            it("does not allow any card", function () {
                var cardSpades = Deck.createCard('spades', 3);
                var spadesResult = checks.tableauAllowsCard(tableau, cardSpades);
                assert.equal(spadesResult, false);

                var cardHearts = Deck.createCard('hearts', 3);
                var heartsResult = checks.tableauAllowsCard(tableau, cardHearts);
                assert.equal(heartsResult, false);

                var cardDiamonds = Deck.createCard('diamonds', 2);
                var diamondsResult = checks.tableauAllowsCard(tableau, cardDiamonds);
                assert.equal(diamondsResult, false);
            });
        });

        describe("when the tableau has multiple face-up cards", function () {
            var card01 = Deck.createCard('hearts', 4);
            var card02 = Deck.createCard('diamonds', 7);
            var card03 = Deck.createCard('spades', 6);
            card03.faceUp = true;
            var tableau = [ card01, card02, card03 ];

            it("only considers the last card for building", function () {
                var cardHearts = Deck.createCard('hearts', 5);
                var heartsResult = checks.tableauAllowsCard(tableau, cardHearts);
                assert.equal(heartsResult, true);

                var cardClubs = Deck.createCard('clubs', 6);
                var clubsResult = checks.tableauAllowsCard(tableau, cardClubs);
                assert.equal(clubsResult, false);
            });
        });
    });

    describe("#foundationAllowsCard(foundation, card)", function () {
        describe("when the foundation is empty", function () {
            var foundation = [];

            it("allows Aces to be placed", function () {
                var card = { rank: Deck.ACE };
                var result = checks.foundationAllowsCard(foundation, card);
                assert.equal(result, true);
            });

            it("does not allow other ranks to be placed", function () {
                var card = { rank: Deck.KING };
                var result = checks.foundationAllowsCard(foundation, card);
                assert.equal(result, false);
            });
        });

        describe("when the foundation has one face-up card", function () {
            var topCard = Deck.createCard('hearts', 4);
            topCard.faceUp = true;
            var foundation = [ topCard ];

            it("allows same color and greater-by-one rank cards only", function () {
                var card = Deck.createCard('hearts', 5);
                var result = checks.foundationAllowsCard(foundation, card);
                assert.equal(result, true);
            });

            it("does not allow other suits of cards", function () {
                var cardDiamonds = Deck.createCard('diamonds', 5);
                var diamondsResult = checks.foundationAllowsCard(foundation, cardDiamonds);
                assert.equal(diamondsResult, false);

                var cardSpades = Deck.createCard('spades', 5);
                var spadesResult = checks.foundationAllowsCard(foundation, cardSpades);
                assert.equal(spadesResult, false);

                var cardClubs = Deck.createCard('clubs', 5);
                var clubsResult = checks.foundationAllowsCard(foundation, cardClubs);
                assert.equal(clubsResult, false);
            });

            it("does not allow other ranks of cards", function () {
                var card = Deck.createCard('hearts', 3);
                var result = checks.foundationAllowsCard(foundation, card);
                assert.equal(result, false);
            });
        });

        describe("when the foundation has multiple face-up cards", function () {
            var card01 = Deck.createCard('hearts', 4);
            var card02 = Deck.createCard('diamonds', 7);
            var card03 = Deck.createCard('spades', 6);
            card03.faceUp = true;
            var foundation = [ card01, card02, card03 ];

            it("only considers the last card for building", function () {
                var cardSpades = Deck.createCard('spades', 7);
                var spadesResult = checks.foundationAllowsCard(foundation, cardSpades);
                assert.equal(spadesResult, true);

                var cardDiamonds = Deck.createCard('diamonds', 8);
                var diamondsResult = checks.foundationAllowsCard(foundation, cardDiamonds);
                assert.equal(diamondsResult, false);
            });
        });
    });
});
