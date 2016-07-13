require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim: {
        'vendor/three': {
            exports: 'THREE'
        }
    },
    paths: {
        lodash: 'vendor/lodash/lodash'
    }
}, [
    'vendor/three',
    'lodash'
], function(THREE, _) {

    var scene, camera, renderer;
    var meshes = [];

    init();
    animate();

    function r() {
        return Math.floor(Math.random() * 1000);
    }

    function m(size, pos) {
        size = size || r();
        pos = pos || 10;
        var geometry = new THREE.BoxGeometry(size, size, size);
        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(pos,0,10);
        meshes.push(mesh);
        scene.add(mesh);
    }

    function init() {

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        _.times(3, function(idx) {
            m(200, 500 * (idx - 1));
        });


        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

    }

    function animate() {

        requestAnimationFrame(animate);

        _.each(meshes, function (mesh) {
            mesh.rotation.x += 0.005;
            mesh.rotation.y += 0.01;
        });

        renderer.render(scene, camera);

    }

});
