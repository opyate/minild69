define(['tween', 'animation'], function(tween, animation) {

    var loop = function (world) {
        requestAnimationFrame(function() {
            loop(world);
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
        loop: loop
    };
});
