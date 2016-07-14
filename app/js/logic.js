// script with which to quickly interrogate milestone dependencies as per
// the new-fangled dependency graph.

var _ = require('lodash');
var assert = require('assert');

function getRandom() {
    return Math.random();
}

function getNbyN(n, fn) {
    var arr = [];
    _.times(n, function(i) {
        _.times(n, function(j) {
            if (!arr[i]) {
                arr[i] = [];
            }
            if (typeof fn === 'function') {
                arr[i][j] = fn();
            } else {
                arr[i][j] = fn;
            }
        });
    });
    return arr;
}

// Get 'm' faces of dim 'n' of getNbyN
// all initialised to false.
function faces(m, n, fn) {
    var arr = [];
    _.times(m, function(i) {
        arr[i] = getNbyN(n, false);
    });
    return arr;
}

function flip(arr) {
    return _.reduce(arr, function (acc, nestedArr) {
        acc.push(_.reduce(nestedArr, function (nestedAcc, n) {
            nestedAcc.push(n > 0.5);
            return nestedAcc;
        }, []));
        return acc;
    }, []);
}

function rot(matrix, n) {
    n = n || 1;

    _.times(n, function () {
        matrix = rot(matrix);
    });

    return matrix;

    function rot(matrix) {
        return _.map(_.zip.apply(_, matrix), _.reverse);
    }
}

// percentage col
function perCol(plt) {
    return _.reduce(plt, function (accFace, face) {
        return _.reduce(face, function (accRow, row) {
            return _.reduce(row, function (acc, atom) {
                var on = acc.on || 0;
                var off = acc.off || 0;
                acc.on = atom ? on + 1 : on;
                acc.off = !atom ? off + 1 : off;
                return acc;
            }, accRow);
        }, accFace);
    }, {});
}

/**
 * Slams 'st' rotated by 'rots' into 'plt' at index 'idx'.
 */
function slam(plt, st, idx, rots) {
    st = rot(st, rots);
    var face = plt[idx];
    plt[idx] = _.map(face, function (row, i) {
        return _.map(row, function (atom, j) {
            return atom || st[i][j];
        });
    });
}


function test() {
    var DIM = 5;
    var nbyn = getNbyN(DIM, getRandom);
    //console.log('nbyn', nbyn);

    var st = flip(nbyn);
    //console.log('st', st);

    // rotate 4 times for no effect.
    var r = rot(st, 4);
    var r2 = rot(rot(rot(rot(st))));
    assert(_.isEqual(st, r));
    assert(_.isEqual(r, r2));

    var CDIM = 6; // number of faces on plt
    var plt = faces(CDIM, DIM, false);
    //console.log('faces', plt);
    //console.log('percol before', perCol(plt));

    //slam(plt, st, 3, 2);
    //console.log('faces', plt);
    //console.log('percol after', perCol(plt));

    // full sim
    _.times(CDIM, function(idx) {
        // rots = 0, because it doesn't matter now...
        slam(plt, flip(getNbyN(DIM, getRandom)), idx, 0);
    });
    console.log(plt);
    var result = perCol(plt);
    console.log(result);
    assert(result.on + result.off == CDIM * DIM * DIM);
}



test();
