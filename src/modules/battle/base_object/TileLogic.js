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
        this.setListIDOnTile([]);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setListIDOnTile: function (m) {
        this._listIDOnTile = m;
    },
    getListIDOnTile: function () {
        return this._listIDOnTile;
    },
    setTileSize: function (m) {
        this._tileSize = m;
    },
    getTileSize: function () {
        return this._tileSize;
    },
    setTileRect: function (m) {
        this._tileRect = m;
    },
    getTileRect: function () {
        return this._tileRect;
    },
    setTileRectWorld: function (m) {
        this._tileRectWorld = m;
    },
    getTileRectWorld: function () {
        return this._tileRectWorld;
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
    setTileIndexPoint: function (m) {
        this._tileIndexPoint = m;
    },
    getTileIndexPoint: function () {
        return this._tileIndexPoint;
    },
    setTileMapIndexPoint: function (m) {
        this._tileMapIndexPoint = m;
    },
    getTileMapIndexPoint: function () {
        return this._tileMapIndexPoint;
    },
    setTileTypeValue: function (m) {
        this._tileTypeValue = m;
    },
    getTileTypeValue: function () {
        return this._tileTypeValue;
    },
});