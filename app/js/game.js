define([
    'tween',
    'animation',
    'levels'
], function(tween, animation, levels) {
    "use strict";

    var setup = function (world) {
        world.stage.background.then(function (result) {

            world.stage.background = result;

            loop(world);
        }, function (err) {
            console.error('Game loop aborted.');
        });
    };

    var loop = function (world) {
        requestAnimationFrame(function() {
            loop(world);
        });

        // load level
        if (!world.level) {
            // TODO iterate levels based on inputs, completion, &c
            var level = levels.getLevel(0, world);
            world.level = level;
            console.log(
                'LEVEL',
                world.level.stencils.level,
                world.level.stencils.stencilsUsed
            );
        }

        // rotate the world
        _.each(['a', 'd', 'w', 's', 'q', 'e'], function (direction) {
            if (world.keyboard.pressed(direction)) {
                animation.moveCube(world, direction);
                return false; // break
            }
        });

        // slam the colonisers
        if (world.keyboard.pressed('space')) {
            animation.slam(world);
        }
        tween.update();

        world.stage.renderer.autoClear = false;
        world.stage.renderer.clear();
        world.stage.renderer.render(
            world.stage.background.scene,
            world.stage.background.camera
        );
        world.stage.renderer.render(world.stage.scene, world.stage.camera);
    };


    return {
        setup: setup
    };
});
