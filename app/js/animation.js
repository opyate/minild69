var FOO = FOO || {};

FOO.animating = false;

FOO.move = function(world, direction) {
    if (!FOO.animating) {
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
                FOO.animating = true;
            })
            .onUpdate(function() {
                world.props.planet.rotation[state.axis] = this.pos;
            })
            .onComplete(function() {
                FOO.animating = false;
            }).start();
    }
};
