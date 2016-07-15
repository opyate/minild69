define([
    'tween',
    'animation',
    'levels'
], function(tween, animation, levels) {

    var CONF = {
        // everything is square, so we'll re-use width.
        width: 200,
        level: {
            // the number of levels after which stencil size and difficulty changes
            threshold: 7,
            initStencilWidth: 3
        }
    };

    var setup = function (world) {

        world.config = CONF;

        // TODO iterate levels based on inputs, completion, &c
        levels.getLevel(1, world);

        loop(world);
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

        world.stage.renderer.render(world.stage.scene, world.stage.camera);
    };


    return {
        setup: setup
    };
});
