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
    setTileLogicSize: function (s) {
        this._tileLogicSize = s;
    },
    getTileLogicSize: function () {
        return this._tileLogicSize;
    },
    initMap: function () {
        var numCol = this.getNumberTileMapWidth();
        var numRow = this.getNumberTileMapHeight();
        var dw = this.getMapContentSize().width / numCol;
        var dh = this.getMapContentSize().height / numRow;
        var x = 0, y = 0;
        for (var row = 0; row < numRow; ++row) {
            for (var col = 0; col < numCol; ++col) {
                var pos = cc.p(x, y);
                var size = cc.size(dw, dh);
                var worldPos = this.getMapBackgroundObj().convertToWorldSpace(pos);
                var idxPoint = cc.p(row, col);
                var mapIdxPoint = this.convertTileIndexPointToMapIndexPoint(idxPoint);
                if(!this.getTileLogicSize()){
                    this.setTileLogicSize(size);
                }
                var tileLogic = new TileLogic();
                tileLogic.setTileIndexPoint(idxPoint);
                tileLogic.setTileMapIndexPoint(mapIdxPoint);
                tileLogic.setTileTypeValue(Setting.MAP[mapIdxPoint.x][mapIdxPoint.y]);
                tileLogic.setTileSize(size);
                tileLogic.setTileRect(cc.rect(pos.x, pos.y, size.width, size.height));
                tileLogic.setTileLocalPosition(pos);
                tileLogic.setTileWorldPosition(worldPos);
                tileLogic.setTileRectWorld(cc.rect(worldPos.x, worldPos.y, size.width, size.height));
                x += dw;
                this.getTileMatrix()[row][col] = tileLogic;
            }
            x = 0;
            y += dh;
        }
        LogUtils.getInstance().log([this.getClassName(), "init map success"]);
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
        for (var i = 0; i < Setting.MAP_H; ++i) {
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
    },
    getTileLogicStartByWorldPosition: function (worldPos, w, h) {
        var m = this.getTileMatrix();
        for (var row = 0; row < Setting.MAP_H; ++row) {
            for (var col = 0; col < Setting.MAP_W; ++col) {
                var tileIdx = this.convertMapIndexPointToStartTileIndexPoint(cc.p(row, col));
                var tileLogic = m[tileIdx.x][tileIdx.y];
                if (tileLogic != null) {
                    var tWorldPos = tileLogic.getTileWorldPosition();
                    var tSize = tileLogic.getTileSize();
                    var rect = cc.rect(tWorldPos.x, tWorldPos.y, tSize.width * w, tSize.height * h);
                    var isCorrect = cc.rectContainsPoint(rect, worldPos);
                    if (isCorrect) {
                        return tileLogic;
                    }
                } else {
                    LogUtils.getInstance().error('OH NO no tileLogic is null ' + tileIdx.x + " " + tileIdx.y);
                }
            }
        }
        return null;
    },
    updateGameObjectIDForTileLogic: function (id, obj) {
        var worldPos = obj.getWorldPosition();
        var h, w;
        if(obj.getGameObjectString() == STRING_BASE) {
            h = Setting.GAME_OBJECT_SIZE_H * 2;
            w = Setting.GAME_OBJECT_SIZE_W * 2;
        }else{
            h = Setting.GAME_OBJECT_SIZE_H;
            w = Setting.GAME_OBJECT_SIZE_W;
        }
        var startTileLogic = this.getTileLogicStartByWorldPosition(worldPos, w, h);
        if(startTileLogic != null) {
            //LogUtils.getInstance().log([this.getClassName(), "YEAH YEAH tileLogic add ID", id]);
            var tWorldPos = startTileLogic.getTileWorldPosition();
            var tSize = startTileLogic.getTileSize();
            var centerPos = cc.p(tWorldPos.x + w * tSize.width / 2, tWorldPos.y + h * tSize.height / 2);
            obj.updateLocationByWorldPosition(centerPos);
            var m = this.getTileMatrix();
            var tileStartIdx = startTileLogic.getTileIndexPoint();
            for(var i = 0; i < h; ++i) {
                for(var j = 0; j < w; ++j) {
                    var curTile = m[tileStartIdx.x + i][tileStartIdx.y + j];
                    if(curTile != null) {
                        //LogUtils.getInstance().log([this.getClassName(), "updateGameObjectIDForTileLogic HERE", tileStartIdx.x + i, tileStartIdx.y + j]);
                        curTile.pushGameObjectIDOnTile(id);
                        obj.pushTileLogicForGameObject(curTile);
                    }
                }
            }
        }
    }
});