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
        // set the stage (a scene, a camera, and a renderer...)
        var stage = bstrap.init();

        var keyboard = new input.keyboard();

        var props = stuff.addProps(stage.scene);
        return {
            stage: stage,
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

        world.stage.renderer.render(world.stage.scene, world.stage.camera);
    };

    return {
        start: function() {
            animate(init());
        }
    };
});
