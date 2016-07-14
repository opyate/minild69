// script with which to quickly interrogate milestone dependencies as per
// the new-fangled dependency graph.

var _ = require('lodash');
var assert = require('assert');

function getRandom() {
    return Math.random() > 0.5;
}

function getHalf(n, i, j) {
    return i < n / 2;
}

function getQuarter(n, i, j) {
    return i < n / 2 ^ j > n / 2;
}

function getFull() {
    return true;
}

function getCheckered(n, i, j) {
    return (i + j) % 2 == 0;
}

function getDiagonal(n, i, j) {
    return i + j == n;
}

function getCenter(n, i, j) {
    return i == Math.floor(n/2) && j == Math.floor(n/2);
}

function getOne(n, i, j) {
    return i == 1 && j == 1;
}

function getSquare(n, fn) {
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
}

function invert(mtx) {
    return _.map(mtx, function (row) {
        return _.map(row, function (atom) {
            return !atom;
        });
    });
}

// Get 'm' faces of dim 'n' of getSquare
// all initialised to false.
function faces(m, n, fn) {
    var arr = [];
    _.times(m, function(i) {
        arr[i] = getSquare(n, false);
    });
    return arr;
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
function calculateColonised(plt) {
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

var DIM = 5;
var CDIM = 6; // number of faces on plt

function test() {

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
    var st = getSquare(DIM, getHalf);
    //console.log('st', st);
    //console.log('st inv', invert(st));

    var st2 = getSquare(DIM, getOne);
    console.log('st2', st2);
    console.log('st2 inv', invert(st2));

    var plt = faces(CDIM, DIM, false);
}


//test();
test2();
