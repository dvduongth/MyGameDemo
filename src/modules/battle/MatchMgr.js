"use strict";
/**
 * MatchMgr manage game logic
 * */
var MatchMgr = cc.Class.extend({
    _className: "MatchMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setPauseGame(false);
        this.setListBaseID([]);
        this.setListObstacleID([]);
        this.setListTankID([]);
        this.setListBulletID([]);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setPauseGame: function (eff) {
        this._isPauseGame = eff;
    },
    isPauseGame: function () {
        return this._isPauseGame;
    },
    setListBaseID: function (l) {
        this._listBaseID = l;
    },
    getListBaseID: function () {
        return this._listBaseID;
    },
    setListObstacleID: function (l) {
        this._listObstacleID = l;
    },
    getListObstacleID: function () {
        return this._listObstacleID;
    },
    setListTankID: function (l) {
        this._listTankID = l;
    },
    getListTankID: function () {
        return this._listTankID;
    },
    setListBulletID: function (l) {
        this._listBulletID = l;
    },
    getListBulletID: function () {
        return this._listBulletID;
    },
    pushBaseID: function (id) {
        this.getListBaseID().push(id);
    },
    pushObstacleID: function (id) {
        this.getListObstacleID().push(id);
    },
    pushTankID: function (id) {
        this.getListTankID().push(id);
    },
    pushBulletID: function (id) {
        this.getListBulletID().push(id);
    },
    runUpdateTank: function (dt) {
        this.getListTankID().forEach(function (id) {
            var tank = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (tank != null) {
                tank.update(dt);
            }
        });
    },
    runUpdateBullet: function (dt) {
        this.getListBulletID().forEach(function (id) {
            var bullet = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (bullet != null) {
                bullet.update(dt);
            }
        });
    },
    checkLogicWinKnockoutKillAllTank: function (id, team) {
        if (gv.engine.getBattleMgr().getPlayerMgr().isKnockoutKillAllTank(id)) {
            var teamWin = team == TEAM_1 ? TEAM_2 : TEAM_1;
            gv.engine.getBattleMgr().getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.setPauseGame(true);
            gv.engine.getBattleMgr().showWinGame();
        }
        gv.engine.getBattleMgr().getPlayerMgr().removeTankID(id);
    },
    checkLogicWinKnockoutKillMainBase: function (id, team) {
        if (gv.engine.getBattleMgr().getPlayerMgr().isKnockoutKillMainBase(id)) {
            var teamWin = team == TEAM_1 ? TEAM_2 : TEAM_1;
            gv.engine.getBattleMgr().getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.setPauseGame(true);
            gv.engine.getBattleMgr().showWinGame();
        }
        gv.engine.getBattleMgr().getPlayerMgr().removeBaseID(id);
    },

    checkLogicCollisionTankWithBarrier: function (id) {
        var m = gv.engine.getBattleMgr().getBattleFactory().getMAPSprites();
        var curSpr = m[id];
        var sprObj, _id;
        for (var i in m) {
            _id = i + "";
            sprObj = m[_id];
            if (sprObj != null && _id != id) {
                //check collision with obstacle
                if (_id.indexOf(STRING_OBSTACLE) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with obstacle"]);
                        return true;
                    }
                }
                //check collision with base
                if (_id.indexOf(STRING_BASE) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with base"]);
                        return true;
                    }
                }
                //other tank
                if (_id.indexOf(STRING_TANK) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with other tank"]);
                        return true;
                    }
                }
            }
        }
        return false;
    },
    checkLogicCollisionBulletWithTarget: function (id) {
        return false;//todo test edit after
        var m = gv.engine.getBattleMgr().getBattleFactory().getMAPSprites();
        var curSpr = m[id];
        var tankGunID = curSpr.getTankGunID();
        var sprObj, _id;
        var isCollision = false;
        for (var i in m) {
            _id = i + "";
            sprObj = m[_id];
            if (sprObj != null && _id != id && _id != tankGunID) {
                //check collision with obstacle
                if (_id.indexOf(STRING_OBSTACLE) != -1 && sprObj.isBarrier()) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
                //check collision with base
                if (_id.indexOf(STRING_BASE) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
                //other tank
                if (_id.indexOf(STRING_TANK) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
            }
        }
        return isCollision;
    },
    getGameObjectInfoByWorldPosition: function (worldPos, skipObjectID) {
        var tileLogic = gv.engine.getBattleMgr().getMapMgr().getTileLogicStartByWorldPosition(worldPos);
        if (tileLogic != null) {
            var list = tileLogic.getListIDOnTile().filter(function (e) {
                return e != skipObjectID;
            });
            if (list.length > 0) {
                var id = list[0];
                var target = gv.engine.getBattleMgr().getGameObjectByID(id);
                if (target != null) {
                    return {
                        ID: id,
                        listID: list,
                        type: target.getType(),
                        gameObject: target
                    };
                }
            }
        }
        return null;
    },
    findSuitableLocationForThrowTank: function (tank) {
        var parent = tank.getParent();
        var nPos = tank.getPosition();
        var worldPos = parent.convertToWorldSpace(nPos);
        var existedObj = this.getGameObjectInfoByWorldPosition(worldPos, tank.getID());
        if (existedObj != null) {
            //todo find other position
            worldPos = this.breadthFirstSearch(existedObj.gameObject, tank);
        }
        var mapPointIdx = gv.engine.getBattleMgr().getMapMgr().getMapPointIndexByWorldPosition(worldPos);
        gv.engine.getBattleMgr().getMapMgr().updateGameObjectIDForTileLogic(tank.getID(), tank, mapPointIdx);
    },
    breadthFirstSearch: function (currentNode, tank) {
        LogUtils.getInstance().log([this.getClassName(), "breadthFirstSearch"]);
        var _this = this;
        var size = tank.getContentSize();
        var MAX = 100;
        var queue = [];
        var result = [];//mang ket qua
        var count = 0;
        var nResult = 4;
        var finish = false;
        var costInfo = {
            up: {cost: 0, found: false},
            down: {cost: 0, found: false},
            left: {cost: 0, found: false},
            right: {cost: 0, found: false}
        };

        function getUp(node) {
            var nPos = node.getPosition();
            var nSize = node.getContentSize();
            var wPos = node.getParent().convertToWorldSpace(cc.p(nPos.x, nPos.y + nSize.height / 2 + size.height / 2));
            var obj = _this.getGameObjectInfoByWorldPosition(wPos, tank.getID());
            return {
                obj: obj,
                wPos: wPos
            };
        }

        function getDown(node) {
            var nPos = node.getPosition();
            var nSize = node.getContentSize();
            var wPos = node.getParent().convertToWorldSpace(cc.p(nPos.x, nPos.y - nSize.height / 2 - size.height / 2));
            var obj = _this.getGameObjectInfoByWorldPosition(wPos, tank.getID());
            return {
                obj: obj,
                wPos: wPos
            };
        }

        function getLeft(node) {
            var nPos = node.getPosition();
            var nSize = node.getContentSize();
            var wPos = node.getParent().convertToWorldSpace(cc.p(nPos.x - nSize.width / 2 - size.width / 2, nPos.y));
            var obj = _this.getGameObjectInfoByWorldPosition(wPos, tank.getID());
            return {
                obj: obj,
                wPos: wPos
            };
        }

        function getRight(node) {
            var nPos = node.getPosition();
            var nSize = node.getContentSize();
            var wPos = node.getParent().convertToWorldSpace(cc.p(nPos.x + nSize.width / 2 + size.width / 2, nPos.y));
            var obj = _this.getGameObjectInfoByWorldPosition(wPos, tank.getID());
            return {
                obj: obj,
                wPos: wPos
            };
        }

        function BFSAlgorithm(current) {
            //up
            var up;
            if (!costInfo.up.found) {
                up = getUp(current);
                if (up.obj == null) {
                    costInfo.up.found = true;
                    result.push({
                        cost: costInfo.up.cost,
                        wPos: up.wPos
                    });
                } else {
                    costInfo.up.cost++;
                    count++;
                    queue.push(up.obj.gameObject);
                }
            }
            //down
            var down;
            if (!costInfo.down.found) {
                down = getDown(current);
                if (down.obj == null) {
                    costInfo.down.found = true;
                    result.push({
                        cost: costInfo.down.cost,
                        wPos: down.wPos
                    });
                } else {
                    costInfo.down.cost++;
                    count++;
                    queue.push(down.obj.gameObject);
                }
            }
            //left
            var left;
            if (!costInfo.left.found) {
                left = getLeft(current);
                if (left.obj == null) {
                    costInfo.left.found = true;
                    result.push({
                        cost: costInfo.left.cost,
                        wPos: left.wPos
                    });
                } else {
                    costInfo.left.cost++;
                    count++;
                    queue.push(left.obj.gameObject);
                }
            }
            //right
            var right;
            if (!costInfo.right.found) {
                right = getRight(current);
                if (right.obj == null) {
                    costInfo.right.found = true;
                    result.push({
                        cost: costInfo.right.cost,
                        wPos: right.wPos
                    });
                } else {
                    costInfo.right.cost++;
                    count++;
                    queue.push(right.obj.gameObject);
                }
            }
        }

        //start
        BFSAlgorithm(currentNode);
        while (!finish && queue.length > 0) {
            var curNode = queue.shift();
            BFSAlgorithm(curNode);
            finish = (result.length >= nResult) || (count >= MAX);
        }
        var worldPos = cc.POINT_ZERO;
        var cost = MAX;
        result.forEach(function (r) {
            if (r.cost < cost) {
                cost = r.cost;
                worldPos = r.wPos;
            }
        });
        return worldPos;
    },
    isBarrierGameObjectByID: function (id) {
        var obj = gv.engine.getBattleMgr().getGameObjectByID(id);
        if(obj != null) {
            var str = obj.getGameObjectString();
            switch (str) {
                case STRING_BASE:
                case STRING_OBSTACLE:
                case STRING_TANK:
                    return true;
                default :
                    return false;
            }
        }
        return false;
    },
    moveGameObject: function (obj, dRow, dCol, skipCheckEmpty) {
        var sizeNumberPoint = obj.getGameObjectSizeNumberPoint();
        var isChangeVertical = Math.abs(dRow) > Math.abs(dCol);
        var numTile = isChangeVertical ? Math.abs(dRow) : Math.abs(dCol);
        var curStartTileLogicPointIdx = obj.getStartTileLogicPointIndex();
        var up, down, left, right, startLookingIdx;
        if (isChangeVertical) {
            if (dRow > 0) {
                //up
                up = true;
                startLookingIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curStartTileLogicPointIdx, sizeNumberPoint.row - 1, 0);
                //LogUtils.getInstance().log([this.getClassName(), "moveGameObject up"]);
            } else {
                //down
                down = true;
                startLookingIdx = curStartTileLogicPointIdx;
                //LogUtils.getInstance().log([this.getClassName(), "moveGameObject down"]);
            }
        } else {
            if (dCol > 0) {
                //right
                right = true;
                startLookingIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curStartTileLogicPointIdx, 0, sizeNumberPoint.col - 1);
                //LogUtils.getInstance().log([this.getClassName(), "moveGameObject right"]);
            } else {
                //left
                left = true;
                startLookingIdx = curStartTileLogicPointIdx;
                //LogUtils.getInstance().log([this.getClassName(), "moveGameObject left"]);
            }
        }
        //LogUtils.getInstance().log([this.getClassName(), "moveGameObject curStartTileLogicPointIdx", curStartTileLogicPointIdx.x, curStartTileLogicPointIdx.y, startLookingIdx.x, startLookingIdx.y]);
        function isEqualPoint(p1, p2) {
            return p1.x == p2.x && p1.y == p2.y;
        }
        function findNexIdxEmpty(tilePointIdx) {
            var nextIdx = null;
            var foundedIdx = null;
            for (var i = 1; i <= numTile; ++i) {
                var dx = 0;
                var dy = 0;
                if(up) {
                    dx = i;
                }else if(down) {
                    dx = -i;
                }else if(left) {
                    dy = -i;
                }else if(right) {
                    dy = i;
                }
                nextIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(tilePointIdx, dx, dy);
                if (!isEqualPoint(nextIdx, tilePointIdx)) {
                    if(skipCheckEmpty) {
                        foundedIdx = nextIdx;
                    }else{
                        var existedListId = gv.engine.getBattleMgr().getMapMgr().existedGameObjectOnTileAtTilePointIndex(nextIdx);
                        if (!existedListId) {
                            foundedIdx = nextIdx;
                        }else{
                            var listBarrierID = existedListId.filter(function (id) {
                                return gv.engine.getBattleMgr().getMatchMgr().isBarrierGameObjectByID(id);
                            });
                            if(listBarrierID.length > 0) {
                                //stop search
                                return foundedIdx;
                            }else{
                                //can move
                                foundedIdx = nextIdx;
                            }
                        }
                    }
                }
            }
            return foundedIdx;
        }

        var i, len, startTileLogicPointIdx, listNextIdx = [];
        len = isChangeVertical ? sizeNumberPoint.col : sizeNumberPoint.row;
        for (i = 0; i < len; ++i) {
            var dx = isChangeVertical ? 0 : i;
            var dy = isChangeVertical ? i : 0;
            startTileLogicPointIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(startLookingIdx, dx, dy);
            var nextIdx = findNexIdxEmpty(startTileLogicPointIdx, 0, numTile);
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
            var exited, isNoMove, delta, desStartTileIdx;
            if (up || down) {
                exited = listNextIdx.findIndex(function (p) {
                    return p.x == startLookingIdx.x;
                });
                isNoMove = exited != -1;
                if (isNoMove) {
                    //LogUtils.getInstance().log([this.getClassName(), "no move"]);
                    return false;
                }
                if (up) {
                    var minRow = listNextIdx[0].x;
                    listNextIdx.forEach(function (p) {
                        //LogUtils.getInstance().log(["listNextIdx", p.x, p.y]);
                        minRow = Math.min(minRow, p.x);
                    });
                    delta = minRow - startLookingIdx.x;
                } else {
                    var maxRow = listNextIdx[0].x;
                    listNextIdx.forEach(function (p) {
                        //LogUtils.getInstance().log(["listNextIdx", p.x, p.y]);
                        maxRow = Math.max(maxRow, p.x);
                    });
                    delta = maxRow - startLookingIdx.x;
                }
                //LogUtils.getInstance().log([this.getClassName(), "isChangeVertical delta",delta]);
                desStartTileIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curStartTileLogicPointIdx, delta, 0);
                //LogUtils.getInstance().log([this.getClassName(), "isChangeVertical desStartTileIdx",desStartTileIdx.x, desStartTileIdx.y]);
                gv.engine.getBattleMgr().getMapMgr().pushGameObjectForTileLogic(obj.getID(), obj, desStartTileIdx);
                return false;
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
                //LogUtils.getInstance().log([this.getClassName(), "delta",delta]);
                desStartTileIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curStartTileLogicPointIdx, 0, delta);
                //LogUtils.getInstance().log([this.getClassName(), "desStartTileIdx",desStartTileIdx.x, desStartTileIdx.y]);
                gv.engine.getBattleMgr().getMapMgr().pushGameObjectForTileLogic(obj.getID(), obj, desStartTileIdx);
            }
        }
    }
});