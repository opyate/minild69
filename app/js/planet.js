var FOO = FOO || {};

FOO.addPlanet = function(scene, size, pos) {
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
    scene.add(mesh);
    return mesh;
};
