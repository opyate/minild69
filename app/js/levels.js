define(['logic'], function (logic) {


    // TODO set up a stencil for each of the faces of the world
    // render the stencil on the stage
    // listen for stencil-related inputs (e.g. slam)

    var first = function(world) {
        console.log(stencil);
        console.log(logic);
        console.log('levels', world);

        var container = world.props.container;

        // get stencil
        var stencil = logic.faces.init(5, logic.stencils.checkered);

        // draw a plane based on stencil

    };

    return {
        first: first
    };
});
