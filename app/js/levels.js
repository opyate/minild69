define(['logic'], function (logic) {


    // TODO set up a stencil for each of the faces of the world
    // render the stencil on the stage
    // listen for stencil-related inputs (e.g. slam)

    var first = function(world) {

        console.log('logic', logic);
        console.log('world', world);

        // get stencil
        var stencil = logic.faces.init(3, logic.stencils.checkered);
        console.log('stencil', stencil);
        // draw a plane based on stencil

        var geometry = new THREE.PlaneGeometry(
            world.config.width,
            world.config.width,
            stencil.length,
            stencil.length);

        var visibleMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            side: THREE.DoubleSide} );
        var invisibleMaterial = new THREE.MeshBasicMaterial({
            transparent: true,
            opacity: 0.0,
            side: THREE.DoubleSide
        });
        var materials = [
            visibleMaterial,
            invisibleMaterial
        ];

        var plane = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(materials));
        plane.position.set(0, 0, world.config.width * 2);

        // faces are triangles, but we want squares (i.e. pairs of triangles)
        var squareCount = geometry.faces.length / 2;

        // flatten the stencil from 2-dim array so we can easily index it.
        var flatStencil = _.flatten(stencil);
        for (var i=0; i<squareCount; i++) {
            var j = i * 2;
            geometry.faces[j].materialIndex = flatStencil[i] ? 0 : 1;
            geometry.faces[j + 1].materialIndex = flatStencil[i] ? 0 : 1;
        }

        world.props.container.add(plane);
    };

    return {
        first: first
    };
});
