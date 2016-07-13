var FOO = FOO || {};

FOO.addPlanet = function(scene, size, pos) {
    size = size || 200;
    pos = pos || 0;
    var geometry = new THREE.BoxGeometry(size, size, size);
    var material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos,0,10);
    scene.add(mesh);
    return mesh;
};
