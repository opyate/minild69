var FOO = FOO || {};

function addPlanet(size, pos) {
    size = size || 200;
    pos = pos || 0;
    var geometry = new THREE.BoxGeometry(size, size, size);

    var colors = _.times(6, function() { return new THREE.Color(Math.random() * 0xffffff); });

    for (var i = 0; i < 6; i++) {
        geometry.faces[2 * i].color = colors[i];
        geometry.faces[2 * i + 1].color = colors[i];
    }

    var material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        vertexColors: THREE.FaceColors
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos,0,10);

    return mesh;
};

// TODO move addPlanet to utility module
// TODO add getStencil to get colonisers.
// TODO decouple the stencil/face calculations from the gfx

FOO.addProps = function(scene) {
    var container = new THREE.Object3D();

    var planet = addPlanet();
    container.add(planet);

    // tilt the container
    container.rotateX(Math.PI / 180 * 30);
    container.rotateY(Math.PI / 180 * 30);

    scene.add(container);

    return {
        container: container,
        planet: planet
    };
};
