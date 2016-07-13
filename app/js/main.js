require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: {
        'vendor/three': {
            exports: 'THREE'
        }
    },
    paths: {
        lodash: 'vendor/lodash/lodash',
        tween: 'vendor/tween'
    }
}, [
    'vendor/three',
    'lodash',
    'tween',
    'base',
    'keyboard',
    'planet'
], function(THREE, _) {


    var world = init();
    animate();

    function init() {
        // things? See http://threejs.org/docs/#Manual/Introduction/Creating_a_scene
        // "...we need three things: A scene, a camera, and a renderer..."
        var things = FOO.init();

        var keyboard = new FOO.KeyboardState();

        var planet = FOO.addPlanet(things.scene, 200);
        return {
            things: things,
            props: {
                planet: planet
            },
            keyboard: keyboard
        };
    }

    var animating = false;

    function newTween(direction) {
        if (!animating) {
            var state = {};
            switch(direction) {
            case 'left':
                state = {
                    axis: 'y',
                    delta: Math.PI / 2
                };
                break;
            case 'right':
                state = {
                    axis: 'y',
                    delta: 0 - Math.PI / 2
                };
                break;
            case 'up':
                state = {
                    axis: 'x',
                    delta: Math.PI / 2
                };
                break;
            case 'down':
                state = {
                    axis: 'x',
                    delta: 0 - Math.PI / 2
                };
                break;
            }


            new TWEEN.Tween({pos: 0})
                .to({pos: state.delta}, 500)
                .onStart(function() {
                    animating = true;
                })
                .onUpdate(function() {
                    world.props.planet.rotation[state.axis] = this.pos;
                })
                .onComplete(function() {
                    animating = false;
                }).start();
        }
    }

    function animate() {

        requestAnimationFrame(animate);

        _.each(['left', 'right', 'up', 'down'], function (direction) {
            if (world.keyboard.pressed(direction)) {
                newTween(direction);
            }
        });
        TWEEN.update();

        world.things.renderer.render(world.things.scene, world.things.camera);
    }

});
