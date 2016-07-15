define([], function() {

    var api = {
        stencil: {}, // stencils by name
        stencils: [], // stencils sorted by difficulty
        faces: {}
    };

    var getRandom = function() {
        return Math.random() > 0.5;
    };

    var getHalf = function(n, i, j) {
        return i < n / 2;
    };

    var getQuarter = function(n, i, j) {
        return i < n / 2 ^ j > n / 2;
    };

    var getCheckered = function(n, i, j) {
        return (i + j) % 2 == 0;
    };

    var getDiagonal = function(n, i, j) {
        return i + j == n;
    };

    var getCenter = function(n, i, j) {
        return i == Math.floor(n / 2) && j == Math.floor(n / 2);
    };

    var getOne = function(n, i, j) {
        return i == 1 && j == 1;
    };

    var getAll = function() {
        return true;
    };

    // build stencil API
    _.each([{
        name: 'all',
        fn: getAll
    }, {
        name: 'half',
        fn: getHalf
    }, {
        name: 'quarter',
        fn: getQuarter
    }, {
        name: 'center',
        fn: getCenter
    }, {
        name: 'one',
        fn: getOne
    }, {
        name: 'diagonal',
        fn: getDiagonal
    }, {
        name: 'checkered',
        fn: getCheckered
    }, {
        name: 'random',
        fn: getRandom
    }], function(o, idx) {
        api.stencil[o.name] = o.fn;
        // stencils sorted by difficulty, easiest first (lowest index)
        api.stencils.push(o);
    });

    // get face of dimension n*n initialised with 'fn'
    var initFace = function(n, fn) {
        var arr = [];
        _.times(n, function(i) {
            _.times(n, function(j) {
                if (!arr[i]) {
                    arr[i] = [];
                }
                if (typeof fn === 'function') {
                    arr[i][j] = fn(n, i, j);
                } else {
                    arr[i][j] = fn;
                }
            });
        });
        return arr;
    };
    api.faces.init = initFace;

    var toggle = function(face) {
        return _.map(face, function(row) {
            return _.map(row, function(atom) {
                return !atom;
            });
        });
    };
    api.faces.toggle = toggle;

    // Get 'm' faces of dim 'n' of getSquare
    // all initialised to false.
    var initFaces = function(m, n, fn) {
        var arr = [];
        _.times(m, function(i) {
            arr[i] = initFace(n, false);
        });
        return arr;
    };
    api.faces.initN = initFaces;

    var rotateFace = function(face, n) {
        n = n || 1;

        _.times(n, function() {
            face = rot(face);
        });

        return face;

        function rot(matrix) {
            return _.map(_.zip.apply(_, matrix), _.reverse);
        }
    };
    api.faces.rotate = rotateFace;

    // percentage col
    var calculateColonised = function(faces) {
        return _.reduce(faces, function(accFace, face) {
            return _.reduce(face, function(accRow, row) {
                return _.reduce(row, function(acc, atom) {
                    var on = acc.on || 0;
                    var off = acc.off || 0;
                    acc.on = atom ? on + 1 : on;
                    acc.off = !atom ? off + 1 : off;
                    return acc;
                }, accRow);
            }, accFace);
        }, {});
    };
    api.faces.calc = calculateColonised;

    /**
     * Slams 'stencil' rotated by 'rotations' into 'faces' at index 'idx'.
     */
    var slam = function(faces, idx, stencil, rotations) {
        stencil = rotateFace(stencil, rotations);
        faces[idx] = _.map(faces[idx], function(row, i) {
            return _.map(row, function(atom, j) {
                return atom || stencil[i][j];
            });
        });
    };
    api.faces.slam = slam;


    function test() {
        var DIM = 5;
        var CDIM = 6; // number of faces on plt

        var st = getSquare(DIM, getRandom);

        // rotate 4 times for no effect.
        var r = rot(st, 4);
        var r2 = rot(rot(rot(rot(st))));
        assert(_.isEqual(st, r));
        assert(_.isEqual(r, r2));

        var plt = faces(CDIM, DIM, false);
        //console.log('faces', plt);
        //console.log('percol before', calculateColonised(plt));

        //slam(plt, st, 3, 2);
        //console.log('faces', plt);
        //console.log('percol after', calculateColonised(plt));

        // full sim
        _.times(CDIM, function(idx) {
            // rots = 0, because it doesn't matter now...
            slam(plt, getSquare(DIM, getRandom), idx, 0);
        });
        console.log(plt);
        var result = calculateColonised(plt);
        console.log(result);
        assert(result.on + result.off == CDIM * DIM * DIM);
    }

    function test2() {
        var DIM = 5;
        var CDIM = 6; // number of faces on plt

        var st = getSquare(DIM, getHalf);
        //console.log('st', st);
        //console.log('st inv', invert(st));

        var st2 = getSquare(DIM, getOne);
        console.log('st2', st2);
        console.log('st2 inv', invert(st2));

        var plt = faces(CDIM, DIM, false);
    }

    return api;

});
