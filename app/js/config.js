define([], function () {

    return {
        // everything is square, so we'll re-use width.
        width: 200,
        // how far the stencils are from the planet
        distance: 400,
        level: {
            // the number of levels after which stencil size and difficulty changes
            threshold: 7,
            initStencilWidth: 3
        }
    };
});
