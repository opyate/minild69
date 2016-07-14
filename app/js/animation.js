define([], function() {
    var self = this;
    self.animating = false;

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

    var move = function(world, direction) {
        if (!self.animating) {
            var obj = world.props.planet;
            var state = getDeltaForDirection(direction);

            var previous = 0; // for rotation tweening, not motion tweening
            new TWEEN.Tween({
                    pos: 0
                })
                .to({
                    pos: Math.PI / 2
                }, 200)
                .onStart(function() {
                    self.animating = true;
                })
                .onUpdate(function() {
                    rotateAroundWorldAxis(obj, state.axis, this.pos - previous);
                    previous = this.pos;
                })
                .onComplete(function() {
                    self.animating = false;
                }).start();
        }
    };

    return {
        move: move
    };
});
