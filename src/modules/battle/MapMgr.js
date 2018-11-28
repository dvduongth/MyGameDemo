"use strict";
/**
 * MapMgr manage map game
 * */
var MapMgr = cc.Class.extend({
    _className: "MapMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },

});