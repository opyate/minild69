define([
    'vendor/three',
    'lodash',
    'basics',
    'props',
    'game'
], function(THREE, _, basics, props, game) {

    var init = function() {
        // set the stage (a scene, a camera, and a renderer...)
        var stage = basics.getStage();

        return {
            stage: stage,
            props: props.addToScene(stage.scene),
            keyboard: basics.getKeyboard()
        };
    };

    return {
        start: function() {
            game.loop(init());
        }
    };
});
