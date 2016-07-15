define([
    'logic',
    'config',
    'calcs',
], function(logic, config, calcs) {

    // our planet is a cube, hence 6 faces, hence 6 stencils required.
    // difficulty can increase along these axes:
    // - levelNumber
    // - stencil difficulty
    // - stencil size (once the size increases, use the easier stencils again)
    // - stencil rotation (this can be binary random, i.e. rotate or not)
    function getStencils(levelNumber, levelConfig) {
        var stencilParams = calcs.params(
            levelNumber,
            logic.stencils.length,
            config.level.initStencilWidth
        );

        var stencils = [];
        var stencilsUsed = [];
        var stencilIndices = [];

        while (stencils.length < 6) {
            // for each level up to the number of stencils available, bias
            // towards the level number, then cycle
            var randomStencilIndex = calcs.rand(
                0,
                logic.stencils.length,
                stencilParams.idx);

            // if we're about to pick the last stencil,
            // and one of the chosen stencils is 'all', then
            // just pick 'all' again.
            // (Otherwise the last stencil could be notAll, and the
            // code below will add notAll.inv which goes over 6)
            if (stencils.length == 5 && _.includes(stencilsUsed, 'all')) {
                randomStencilIndex = 0;
            }

            stencilIndices.push(randomStencilIndex);
            var stencilObj = logic.stencils[randomStencilIndex];

            stencilsUsed.push(stencilObj.name);
            var stencil = logic.faces.init(stencilParams.width, stencilObj.fn);
            stencils.push(stencil);

            // unless this stencil is 'all', also add its inverse.
            // (this means a level can be perfectly completed)
            if (stencilObj.name !== 'all') {
                var inverse = logic.faces.toggle(stencil);
                stencilsUsed.push(stencilObj.name + '.inv');
                stencils.push(inverse);
            }
        }

        // most of the below is for debugging, and the caller will mostly
        // be interested in 'stencils'
        return {
            level: levelNumber,
            stencilWidth: stencilParams.width,
            stencils: stencils,
            noOfStencilsAvailable: logic.stencils.length,
            stencilIndices: stencilIndices,
            stencilsUsed: stencilsUsed
        };
    }

    var level = function(levelNumber, world) {
        // get stencils
        var stencils = getStencils(levelNumber, config.level);

        var planes = _.map(stencils.stencils, function(stencil, idx) {
            var plane = getPlaneFromStencil(idx, stencil, config.width);
            world.props.container.add(plane);
            return plane;
        });

        return {
            planes: planes,
            stencils: stencils
        };
    };

    // reusable materials
    var visibleMaterial = new THREE.MeshBasicMaterial({
        color: config.stencilColour,
        side: THREE.DoubleSide
    });
    var invisibleMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide
    });
    var materials = [
        visibleMaterial,
        invisibleMaterial
    ];

    function getPlaneFromStencil(idx, stencil, width) {
        // draw a plane based on stencil
        var geometry = new THREE.PlaneGeometry(
            width,
            width,
            stencil.length,
            stencil.length);

        var plane = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        var z = (config.distance - calcs.logslider(idx, config.distance)) + width * 2;
        plane.position.set(0, 0, z);

        // faces are triangles, but we want squares (i.e. pairs of triangles)
        var squareCount = geometry.faces.length / 2;

        // flatten the stencil from 2-dim array so we can easily index it.
        var flatStencil = _.flatten(stencil);
        for (var i = 0; i < squareCount; i++) {
            var j = i * 2;
            geometry.faces[j].materialIndex = flatStencil[i] ? 0 : 1;
            geometry.faces[j + 1].materialIndex = flatStencil[i] ? 0 : 1;
        }

        return plane;
    }

    return {
        getLevel: level
    };
});
