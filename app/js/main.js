requirejs.config({
    baseUrl: 'js',
    shim: {
        'vendor/three': {
            exports: 'THREE'
        }
    },
    paths: {
        lodash: 'vendor/lodash/lodash',
        tween: 'vendor/tween'
    }
});
requirejs(['app'], function(App) {
    App.start();
});
