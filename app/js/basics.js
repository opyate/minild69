define(['controls'], function(controls) {
    var init = function() {
        var scene, camera, renderer;

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.z = 1000;

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);

        return {
            scene: scene,
            camera: camera,
            renderer: renderer
        };
    };

    return {
        getStage: init,
        getKeyboard: function () {
            return new controls.keyboard();
        }
    };
});
