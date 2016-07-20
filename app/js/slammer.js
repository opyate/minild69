define(['logic'], function(logic) {
    "use strict";

    /**
     * Slams 'stencil' rotated by 'rotations' into 'faces' at index 'idx'.
     */
    var slamStencil = function(faces, idx, stencil, rotations) {
        stencil = logic.faces.rotate(stencil, rotations);
        faces[idx] = _.map(faces[idx], function(row, i) {
            return _.map(row, function(atom, j) {
                return atom || stencil[i][j];
            });
        });
    };

    var slamPlane = function(planet, plane) {

    };

    return {
        slamStencil: slamStencil,
        slamPlane: slamPlane
    };
});
