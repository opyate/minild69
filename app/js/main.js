require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: {
        'vendor/three': {
            exports: 'THREE'
        }
    },
    paths: {
        lodash: 'vendor/lodash/lodash'
    }
}, [
    'vendor/three',
    'lodash',
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


    function animate() {

        requestAnimationFrame(animate);

        if(world.keyboard.pressed("a")) {
            world.props.planet.rotation.x += 0.005;
            world.props.planet.rotation.y += 0.01;
        }

        world.things.renderer.render(world.things.scene, world.things.camera);
    }

});
