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

            // set the level number
            if (!('progress' in world)) {
                world.progress = {
                    levelNumber: 0
                };
            } else {
                ++world.progress.levelNumber;
            }

            var level = levels.getLevel(world);
            world.level = level;
            console.log(
                'LEVEL',
                world.level.stencils.level,
                world.level.stencils.debug.stencilsUsed
            );
        }

        _.each(['a', 'd', 'w', 's', 'q', 'e', 'space'], function (direction) {
            if (world.keyboard.pressed(direction)) {
                if (direction === 'space') {
                    // slam the colonisers
                    animation.slam(world);
                } else {
                    // rotate the world
                    animation.rotatePlanet(world, direction);
                }
                return false; // break
            }
        });

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
