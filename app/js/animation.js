define([
    'config',
    'tween',
    'calcs'
], function(config, tween, calcs) {
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
                var lsPos = calcs.logslider(idx, config.distance);
                var z = (config.distance - calcs.logslider(idx + 1, config.distance)) + config.width * 2;

                var pos;
                if (idx === world.level.planes.length - 1) {
                    pos = 101;
                } else {
                    pos = z;
                }
                new tween.Tween({
                        pos: plane.position.z
                    })
                    .to({
                        pos: pos
                    }, 100)
                    .onStart(function() {
                        api.isAnimatingPlanes = true;
                    })
                    .onUpdate(function() {
                        plane.position.set(0, 0, this.pos);
                    })
                    .onComplete(function() {
                        api.isAnimatingPlanes = false;
                    }).start();

            });
        }
    };

    // these functions will be called many times from the
    // game loop, hence the is* flags.
    api.moveCube = moveCube;
    api.slam = slam;
    return api;
});
