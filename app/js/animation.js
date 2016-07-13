var FOO = FOO || {};

FOO.animating = false;

function getDeltaForDirection(direction) {
    var state = {};
    switch(direction) {
    case 'left':
        state = {
            axis: 'y',
            delta: 0 - Math.PI / 2
        };
        break;
    case 'right':
        state = {
            axis: 'y',
            delta: Math.PI / 2
        };
        break;
    case 'up':
        state = {
            axis: 'x',
            delta: 0 - Math.PI / 2
        };
        break;
    case 'down':
        state = {
            axis: 'x',
            delta: Math.PI / 2
        };
        break;
    }
    return state;
}

FOO.move = function(world, direction) {
    if (!FOO.animating) {
        var state = getDeltaForDirection(direction);

        var from = world.props.planet.rotation[state.axis];
        var to = world.props.planet.rotation[state.axis] + state.delta;
        new TWEEN.Tween({pos: from})
            .to({pos: to}, 500)
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
