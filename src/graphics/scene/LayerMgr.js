'use strict';
var LAYER_ID = new Enum("LAYER_ID");
LAYER_ID.BACKGROUND = LAYER_ID.getNextEnum();
LAYER_ID.GUI = LAYER_ID.getNextEnum();
LAYER_ID.POPUP = LAYER_ID.getNextEnum();
LAYER_ID.LOADING = LAYER_ID.getNextEnum();
LAYER_ID.EFFECT = LAYER_ID.getNextEnum();
LAYER_ID.CURSOR = LAYER_ID.getNextEnum();

LAYER_ID.toEnumString();//todo show log

var GUI_ID = new Enum("GUI_ID");

GUI_ID.LOADING = GUI_ID.getNextEnum();

GUI_ID.toEnumString();//todo show string


var LayerMgr = cc.Class.extend({
    _className: "LayerMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        //todo something default here
        this.setMapGUI({});
        this.setCurrentGUI(null);
        this.setCurrentGUIId(-1);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    createLayers: function (parent) {
        LogUtils.getInstance().log([this.getClassName(), "call createLayers"]);
        if (parent === undefined) {
            parent = gv.engine.getSceneMgr().getCurrentScene();
        }
        parent._layerMap = {};
        this.addLayer(parent, LAYER_ID.BACKGROUND);
        this.addLayer(parent, LAYER_ID.GUI);
        this.addLayer(parent, LAYER_ID.POPUP);
        this.addLayer(parent, LAYER_ID.LOADING);
        this.addLayer(parent, LAYER_ID.EFFECT);
        this.addLayer(parent, LAYER_ID.CURSOR);
    },
    addLayer: function (parent, layerId) {
        //clear before add
        if (this.getLayer(parent, layerId) != null) {
            this.getLayer(parent, layerId).removeFromParent();
        }
        LogUtils.getInstance().log([this.getClassName(), parent.getClassName !== undefined ? parent.getClassName() : "unknown", "addLayer", layerId]);
        var layer = new cc.Layer();
        layer.setContentSize(gv.WIN_SIZE);
        layer.setAnchorPoint(0, 0);
        layer.setPosition(0, 0);
        parent._layerMap[layerId] = layer;
        parent.addChild(layer, layerId);
    },
    getLayer: function (parent, layerId) {
        if (parent._layerMap != null && parent._layerMap[layerId] != null) {
            return parent._layerMap[layerId];
        }
        return null;
    },
    getLayerById: function (layerId) {
        switch (layerId) {
            case LAYER_ID.BACKGROUND:
            case LAYER_ID.GUI:
            case LAYER_ID.POPUP:
            case LAYER_ID.LOADING:
            case LAYER_ID.EFFECT:
            case LAYER_ID.CURSOR:
                var curScene = gv.engine.getSceneMgr().getCurrentScene();
                var layer = this.getLayer(curScene, layerId);
                if (layer != null) {
                    return layer;
                } else {
                    LogUtils.getInstance().error([this.getClassName(), "getLayerById not yet create layer for current scene"]);
                    this.createLayers(curScene);
                    return this.getLayer(curScene, layerId);
                }
                break;
            default :
                LogUtils.getInstance().error([this.getClassName(), "getLayerById with unknown id", layerId]);
                return null;
        }
    },

    setGUIFactory: function (factory) {
        this._guiFactory = factory;
        LogUtils.getInstance().log([this.getClassName(), "setGUIFactory success"]);
    },
    getGUIFactory: function () {
        return this._guiFactory;
    },

    setCurrentGUIId: function (id) {
        this._currentGUIId = id;
        LogUtils.getInstance().log([this.getClassName(), "setCurrentGUIId", id > -1 ? GUI_ID.toEnumStringByValue(id) : id]);
    },
    getCurrentGUIId: function () {
        return this._currentGUIId;
    },

    setCurrentGUI: function (gui) {
        this._currentGUI = gui;
        LogUtils.getInstance().log([this.getClassName(), gui != null ? "setCurrentGUI success" : "setCurrentGUI null"]);
    },
    getCurrentGUI: function () {
        return this._currentGUI;
    },

    setMapGUI: function (m) {
        this._mapGUI = m;
        LogUtils.getInstance().log([this.getClassName(), "setMapGUI success"]);
    },
    getMapGUI: function () {
        return this._mapGUI;
    },

    isCurrentGUIById: function (id) {
        return this.getCurrentGUIId() === id;
    },
    /**
     * @param id
     * @param parent
     */
    viewGUIById: function (id, parent) {
        LogUtils.getInstance().log([this.getClassName(), "call viewGUIById", id, parent !== undefined]);
        if(parent == null){
            LogUtils.getInstance().log([this.getClassName(), "call viewGUIById with default parent", GUI_ID.toEnumStringByValue(id), id]);
            parent = this.getLayerById(LAYER_ID.GUI);
        }
        LogUtils.getInstance().log([this.getClassName(), "call viewGUIById", GUI_ID.toEnumStringByValue(id), id]);
        if (this.isCurrentGUIById(id)) {
            LogUtils.getInstance().log([this.getClassName(), "viewGUIById return because of during current GUI", id]);
            return false;
        }
        this.setCurrentGUIId(id);
        this.viewGUI(this.getGUI(id), parent);
        LogUtils.getInstance().log([this.getClassName(), "viewGUIById call initGUI"]);
        this.getGUI(id).initGUI();
    },
    getGUI: function (id) {
        if (this.getMapGUI()[id] != null) {
            return this.getMapGUI()[id];
        } else if (this.getGUIFactory() != null) {
            var gui = this.getGUIFactory().createGUIById(id);
            if (gui != null) {
                this.addGUI(gui, id);
                return gui;
            }
        }

        LogUtils.getInstance().error([this.getClassName(), "----> NOT FOUND GUI id (%d)", id]);
        return null;
    },
    addGUI: function (gui, id) {
        //remove before add
        this.removeGUI(id);
        this.getMapGUI()[id] = gui;
        LogUtils.getInstance().log([this.getClassName(), "addGUI", GUI_ID.toEnumStringByValue(id), id]);

    },
    removeGUI: function (id) {
        if (this.getMapGUI()[id] != null) {
            this.getMapGUI()[id].destroy();
            this.getMapGUI()[id] = null;
            LogUtils.getInstance().log([this.getClassName(), "removeGUI", GUI_ID.toEnumStringByValue(id), id]);
        }
    },
    viewGUI: function (gui, parent) {
        LogUtils.getInstance().log([this.getClassName(), "call viewGUI"]);
        // check correct "Layer" type
        var isGUI = cc.arrayVerifyType([gui], BaseGUI);
        if (isGUI) {
            // initialize director
            parent.addChild(gui);
            this.setCurrentGUI(gui);
            return true;
        } else {
            LogUtils.getInstance().error([this.getClassName(), "viewGUI", "error with type of GUI", typeof gui]);
            return false;
        }
    },
    getGUIByIdIfExist: function (id) {
        if (this.getMapGUI()[id] != null) {
            LogUtils.getInstance().log([this.getClassName(), "getGUIByIdIfExist existed id", GUI_ID.toEnumStringByValue(id)]);
            return this.getMapGUI()[id];
        } else {
            LogUtils.getInstance().error([this.getClassName(), "getGUIByIdIfExist ----> NOT FOUND GUI id (%d)", id]);
            return null;
        }
    }
});