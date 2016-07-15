define([], function () {

    return {
        background: 'img/stars2.jpg',
        // everything is square, so we'll re-use width.
        width: 200,
        // how far the stencils are from the planet
        distance: 400,
        stencilColour: 0xffff00,
        level: {
            // the number of levels after which stencil size and difficulty changes
            threshold: 7,
            initStencilWidth: 3
        }
    };
});
