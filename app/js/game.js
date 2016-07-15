define([
    'tween',
    'animation',
    'levels'
], function(tween, animation, levels) {

    var setup = function (world) {
        world.stage.background.then(function (result) {

            world.stage.background = result;

            // TODO iterate levels based on inputs, completion, &c
            levels.getLevel(1, world);

            loop(world);
        }, function (err) {
            console.err('Game loop aborted.');
        });
    };

    var loop = function (world) {
        requestAnimationFrame(function() {
            loop(world);
        });

        // rotate the world
        _.each(['a', 'd', 'w', 's', 'q', 'e'], function (direction) {
            if (world.keyboard.pressed(direction)) {
                animation.move(world, direction);
                return false; // break
            }
        });

        // slam the colonisers
        if (world.keyboard.pressed('space')) {
            console.log('slam!');
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
