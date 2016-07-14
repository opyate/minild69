define([
    'vendor/three',
    'lodash',
    'tween',
    'basics',
    'props',
    'animation'
], function(THREE, _, tween, basics, props, animation) {

    var init = function() {
        // set the stage (a scene, a camera, and a renderer...)
        var stage = basics.getStage();

        return {
            stage: stage,
            props: props.addToScene(stage.scene),
            keyboard: basics.getKeyboard()
        };
    };

    var animate = function (world) {
        requestAnimationFrame(function() {
            animate(world);
        });

        _.each(['a', 'd', 'w', 's', 'q', 'e'], function (direction) {
            if (world.keyboard.pressed(direction)) {
                animation.move(world, direction);
                return false; // break
            }
        });
        tween.update();

        world.stage.renderer.render(world.stage.scene, world.stage.camera);
    };

    return {
        start: function() {
            animate(init());
        }
    };
});
