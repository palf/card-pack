var expect = require('expect.js');
var Actions = require('../../src/spider/actions');
var Checks = require('../../src/spider/checks');


describe("Spider Actions", function () {
    var piles, checks, actions;

    beforeEach(function () {
        piles = {
            stock: [],
            tableaux: [ [], [], [], [], [], [], [], [], [], [] ],
            foundations: [ [], [], [], [], [], [], [], [] ]
        };

        checks = new Checks(piles);
        actions = new Actions(piles, checks);
    });

    describe("#selectStock(stock)", function () {
        var stock;

        beforeEach(function () {
            stock = piles.stock;
        });

        describe("when the stock is empty", function () {
            it("returns an empty action record", function () {
                var result = actions.selectStock(stock);
                expect(result).to.be.an(Array);
                expect(result).to.be.empty();
            });
        });

        describe("when the stock has less cards than there are tableaus", function () {
            var card01 = { id: 1 },
                card02 = { id: 2 },
                card03 = { id: 3 };

            beforeEach(function () {
                stock.push(card03);
                stock.push(card02);
                stock.push(card01);
            });

            it("removes the cards from the stock", function () {
                actions.selectStock(stock);
                expect(stock).to.be.empty();
            });

            it("adds the cards to the tableaus in ascending order", function () {
                actions.selectStock(stock);
                expect(piles.tableaux[0]).to.contain(card01);
                expect(piles.tableaux[1]).to.contain(card02);
                expect(piles.tableaux[2]).to.contain(card03);
            });

            it("returns an action descriptor", function () {
                var result = actions.selectStock(stock);
                expect(result).to.have.length(3);
                expect(result[0].card).to.be(card01);
                expect(result[1].card).to.be(card02);
                expect(result[2].card).to.be(card03);
            });

            it("sets the stock as the origin of the action", function () {
                var result = actions.selectStock(stock);
                expect(result[0].origin).to.be(stock);
                expect(result[1].origin).to.be(stock);
                expect(result[2].origin).to.be(stock);
            });

            it("sets the tableau as the target of the action", function () {
                var result = actions.selectStock(stock);
                expect(result[0].target).to.be(piles.tableaux[0]);
                expect(result[1].target).to.be(piles.tableaux[1]);
                expect(result[2].target).to.be(piles.tableaux[2]);
            });
        });

        describe("when the stock has more cards than there are tableaus", function () {
            var card01 = { id: 1 },
                card02 = { id: 2 },
                card03 = { id: 3 },
                card04 = { id: 4 },
                card05 = { id: 5 },
                card06 = { id: 6 },
                card07 = { id: 7 },
                card08 = { id: 8 },
                card09 = { id: 9 },
                card10 = { id: 10 },
                card11 = { id: 11 },
                card12 = { id: 12 };


            beforeEach(function () {
                stock.push(card12);
                stock.push(card11);
                stock.push(card10);
                stock.push(card09);
                stock.push(card08);
                stock.push(card07);
                stock.push(card06);
                stock.push(card05);
                stock.push(card04);
                stock.push(card03);
                stock.push(card02);
                stock.push(card01);
            });

            it("removes the cards from the stock", function () {
                actions.selectStock(stock);
                expect(stock).to.have.length(2);
            });

            it("adds the cards to the tableaus in ascending order", function () {
                actions.selectStock(stock);
                expect(piles.tableaux[0]).to.contain(card01);
                expect(piles.tableaux[1]).to.contain(card02);
                expect(piles.tableaux[2]).to.contain(card03);
                expect(piles.tableaux[3]).to.contain(card04);
                expect(piles.tableaux[4]).to.contain(card05);
                expect(piles.tableaux[5]).to.contain(card06);
                expect(piles.tableaux[6]).to.contain(card07);
                expect(piles.tableaux[7]).to.contain(card08);
                expect(piles.tableaux[8]).to.contain(card09);
                expect(piles.tableaux[9]).to.contain(card10);
            });

            it("returns an action descriptor", function () {
                var result = actions.selectStock(stock);
                expect(result).to.have.length(10);
                expect(result[0].card).to.be(card01);
                expect(result[1].card).to.be(card02);
                expect(result[2].card).to.be(card03);
                expect(result[3].card).to.be(card04);
                expect(result[4].card).to.be(card05);
                expect(result[5].card).to.be(card06);
                expect(result[6].card).to.be(card07);
                expect(result[7].card).to.be(card08);
                expect(result[8].card).to.be(card09);
                expect(result[9].card).to.be(card10);
            });

            it("sets the stock as the origin of the action", function () {
                var result = actions.selectStock(stock);
                expect(result[0].origin).to.be(stock);
                expect(result[1].origin).to.be(stock);
                expect(result[2].origin).to.be(stock);
                expect(result[3].origin).to.be(stock);
                expect(result[4].origin).to.be(stock);
                expect(result[5].origin).to.be(stock);
                expect(result[6].origin).to.be(stock);
                expect(result[7].origin).to.be(stock);
                expect(result[8].origin).to.be(stock);
                expect(result[9].origin).to.be(stock);
            });

            it("sets the tableau as the target of the action", function () {
                var result = actions.selectStock(stock);
                expect(result[0].target).to.be(piles.tableaux[0]);
                expect(result[1].target).to.be(piles.tableaux[1]);
                expect(result[2].target).to.be(piles.tableaux[2]);
                expect(result[3].target).to.be(piles.tableaux[3]);
                expect(result[4].target).to.be(piles.tableaux[4]);
                expect(result[5].target).to.be(piles.tableaux[5]);
                expect(result[6].target).to.be(piles.tableaux[6]);
                expect(result[7].target).to.be(piles.tableaux[7]);
                expect(result[8].target).to.be(piles.tableaux[8]);
                expect(result[9].target).to.be(piles.tableaux[9]);
            });
        });
    });
});
