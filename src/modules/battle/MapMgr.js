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
        this.setTileMatrix([]);
        var len = this.getNumberTileMapHeight();
        for (var i = 0; i < len; ++i) {
            this.getTileMatrix()[i] = [];
        }
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    getNumberTileMapWidth: function () {
        return Setting.MAP_W * Setting.GAME_OBJECT_SIZE_W;
    },
    getNumberTileMapHeight: function () {
        return Setting.MAP_H * Setting.GAME_OBJECT_SIZE_H;
    },

    setTileMatrix: function (m) {
        this._tileMatrix = m;
    },
    getTileMatrix: function () {
        return this._tileMatrix;
    },
    setMapBackgroundObj: function (m) {
        this._mapBackgroundObj = m;
    },
    getMapBackgroundObj: function () {
        return this._mapBackgroundObj;
    },
    getMapContentSize: function () {
        return this.getMapBackgroundObj().getContentSize();
    },
    initMap: function () {
        var w = this.getNumberTileMapWidth();
        var h = this.getNumberTileMapHeight();
        var dw = this.getMapContentSize().width / w;
        var dh = this.getMapContentSize().height / h;
        var x = 0, y = 0;
        for (var i = 0; i < w; ++i) {
            for (var j = 0; j < h; ++j) {
                var tileLogic = new TileLogic();
                var pos = cc.p(x, y);
                var size = cc.size(dw, dh);
                var worldPos = this.getMapBackgroundObj().convertToWorldSpace(pos);
                var idxPoint = cc.p(i, j);
                var mapIdxPoint = this.convertTileIndexPointToMapIndexPoint(idxPoint);
                tileLogic.setTileIndexPoint(idxPoint);
                tileLogic.setTileMapIndexPoint(mapIdxPoint);
                tileLogic.setTileTypeValue(Setting.MAP[mapIdxPoint.x][mapIdxPoint.y]);
                tileLogic.setTileSize(size);
                tileLogic.setTileRect(cc.rect(pos.x, pos.y, size.width, size.height));
                tileLogic.setTileLocalPosition(pos);
                tileLogic.setTileWorldPosition(worldPos);
                tileLogic.setTileRectWorld(cc.rect(worldPos.x, worldPos.y, size.width, size.height));
                x += dw;
                this.getTileMatrix()[i][j] = tileLogic;
            }
            x = 0;
            y += dh;
        }
        LogUtils.getInstance().log([this.getClassName(), "init map success"]);
        this.mapToString();//todo test
    },
    convertTileIndexPointToMapIndexPoint: function (p) {
        return cc.p(Math.floor(p.x / Setting.GAME_OBJECT_SIZE_W), Math.floor(p.y / Setting.GAME_OBJECT_SIZE_H));
    },
    convertMapIndexPointToStartTileIndexPoint: function (p) {
        return cc.p(p.x * Setting.GAME_OBJECT_SIZE_W, p.y * Setting.GAME_OBJECT_SIZE_H);
    },
    mapToString: function () {
        LogUtils.getInstance().log([this.getClassName(), "mapToString"]);
        var m = this.getTileMatrix();
        for (var i = 0; i < Setting.MAP_W; ++i) {
            LogUtils.getInstance().log("-----------------------------------------------");
            var arr = [];
            for (var j = 0; j < Setting.MAP_W; ++j) {
                var tileIdx = this.convertMapIndexPointToStartTileIndexPoint(cc.p(i, j));
                var t = m[tileIdx.x][tileIdx.y];
                if (t != null) {
                    arr.push(t.toString());
                } else {
                    LogUtils.getInstance().log('oh no ' + tileIdx.x + " " + tileIdx.y);
                }
            }
            LogUtils.getInstance().log(arr.join("|"));
        }
        LogUtils.getInstance().log("-----------------------------------------------");
    }
});