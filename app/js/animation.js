define([
    'config',
    'tween',
    'calcs',
    'slammer'
], function(config, tween, calcs, slammer) {
    "use strict";

    var isAnimatingCube = false;
    var isAnimatingPlanes = false;

    function getDeltaForDirection(direction) {
        var state = {};
        switch (direction) {
            case 'a': // left
                state = {
                    axis: new THREE.Vector3(0, -1, 0)
                };
                break;
            case 'd': // right
                state = {
                    axis: new THREE.Vector3(0, 1, 0)
                };
                break;
            case 'w': // up
                state = {
                    axis: new THREE.Vector3(-1, 0, 0)
                };
                break;
            case 's': // down
                state = {
                    axis: new THREE.Vector3(1, 0, 0)
                };
                break;
            case 'q': // roll left
                state = {
                    axis: new THREE.Vector3(0, 0, 1)
                };
                break
            case 'e': // roll right
                state = {
                    axis: new THREE.Vector3(0, 0, -1)
                };
                break
        }
        return state;
    }
    // Rotate a mesh around an arbitrary axis in world space
    // From http://stackoverflow.com/a/11060965/51280
    function rotateAroundWorldAxis(mesh, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        rotWorldMatrix.multiply(mesh.matrix);

        mesh.matrix = rotWorldMatrix;
        mesh.rotation.setFromRotationMatrix(mesh.matrix);
    }

    var rotatePlanet = function(world, direction) {
        if (!isAnimatingCube) {
            var state = getDeltaForDirection(direction);

            var previous = 0; // for rotation tweening, not motion tweening
            new tween.Tween({
                    pos: 0
                })
                .to({
                    pos: Math.PI / 2
                }, 200)
                .onStart(function() {
                    isAnimatingCube = true;
                })
                .onUpdate(function() {
                    rotateAroundWorldAxis(world.props.planet.mesh, state.axis, this.pos - previous);
                    previous = this.pos;
                })
                .onComplete(function() {
                    isAnimatingCube = false;
                }).start();
        }
    };

    var slam = function(world) {
        if (!isAnimatingPlanes && !isAnimatingCube && world.level.planes.length > 0) {

            var positions = _.reduce(world.level.planes, function(acc, plane, idx) {
                var z = plane.mesh.position.z;
                var log = calcs.logslider(idx, config.distance, world.level.stencils.numberOfStencils - 1);
                return {
                    start: _.concat(acc.start, z),
                    end: _.concat(acc.end, idx == 0 ? (config.width / 2) + 1 : z - log)
                };
            }, {
                start: [],
                end: []
            });

            var tweenStart = Object.assign({}, positions.start);
            var tweenEnd = Object.assign({}, positions.end);

            new tween.Tween(tweenStart)
                .to(tweenEnd, 200)
                .onStart(function() {
                    isAnimatingPlanes = true;
                })
                .onUpdate(function() {
                    var self = this;
                    _.each(world.level.planes, function(plane, idx) {
                        plane.mesh.position.set(0, 0, self[idx]);
                    });
                })
                .onComplete(function() {
                    isAnimatingPlanes = false;

                    // the plane/stencil to slam into the planet
                    var stencil = _.head(world.level.stencils.stencils);
                    var plane = _.head(world.level.planes);

                    var appliedIdx = 0; //getFrom(world.props.planet.rotation);
                    var rotations = 0; //getFrom(world.props.planet.rotation);

                    // mutate 'appliedStencils'
                    slammer.slamStencil(
                        world.level.stencils.appliedStencils,
                        appliedIdx,
                        stencil,
                        rotations);

                    // mutate the planet to reflect 'appliedStencils'
                    slammer.slamPlane(world, plane);

                    //console.log('slam complete', world);

                    // the first plane/stencil is now used up
                    world.level.planes = _.tail(world.level.planes);
                    world.level.stencils.stencils = _.tail(world.level.stencils.stencils);

                })
                .start();
        }
    };

    return {
        rotatePlanet: rotatePlanet,
        slam: slam
    };
});
