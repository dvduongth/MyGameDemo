"use strict";

var GUIFactory = cc.Class.extend({
    _className: "GUIFactory",
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
     * @param guiId
     */
    createGUIById: function (guiId) {
        var g = null;
        switch (guiId) {
            case GUI_ID.LOADING:
                g = new GuiLoading();
                break;

            default:
                LogUtils.getInstance().error([this.getClassName(), "createGUIById with id undefined", guiId]);
                return null;
        }
        return g;
    }
});