define([
    'vendor/three',
    'lodash',
    'tween',
    'base',
    'keyboard',
    'stuff',
    'animation'
], function(THREE, _, tw, bstrap, input, stuff, anim) {

    var init = function() {
        // things? See http://threejs.org/docs/#Manual/Introduction/Creating_a_scene
        // "...we need three *things*: A scene, a camera, and a renderer..."
        var things = bstrap.init();

        var keyboard = new input.keyboard();

        var props = stuff.addProps(things.scene);
        return {
            things: things,
            props: props,
            keyboard: keyboard
        };
    };

    var animate = function (world) {
        requestAnimationFrame(function() {
            animate(world);
        });

        _.each(['a', 'd', 'w', 's', 'q', 'e'], function (direction) {
            if (world.keyboard.pressed(direction)) {
                anim.move(world, direction);
                return false; // break
            }
        });
        TWEEN.update();

        world.things.renderer.render(world.things.scene, world.things.camera);
    };

    return {
        start: function() {
            animate(init());
        }
    };
});
