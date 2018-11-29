"use strict";
/**
 * TileLogic
 * */
var TileLogic = cc.Class.extend({
    _className: "TileLogic",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setTileMatrix([]);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setTileLocalPosition: function (m) {
        this._tileLocalPosition = m;
    },
    getTileLocalPosition: function () {
        return this._tileLocalPosition;
    },
    setTileWorldPosition: function (m) {
        this._tileWorldPosition = m;
    },
    getTileWorldPosition: function () {
        return this._tileWorldPosition;
    },
});