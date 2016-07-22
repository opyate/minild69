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

    var slamPlane = function(world, plane) {
        var planet = world.props.planet;
        var container = world.props.container;
        var scene = world.stage.scene;

        // don't rely on the render loop to fix our numbers.
        scene.updateMatrixWorld();

        container.remove(plane.mesh);

        var newPlaneMatrix = new THREE.Matrix4();

        newPlaneMatrix.getInverse(planet.mesh.matrixWorld);
        newPlaneMatrix.multiply(container.matrixWorld);

        plane.mesh.applyMatrix(newPlaneMatrix);

        planet.mesh.add(plane.mesh);
    };

    return {
        slamStencil: slamStencil,
        slamPlane: slamPlane
    };
});
