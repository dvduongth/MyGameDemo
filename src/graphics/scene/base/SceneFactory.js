"use strict";

var SceneFactory = cc.Class.extend({
    _className: "SceneFactory",
    getClassName: function () {
        return this._className;
    },
    _curSceneId: null,
    ctor: function () {
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    /**
     *
     * @param id
     */
    createSceneById: function (id) {
        var s = null;
        switch (id) {
            case SCENE_ID.LOADING:
                s = new SceneLoading();
                break;
            case SCENE_ID.LOGIN:
                s = new SceneLogin();
                break;
            case SCENE_ID.LOBBY:
                s = new SceneLobby();
                break;
            case SCENE_ID.BATTLE:
                s = new SceneBattle();
                break;
            default:
                LogUtils.getInstance().error([this.getClassName(), "createSceneById with sceneId undefined", id]);
                return null;
        }
        return s;
    },
    createTransition: function (scene, oldScreenId, _currentScreenId) {
        return new cc.TransitionFade(1.0, scene, cc.color(0, 0, 0, 255));
    }
});