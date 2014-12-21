var assert = require('assert');
var Layout = require('../../src/common/layout');

describe("Layout", function () {
    describe('.spreadDown', function () {
        var base = { top: 0, left: 0 };

        describe('no cards:', function () {
            var limit = 0;

            it("card 01: (0, 0)", function () {
                var result = Layout.spreadDown(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });
        });

        describe('one card:', function () {
            var limit = 1;

            it("card 01: (0, 0)", function () {
                var result = Layout.spreadDown(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });
        });

        describe('two cards:', function () {
            var limit = 2;

            it("card 01: (0, 0)", function () {
                var result = Layout.spreadDown(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (25, 0)", function () {
                var result = Layout.spreadDown(base, 1, limit);
                assert.equal(result.top, 25);
                assert.equal(result.left, 0);
            });
        });

        describe('three cards:', function () {
            var limit = 3;

            it("card 01: (0, 0)", function () {
                var result = Layout.spreadDown(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (25, 0)", function () {
                var result = Layout.spreadDown(base, 1, limit);
                assert.equal(result.top, 25);
                assert.equal(result.left, 0);
            });

            it("card 03: (50, 0)", function () {
                var result = Layout.spreadDown(base, 2, limit);
                assert.equal(result.top, 50);
                assert.equal(result.left, 0);
            });
        });

        describe('four cards:', function () {
            var limit = 4;

            it("card 01: (0, 0)", function () {
                var result = Layout.spreadDown(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (25, 0)", function () {
                var result = Layout.spreadDown(base, 1, limit);
                assert.equal(result.top, 25);
                assert.equal(result.left, 0);
            });

            it("card 03: (50, 0)", function () {
                var result = Layout.spreadDown(base, 2, limit);
                assert.equal(result.top, 50);
                assert.equal(result.left, 0);
            });

            it("card 04: (75, 0)", function () {
                var result = Layout.spreadDown(base, 3, limit);
                assert.equal(result.top, 75);
                assert.equal(result.left, 0);
            });
        });
    });


    describe('.stacked', function () {
        var base = { top: 0, left: 0 };

        describe('no cards:', function () {
            var limit = 0;

            it("card 01: (0, 0)", function () {
                var result = Layout.stacked(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });
        });

        describe('one card:', function () {
            var limit = 1;

            it("card 01: (0, 0)", function () {
                var result = Layout.stacked(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });
        });

        describe('two cards:', function () {
            var limit = 2;

            it("card 01: (0, 0)", function () {
                var result = Layout.stacked(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stacked(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });
        });

        describe('three cards:', function () {
            var limit = 3;

            it("card 01: (0, 0)", function () {
                var result = Layout.stacked(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stacked(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stacked(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });
        });

        describe('four cards:', function () {
            var limit = 4;

            it("card 01: (0, 0)", function () {
                var result = Layout.stacked(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stacked(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stacked(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (-1, 1)", function () {
                var result = Layout.stacked(base, 3, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });
        });

        describe('five cards:', function () {
            var limit = 5;

            it("card 01: (0, 0)", function () {
                var result = Layout.stacked(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stacked(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stacked(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (-1, 1)", function () {
                var result = Layout.stacked(base, 3, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 05: (-1, 1)", function () {
                var result = Layout.stacked(base, 4, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });
        });

        describe('six cards:', function () {
            var limit = 6;

            it("card 01: (0, 0)", function () {
                var result = Layout.stacked(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stacked(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stacked(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (-1, 1)", function () {
                var result = Layout.stacked(base, 3, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 05: (-1, 1)", function () {
                var result = Layout.stacked(base, 4, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 06: (-1, 1)", function () {
                var result = Layout.stacked(base, 5, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });
        });

        describe('seven cards:', function () {
            var limit = 7;

            it("card 01: (0, 0)", function () {
                var result = Layout.stacked(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stacked(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stacked(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (-1, 1)", function () {
                var result = Layout.stacked(base, 3, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 05: (-1, 1)", function () {
                var result = Layout.stacked(base, 4, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 06: (-1, 1)", function () {
                var result = Layout.stacked(base, 5, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 07: (-2, 2)", function () {
                var result = Layout.stacked(base, 6, limit);
                assert.equal(result.top, -2);
                assert.equal(result.left, 2);
            });
        });
    });


    describe('.stackedTopSpread', function () {
        var base = { top: 0, left: 0 };

        describe('no cards:', function () {
            var limit = 0;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });
        });

        describe('one card:', function () {
            var limit = 1;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });
        });

        describe('two cards:', function () {
            var limit = 2;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 20)", function () {
                var result = Layout.stackedTopSpread(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 20);
            });
        });

        describe('three cards:', function () {
            var limit = 3;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 20)", function () {
                var result = Layout.stackedTopSpread(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 20);
            });

            it("card 03: (0, 40)", function () {
                var result = Layout.stackedTopSpread(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 40);
            });
        });

        describe('four cards:', function () {
            var limit = 4;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 20)", function () {
                var result = Layout.stackedTopSpread(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 20);
            });

            it("card 04: (0, 40)", function () {
                var result = Layout.stackedTopSpread(base, 3, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 40);
            });
        });

        describe('five cards:', function () {
            var limit = 5;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (0, 20)", function () {
                var result = Layout.stackedTopSpread(base, 3, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 20);
            });

            it("card 05: (0, 40)", function () {
                var result = Layout.stackedTopSpread(base, 4, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 40);
            });
        });

        describe('six cards:', function () {
            var limit = 6;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 3, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 05: (-1, 21)", function () {
                var result = Layout.stackedTopSpread(base, 4, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 21);
            });

            it("card 06: (-1, 41)", function () {
                var result = Layout.stackedTopSpread(base, 5, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 41);
            });
        });

        describe('seven cards:', function () {
            var limit = 7;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 3, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 05: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 4, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 06: (-1, 21)", function () {
                var result = Layout.stackedTopSpread(base, 5, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 21);
            });

            it("card 07: (-1, 41)", function () {
                var result = Layout.stackedTopSpread(base, 6, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 41);
            });
        });

        describe('eight cards:', function () {
            var limit = 8;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 3, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 05: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 4, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 06: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 5, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 07: (-1, 21)", function () {
                var result = Layout.stackedTopSpread(base, 6, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 21);
            });

            it("card 08: (-1, 41)", function () {
                var result = Layout.stackedTopSpread(base, 7, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 41);
            });
        });

        describe('nine cards:', function () {
            var limit = 9;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 3, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 05: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 4, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 06: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 5, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 07: (-2, 2)", function () {
                var result = Layout.stackedTopSpread(base, 6, limit);
                assert.equal(result.top, -2);
                assert.equal(result.left, 2);
            });

            it("card 08: (-2, 22)", function () {
                var result = Layout.stackedTopSpread(base, 7, limit);
                assert.equal(result.top, -2);
                assert.equal(result.left, 22);
            });

            it("card 09: (-2, 42)", function () {
                var result = Layout.stackedTopSpread(base, 8, limit);
                assert.equal(result.top, -2);
                assert.equal(result.left, 42);
            });
        });

        describe('ten cards:', function () {
            var limit = 10;

            it("card 01: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 0, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 02: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 1, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 03: (0, 0)", function () {
                var result = Layout.stackedTopSpread(base, 2, limit);
                assert.equal(result.top, 0);
                assert.equal(result.left, 0);
            });

            it("card 04: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 3, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 05: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 4, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 06: (-1, 1)", function () {
                var result = Layout.stackedTopSpread(base, 5, limit);
                assert.equal(result.top, -1);
                assert.equal(result.left, 1);
            });

            it("card 07: (-2, 2)", function () {
                var result = Layout.stackedTopSpread(base, 6, limit);
                assert.equal(result.top, -2);
                assert.equal(result.left, 2);
            });

            it("card 08: (-2, 2)", function () {
                var result = Layout.stackedTopSpread(base, 7, limit);
                assert.equal(result.top, -2);
                assert.equal(result.left, 2);
            });

            it("card 09: (-2, 22)", function () {
                var result = Layout.stackedTopSpread(base, 8, limit);
                assert.equal(result.top, -2);
                assert.equal(result.left, 22);
            });

            it("card 10: (-2, 42)", function () {
                var result = Layout.stackedTopSpread(base, 9, limit);
                assert.equal(result.top, -2);
                assert.equal(result.left, 42);
            });
        });
    });
});
