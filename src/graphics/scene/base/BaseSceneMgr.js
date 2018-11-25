'use strict';
var SCENE_ID = new Enum("SCENE_ID");

SCENE_ID.LOADING = SCENE_ID.getNextEnum();
SCENE_ID.LOGIN = SCENE_ID.getNextEnum();
SCENE_ID.LOBBY = SCENE_ID.getNextEnum();
SCENE_ID.BATTLE = SCENE_ID.getNextEnum();

SCENE_ID.toEnumString();//todo test

var BaseSceneMgr = cc.Class.extend({
    _className: "BaseSceneMgr",
    getClassName: function(){
        return this._className;
    },
    ctor: function () {
        this.setMapScene({});
        this.setOldSceneId(-1);
        this.setCurrentSceneId(-1);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },

    setMapScene: function (m) {
        this._mapScene = m;
        LogUtils.getInstance().log([this.getClassName(), "setMapScene success"]);
    },
    getMapScene: function () {
        return this._mapScene;
    },

    setSceneFactory: function (sceneFactory) {
        this._sceneFactory = sceneFactory;
        LogUtils.getInstance().log([this.getClassName(), "setSceneFactory success"]);
    },
    getSceneFactory: function () {
        return this._sceneFactory;
    },

    setCurrentSceneId: function (id) {
        this._currentSceneId = id;
        LogUtils.getInstance().log([this.getClassName(), "setCurrentSceneId", id > -1 ? GUI_ID.toEnumStringByValue(id) : id]);
    },
    getCurrentSceneId: function () {
        return this._currentSceneId;
    },

    /**
     * @param {BaseScene} scene
     * */
    setCurrentScene: function (scene) {
        this._currentScene = scene;
        LogUtils.getInstance().log([this.getClassName(), scene != null ? "setCurrentScene success" : "setCurrentScene null"]);
    },
    getCurrentScene: function () {
        return this._currentScene;
    },

    setOldSceneId: function (id) {
        this._oldSceneId = id;
        LogUtils.getInstance().log([this.getClassName(), "setOldSceneId", id > -1 ? GUI_ID.toEnumStringByValue(id) : id]);
    },
    getOldSceneId: function () {
        return this._oldSceneId;
    },

    isCurrentSceneById: function (id) {
        return this.getCurrentSceneId() === id;
    },
    /**
     *
     * @param {BaseScene} scene
     * @param {int} id
     */
    addScene: function (scene, id) {
        //clear before add
        this.removeScene(id);
        this.getMapScene()[id] = scene;
        LogUtils.getInstance().log([this.getClassName(), "addScene", SCENE_ID.toEnumStringByValue(id), id]);
    },
    removeScene: function (id) {
        if (this.getMapScene()[id] != null) {
            this.getMapScene()[id] = null;
            LogUtils.getInstance().log([this.getClassName(), "removeScene", SCENE_ID.toEnumStringByValue(id), id]);
        }
    },

    /**
     *
     * @param {int} id
     * @returns {Layer}
     */
    getScene: function (id) {
        if (this.getMapScene()[id] != null) {
            return this.getMapScene()[id];
        } else if (this.getSceneFactory() != null) {
            var screen = this.getSceneFactory().createSceneById(id);
            if (screen != null) {
                this.addScene(screen, id);
                return screen;
            }
        }

        LogUtils.getInstance().error([this.getClassName(), "----> NOT FOUND scene id (%d)", id]);
        return null;
    },

    /**
     *
     * @param {int} id
     * @returns {Layer}
     */
    getSceneByIdIfExist: function (id) {
        if (this.getMapScene()[id] != null) {
            return this.getMapScene()[id];
        } else {
            LogUtils.getInstance().error([this.getClassName(), "getSceneByIdIfExist ----> NOT FOUND scene id (%d)", id]);
            return null;
        }
    },

    /**
     * get Layer by id in a scene
     * @param {int} layerId
     * @param {int} id
     * @return {Layer} layer
     */
    getLayerInScene: function (layerId, id) {
        var scene = this.getScene(id);
        if (scene != null) {
            return gv.engine.getLayerMgr().getLayer(scene, layerId);
        } else {
            LogUtils.getInstance().error([this.getClassName(), "getLayerInScene ----> NOT FOUND scene id (%d)", id]);
            return null;
        }
    },

    /**
     *
     * @param id
     */
    viewSceneById: function (id) {
        LogUtils.getInstance().log([this.getClassName(), "call viewSceneById", SCENE_ID.toEnumStringByValue(id), id]);
        if (this.isCurrentSceneById(id)) {
            LogUtils.getInstance().log([this.getClassName(), "viewSceneById return because of during current scene", id]);
            return false;
        }
        this.setOldSceneId(this.getCurrentSceneId());
        if (this.getOldSceneId() !== -1) {
            this.getScene(this.getOldSceneId()).clearScene();
            this.removeScene(this.getOldSceneId());
        }
        this.setCurrentSceneId(id);
        this.viewScene(this.getScene(id));
        LogUtils.getInstance().log([this.getClassName(), "viewSceneById call initScene"]);
        this.getScene(this.getCurrentSceneId()).initScene();
    },

    /**
     *
     * @param {BaseScene} scene
     */
    viewScene: function (scene) {
        LogUtils.getInstance().log([this.getClassName(), "call viewScene"]);
        // check correct "Layer" type
        var isScene = cc.arrayVerifyType([scene], BaseScene);
        if (isScene) {
            // initialize director
            if (this.getOldSceneId() === -1) {
                cc.director.runScene(scene);
            } else {
                var pTransition = this.getSceneFactory().createTransition(scene, this.getOldSceneId(), this.getCurrentSceneId());
                cc.director.runScene(pTransition);
            }
            this.setCurrentScene(scene);
            return true;
        }else {
            LogUtils.getInstance().error([this.getClassName(), "viewScene", "error with type of scene", typeof scene]);
            return false;
        }
    }
});