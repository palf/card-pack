var expect = require('expect.js');
var Actions = require('../../src/freecell/actions');
var Checks = require('../../src/freecell/checks');


describe("FreeCell Actions", function () {
    var actions;

    describe("#moveCardToDepot(card, depot)", function () {
        var piles, origin, target, card;

        beforeEach(function () {
            card = {};

            piles = {
                depots: [ [], [], [], [] ],
                tableaux: [ [], [], [], [] ],
                foundations: [ [], [], [], [] ]
            };

            origin = piles.tableaux[0];
            origin.push(card);
            target = piles.depots[0];

            var checks = new Checks(piles);
            actions = new Actions(piles, checks);
        });


        describe("when the depot is empty", function () {
            it("adds the card to the depot", function () {
                actions.moveCardToDepot(card, target);
                expect(target).to.have.length(1);
                expect(target).to.contain(card);
            });

            it("removes the card from its origin", function () {
                actions.moveCardToDepot(card, target);
                expect(origin).to.be.empty();
            });

            it("returns an action descriptor", function () {
                var result = actions.moveCardToDepot(card, target);
                expect(result).to.have.length(1);
                expect(result[0].card).to.be(card);
            });

            it("sets the card pile as the origin of the action", function () {
                var result = actions.moveCardToDepot(card, target);
                expect(result[0].origin).to.be(origin);
            });

            it("sets the depot as the target of the action", function () {
                var result = actions.moveCardToDepot(card, target);
                expect(result[0].target).to.be(target);
            });

            it("modifies piles in-place", function () {
                actions.moveCardToDepot(card, target);
                expect(origin).to.be(piles.tableaux[0]);
                expect(target).to.be(piles.depots[0]);
            });
        });

        describe("when the depot is occupied", function () {
            beforeEach(function () {
                target.push({});
            });

            it("does not add the card to the target depot", function () {
                actions.moveCardToDepot(card, target);
                expect(target).to.have.length(1);
                expect(target).not.to.contain(card);
            });

            it("does not remove the card from its origin", function () {
                actions.moveCardToDepot(card, target);
                expect(origin).to.have.length(1);
                expect(origin).to.contain(card);
            });

            it("returns an empty action descriptor", function () {
                var result = actions.moveCardToDepot(card, target);
                expect(result).to.be.empty();
            });
        });
    });

    describe("#sendToDepots(card)", function () {
        var piles, origin, card;

        beforeEach(function () {
            card = {};

            piles = {
                depots: [ [], [], [], [] ],
                tableaux: [ [], [], [], [] ],
                foundations: [ [], [], [], [] ]
            };

            origin = piles.tableaux[0];
            origin.push(card);

            var checks = new Checks(piles);
            actions = new Actions(piles, checks);
        });


        describe("when all depots are empty", function () {
            it("adds the card to the first depot", function () {
                actions.sendToDepots(card);
                expect(piles.depots[0]).to.have.length(1);
                expect(piles.depots[0][0]).to.be(card);
            });

            it("removes the card from its origin", function () {
                actions.sendToDepots(card);
                expect(origin).to.be.empty();
            });

            it("returns an action descriptor", function () {
                var result = actions.sendToDepots(card);
                expect(result).to.have.length(1);
                expect(result[0].card).to.be(card);
            });

            it("sets the card pile as the origin of the action", function () {
                var result = actions.sendToDepots(card);
                expect(result[0].origin).to.be(origin);
            });

            it("sets the first depot as the target of the action", function () {
                var result = actions.sendToDepots(card);
                expect(result[0].target).to.be(piles.depots[0]);
            });

            it("modifies piles in-place", function () {
                actions.sendToDepots(card);
                expect(origin).to.be(piles.tableaux[0]);
            });
        });

        describe("when the first depot is occupied", function () {
            beforeEach(function () {
                piles.depots[0].push({});
            });

            it("adds the card to the first empty depot", function () {
                actions.sendToDepots(card);
                expect(piles.depots[1]).to.have.length(1);
                expect(piles.depots[1]).to.contain(card);
            });

            it("removes the card from its origin", function () {
                actions.sendToDepots(card);
                expect(origin).to.be.empty();
            });

            it("returns an action descriptor", function () {
                var result = actions.sendToDepots(card);
                expect(result).to.have.length(1);
                expect(result[0].card).to.be(card);
            });

            it("sets the card pile as the origin of the action", function () {
                var result = actions.sendToDepots(card);
                expect(result[0].origin).to.be(origin);
            });

            it("sets the first depot as the target of the action", function () {
                var result = actions.sendToDepots(card);
                expect(result[0].target).to.be(piles.depots[1]);
            });
        });

        describe("when all depots are occupied", function () {
            beforeEach(function () {
                piles.depots[0].push({});
                piles.depots[1].push({});
                piles.depots[2].push({});
                piles.depots[3].push({});
            });

            it("does not add the card to any depot", function () {
                actions.sendToDepots(card);
                expect(piles.depots[0]).not.to.contain(card);
                expect(piles.depots[1]).not.to.contain(card);
                expect(piles.depots[2]).not.to.contain(card);
                expect(piles.depots[3]).not.to.contain(card);
            });

            it("does not remove the card from its origin", function () {
                actions.sendToDepots(card);
                expect(origin).to.have.length(1);
                expect(origin[0]).to.be(card);
            });

            it("returns an empty action descriptor", function () {
                var result = actions.sendToDepots(card);
                expect(result).to.be.empty();
            });
        });
    });
});
