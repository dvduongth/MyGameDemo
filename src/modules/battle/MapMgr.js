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
        var len = this.getNumberTileMapVertical();
        for (var i = 0; i < len; ++i) {
            this.getTileMatrix()[i] = [];
        }
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    getNumberTileMapHorizontal: function () {
        return Setting.MAP_W * Setting.GAME_OBJECT_SIZE;
    },
    getNumberTileMapVertical: function () {
        return Setting.MAP_H * Setting.GAME_OBJECT_SIZE;
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
    setOldCCSPosition: function (obj) {
        if(!obj){
            LogUtils.getInstance().error([this.getClassName(), "setOldCCSValues obj null"]);
        }
        if(!obj["_oldCCSPos"]){
            obj["_oldCCSPos"] = obj.getPosition();
        }
    },
    getOldCCSPosition: function (obj) {
        if(!obj["_oldCCSPos"]){
            this.setOldCCSPosition(obj);
        }
        return obj["_oldCCSPos"];
    },
    setJoystickDirection: function (d) {
        this._joystickDirection = d;
    },
    getJoystickDirection: function () {
        return this._joystickDirection;
    },
    setJoystickDirectionArrowCurrentPosition: function (d) {
        this._joystickDirectionArrowCurrentPosition = d;
    },
    getJoystickDirectionArrowCurrentPosition: function () {
        return this._joystickDirectionArrowCurrentPosition;
    },
    initMap: function () {
        if(this._initMapDone){
            return false;
        }
        this._initMapDone = true;
        var numCol = this.getNumberTileMapHorizontal();
        var numRow = this.getNumberTileMapVertical();
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
    cleanMap: function () {
        var numCol = this.getNumberTileMapHorizontal();
        var numRow = this.getNumberTileMapVertical();
        for (var row = 0; row < numRow; ++row) {
            for (var col = 0; col < numCol; ++col) {
                var tileLogic = this.getTileMatrix()[row][col];
                tileLogic.removeAllGameObjectIDOnTile();
            }
        }
        LogUtils.getInstance().log([this.getClassName(), "cleanMap success"]);
    },
    convertTileIndexPointToMapIndexPoint: function (p) {
        return cc.p(Math.floor(p.x / Setting.GAME_OBJECT_SIZE), Math.floor(p.y / Setting.GAME_OBJECT_SIZE));
    },
    convertMapIndexPointToStartTileIndexPoint: function (p) {
        return cc.p(p.x * Setting.GAME_OBJECT_SIZE, p.y * Setting.GAME_OBJECT_SIZE);
    },
    mapToString: function () {
        LogUtils.getInstance().log([this.getClassName(), "mapToString"]);
        var m = this.getTileMatrix();
        for (var row = 0; row < Setting.MAP_H; ++row) {
            LogUtils.getInstance().log("-----------------------------------------------");
            var arr = [];
            for (var col = 0; col < Setting.MAP_W; ++col) {
                var tileIdx = this.convertMapIndexPointToStartTileIndexPoint(cc.p(row, col));
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
    getTileLogicByTilePointIndex: function (tilePointIdx, colIdx) {
        if(colIdx !== undefined) {
            return this.getTileMatrix()[tilePointIdx][colIdx];
        }else{
            return this.getTileMatrix()[tilePointIdx.x][tilePointIdx.y];
        }
    },
    getMapPointIndexByWorldPosition: function (worldPos) {
        var tilePointIdx = this.getTilePointIndexFromWorldPosition(worldPos);
        return this.convertTileIndexPointToMapIndexPoint(tilePointIdx);
    },
    getTileLogicStartByWorldPosition: function (worldPos) {
        var tilePointIdx = this.getTilePointIndexFromWorldPosition(worldPos);
        return this.getTileLogicByTilePointIndex(tilePointIdx);
    },
    updateGameObjectIDForTileLogic: function (id, obj, mapPointIdx) {
        var startTileIdxPoint = this.convertMapIndexPointToStartTileIndexPoint(mapPointIdx);
        this.pushGameObjectForTileLogic(id, obj, startTileIdxPoint);
    },
    pushGameObjectForTileLogic: function (id, gObject, startTileIdxPoint) {
        var numRow, numCol;
        if(gObject.getGameObjectSizeNumberPoint() == null){
            var h, w;
            if(gObject.getGameObjectString() == STRING_BASE) {
                h = Setting.GAME_OBJECT_SIZE * Setting.BASE_SIZE;
                w = Setting.GAME_OBJECT_SIZE * Setting.BASE_SIZE;
            }else{
                h = Setting.GAME_OBJECT_SIZE;
                w = Setting.GAME_OBJECT_SIZE;
            }
            gObject.setGameObjectSizeNumberPoint(GameObjectPointIndex(h, w));
        }
        numRow = gObject.getGameObjectSizeNumberPoint().row;
        numCol = gObject.getGameObjectSizeNumberPoint().col;
        var startTileLogic = this.getTileLogicByTilePointIndex(startTileIdxPoint);
        if(startTileLogic != null) {
            //LogUtils.getInstance().log([this.getClassName(), "YEAH YEAH tileLogic add ID", id]);
            var tWorldPos = startTileLogic.getTileWorldPosition();
            var tSize = startTileLogic.getTileSize();
            var centerPos = cc.p(tWorldPos.x + numCol * tSize.width / 2, tWorldPos.y + numRow * tSize.height / 2);
            gObject.updateLocationByWorldPosition(centerPos);
            gObject.setStartTileLogicPointIndex(startTileIdxPoint);
            gObject.clearListTileLogicPointIndex();
            //push game object into other tileLogic
            for(var row = 0; row < numRow; ++row) {
                for(var col = 0; col < numCol; ++col) {
                    var curTile = this.getTileLogicByTilePointIndex(startTileIdxPoint.x + row,startTileIdxPoint.y + col);
                    if(curTile != null) {
                        //LogUtils.getInstance().log([this.getClassName(), "updateGameObjectIDForTileLogic HERE", tileStartIdx.x + i, tileStartIdx.y + j]);
                        curTile.pushGameObjectIDOnTile(id);
                        gObject.pushTileLogicPointIndex(curTile.getTileIndexPoint());
                    }
                }
            }
        }else{
            LogUtils.getInstance().error([this.getClassName(), "pushGameObjectForTileLogic startTileLogic null"]);
        }
    },
    getTilePointIndexFromWorldPosition: function (worldPos) {
        var nPos = this.getMapBackgroundObj().convertToNodeSpace(worldPos);
        var mSize = this.getMapBackgroundObj().getContentSize();
        if(nPos.x < 0) {
            nPos.x = 0;
        }else if(nPos.x >= mSize.width) {
            nPos.x = mSize.width - 1;
        }
        if(nPos.y < 0) {
            nPos.y = 0;
        }else if(nPos.y >= mSize.height) {
            nPos.y = mSize.height - 1;
        }
        var tileSize = this.getTileLogicSize();
        var row = Math.floor(nPos.y / tileSize.height);
        var col = Math.floor(nPos.x / tileSize.width);
        return cc.p(row, col);
    },
    getNextTileLogicPointIndexByDelta: function (curPIdx, dx, dy) {
        var nextRow = curPIdx.x + dx;
        var nextCol = curPIdx.y + dy;
        nextRow = Math.max(nextRow, 0);
        nextRow = Math.min(nextRow, this.getNumberTileMapVertical() - 1);
        nextCol = Math.max(nextCol, 0);
        nextCol = Math.min(nextCol, this.getNumberTileMapHorizontal() - 1);
        return cc.p(nextRow, nextCol);
    },
    existedGameObjectOnTileAtTilePointIndex: function (p, skipId) {
        var tileLogic = this.getTileLogicByTilePointIndex(p);
        var listId = tileLogic.getListIDOnTile().filter(function (id) {
            return id != skipId;
        });
        if(listId.length > 0) {
            return listId;
        }else{
            return false;
        }
    },
    isCanMoveTankByIdWithDirection: function (id, direction, numTile) {
        var tank = gv.engine.getBattleMgr().getGameObjectByID(id);
        if(tank != null) {
            var sizeNumberPoint = tank.getGameObjectSizeNumberPoint();
            var isLookingVertical = direction == DIRECTION_UP || direction == DIRECTION_DOWN;
            var curStartTileLogicPointIdx = tank.getStartTileLogicPointIndex();
            var up, down, left, right, startLookingIdx;
            switch (direction) {
                case DIRECTION_UP:
                    up = true;
                    startLookingIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curStartTileLogicPointIdx, sizeNumberPoint.row - 1, 0);
                    //LogUtils.getInstance().log([this.getClassName(), "isCanMoveTankByIdWithDirection up"]);
                    break;
                case DIRECTION_DOWN:
                    down = true;
                    startLookingIdx = curStartTileLogicPointIdx;
                    //LogUtils.getInstance().log([this.getClassName(), "isCanMoveTankByIdWithDirection down"]);
                    break;
                case DIRECTION_LEFT:
                    left = true;
                    startLookingIdx = curStartTileLogicPointIdx;
                    //LogUtils.getInstance().log([this.getClassName(), "isCanMoveTankByIdWithDirection left"]);
                    break;
                case DIRECTION_RIGHT:
                    right = true;
                    startLookingIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curStartTileLogicPointIdx, 0, sizeNumberPoint.col - 1);
                    //LogUtils.getInstance().log([this.getClassName(), "isCanMoveTankByIdWithDirection right"]);
                    break;
                default :
                    LogUtils.getInstance().error([this.getClassName(), "isCanMoveTankByIdWithDirection direction undefined"]);
                    break;
            }
            //LogUtils.getInstance().log([this.getClassName(), "isCanMoveTankByIdWithDirection curStartTileLogicPointIdx", curStartTileLogicPointIdx.x, curStartTileLogicPointIdx.y, startLookingIdx.x, startLookingIdx.y]);
            var isEqualPoint = function(p1, p2) {
                return p1.x == p2.x && p1.y == p2.y;
            };
            var findNexIdxEmpty = function(tilePointIdx) {
                var foundedIdx = null;
                var dx = 0;
                var dy = 0;
                if (up) {
                    dx = numTile;
                } else if (down) {
                    dx = -numTile;
                } else if (left) {
                    dy = -numTile;
                } else if (right) {
                    dy = numTile;
                }
                var nextIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(tilePointIdx, dx, dy);
                if (!isEqualPoint(nextIdx, tilePointIdx)) {
                    var existedListId = gv.engine.getBattleMgr().getMapMgr().existedGameObjectOnTileAtTilePointIndex(nextIdx);
                    if (!existedListId) {
                        foundedIdx = nextIdx;
                    } else {
                        var listBarrierID = existedListId.filter(function (id) {
                            return gv.engine.getBattleMgr().getMatchMgr().isBarrierGameObjectByID(id);
                        });
                        if (listBarrierID.length > 0) {
                            //stop search
                            return foundedIdx;
                        } else {
                            //can move
                            foundedIdx = nextIdx;
                        }
                    }
                }
                return foundedIdx;
            };

            var i, len, startTileLogicPointIdx, listNextIdx = [];
            len = isLookingVertical ? sizeNumberPoint.col : sizeNumberPoint.row;
            for (i = 0; i < len; ++i) {
                var dx = isLookingVertical ? 0 : i;
                var dy = isLookingVertical ? i : 0;
                startTileLogicPointIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(startLookingIdx, dx, dy);
                var nextIdx = findNexIdxEmpty(startTileLogicPointIdx, 0, i);
                if (nextIdx != null) {
                    if (listNextIdx.length > 0) {
                        var existedIdx = listNextIdx.findIndex(function (p) {
                            return isEqualPoint(nextIdx, p);
                        });
                        if (existedIdx == -1) {
                            listNextIdx.push(nextIdx);
                        }
                    } else {
                        listNextIdx.push(nextIdx);
                    }
                }
            }
            if (listNextIdx.length == len) {
                var exited, isNoMove, delta;
                if (up || down) {
                    exited = listNextIdx.findIndex(function (p) {
                        return p.x == startLookingIdx.x;
                    });
                    isNoMove = exited != -1;
                    if (isNoMove) {
                        //LogUtils.getInstance().log([this.getClassName(), "isTankByIdWithDirection no move"]);
                        return false;
                    }
                    if (up) {
                        var minRow = listNextIdx[0].x;
                        listNextIdx.forEach(function (p) {
                            minRow = Math.min(minRow, p.x);
                        });
                        delta = minRow - startLookingIdx.x;
                    } else {
                        var maxRow = listNextIdx[0].x;
                        listNextIdx.forEach(function (p) {
                            maxRow = Math.max(maxRow, p.x);
                        });
                        delta = maxRow - startLookingIdx.x;
                    }
                    //found
                    return {delta: delta, direction: direction};
                }
                if (left || right) {
                    exited = listNextIdx.findIndex(function (p) {
                        return p.y == startLookingIdx.y;
                    });
                    isNoMove = exited != -1;
                    if (isNoMove) {
                        //LogUtils.getInstance().log([this.getClassName(), "no move"]);
                        return false;
                    }
                    if (right) {
                        var minCol = listNextIdx[0].y;
                        listNextIdx.forEach(function (p) {
                            //LogUtils.getInstance().log(["listNextIdx", p.x, p.y]);
                            minCol = Math.min(minCol, p.y);
                        });
                        delta = minCol - startLookingIdx.y;
                    } else {
                        var maxRowCol = listNextIdx[0].y;
                        listNextIdx.forEach(function (p) {
                            //LogUtils.getInstance().log(["listNextIdx", p.x, p.y]);
                            maxRowCol = Math.max(maxRowCol, p.y);
                        });
                        delta = maxRowCol - startLookingIdx.y;
                    }
                    //found
                    return {delta: delta, direction: direction};
                }
            }
        }
        return false;
    }
});
function GameObjectPointIndex (row, col){
    return {
        row: row,
        col: col,
        x: row,
        y: col
    };
}