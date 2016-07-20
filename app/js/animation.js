define([
    'config',
    'tween',
    'calcs',
    'slammer'
], function(config, tween, calcs, slammer) {
    "use strict";

    var api = {};
    api.isAnimatingCube = false;
    api.isAnimatingPlanes = false;

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
    // Rotate an object around an arbitrary axis in world space
    // From http://stackoverflow.com/a/11060965/51280
    function rotateAroundWorldAxis(object, axis, radians) {
        var rotWorldMatrix = new THREE.Matrix4();
        rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        rotWorldMatrix.multiply(object.matrix);

        object.matrix = rotWorldMatrix;
        object.rotation.setFromRotationMatrix(object.matrix);
    }

    var moveCube = function(world, direction) {
        if (!api.isAnimatingCube) {
            var obj = world.props.planet;
            var state = getDeltaForDirection(direction);

            var previous = 0; // for rotation tweening, not motion tweening
            new tween.Tween({
                    pos: 0
                })
                .to({
                    pos: Math.PI / 2
                }, 200)
                .onStart(function() {
                    api.isAnimatingCube = true;
                })
                .onUpdate(function() {
                    rotateAroundWorldAxis(obj, state.axis, this.pos - previous);
                    previous = this.pos;
                })
                .onComplete(function() {
                    api.isAnimatingCube = false;
                }).start();
        }
    };

    var slam = function(world) {
        if (!api.isAnimatingPlanes) {
            _.each(world.level.planes, function(plane, idx) {
                var log = calcs.logslider(idx, config.distance, world.level.stencils.numberOfStencils - 1);

                var pos;
                if (idx === 0) {
                    // the first plane gets rendered a pixel above
                    // the cube face, to look like it's slamming into it.
                    pos = 101;
                } else {
                    pos = plane.position.z - log;
                }

                new tween.Tween({
                        pos: plane.position.z
                    })
                    .to({
                        pos: pos
                    }, 200)
                    .onStart(function() {
                        api.isAnimatingPlanes = true;
                    })
                    .onUpdate(function() {
                        plane.position.set(0, 0, this.pos);
                    })
                    .onComplete(function() {
                        api.isAnimatingPlanes = false;

                        // if this is the last plane being iterated
                        // (although, this might be a bug, because the last plane
                        // tween won't necessarily 'complete' last)
                        // Regardless, we want the below block to only
                        // run once.
                        if (idx == world.level.planes.length - 1) {
                            // the plane/stencil to slam into the planet
                            var stencil = _.head(world.level.stencils.stencils);
                            var plane = _.head(world.level.planes);

                            var appliedIdx = 0;//getFrom(world.props.planet.rotation);
                            var rotations = 0;//getFrom(world.props.planet.rotation);

                            // mutate 'appliedStencils'
                            slammer.slamStencil(
                                world.level.stencils.appliedStencils,
                                appliedIdx,
                                stencil,
                                rotations);

                            // mutate the planet to reflect 'appliedStencils'
                            slammer.slamPlane(world.props.planet, plane);

                            console.log('slam complete', world);

                            world.level.planes = _.tail(world.level.planes);
                            world.level.stencils.stencils = _.tail(world.level.stencils.stencils);
                        }
                    })
                    .start();

            });
        }
    };

    // these functions will be called many times from the
    // game loop, hence the is* flags.
    api.moveCube = moveCube;
    api.slam = slam;
    return api;
});
