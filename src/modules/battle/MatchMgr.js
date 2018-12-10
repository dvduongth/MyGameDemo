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
        this.setListBaseID([]);
        this.setListObstacleID([]);
        this.setListTankID([]);
        this.setListBulletID([]);
        this.setListPowerUpID([]);
        this.setListStrikeID([]);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    isPauseGame: function () {
        //STATE_SUDDEN_DEATH
        var state = gv.engine.getBattleMgr().getBattleDataModel().getBattleState();
        if (state == STATE_ACTION) {
            return false;
        }
        if (state == STATE_SUDDEN_DEATH) {
            return false;
        }
        return true;
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
    setListPowerUpID: function (l) {
        this._listPowerUpID = l;
    },
    getListPowerUpID: function () {
        return this._listPowerUpID;
    },
    setListStrikeID: function (l) {
        this._listStrikeID = l;
    },
    getListStrikeID: function () {
        return this._listStrikeID;
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
    pushPowerUpID: function (id) {
        this.getListPowerUpID().push(id);
    },
    pushStrikeID: function (id) {
        this.getListStrikeID().push(id);
    },
    runUpdateTank: function (dt) {
        this.getListTankID().forEach(function (id) {
            var tank = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (tank != null && tank.isAlive()) {
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
    stopGunAllTank: function () {
        this.getListTankID().forEach(function (id) {
            var tank = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (tank != null && tank.isAlive()) {
                tank.stopHunt();
            }
        });
    },
    destroyAllBullet: function () {
        this.getListBulletID().forEach(function (id) {
            var bullet = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (bullet != null) {
                bullet.destroy();
            }
        });
    },
    destroyAllObstacle: function () {
        this.getListObstacleID().forEach(function (id) {
            var obstacle = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (obstacle != null) {
                obstacle.selfDestruct();
            }
        });
    },
    removeBulletID: function (id) {
        this.setListBulletID(this.getListBulletID().filter(function (_id) {
            return _id != id;
        }));
    },
    removeTankID: function (id) {
        this.setListTankID(this.getListTankID().filter(function (_id) {
            return _id != id;
        }));
    },
    removeBaseID: function (id) {
        this.setListBaseID(this.getListBaseID().filter(function (_id) {
            return _id != id;
        }));
    },
    removeObstacleID: function (id) {
        this.setListObstacleID(this.getListObstacleID().filter(function (_id) {
            return _id != id;
        }));
    },
    removePowerUpID: function (id) {
        this.setListPowerUpID(this.getListPowerUpID().filter(function (_id) {
            return _id != id;
        }));
    },
    removeStrikeID: function (id) {
        this.setListStrikeID(this.getListStrikeID().filter(function (_id) {
            return _id != id;
        }));
    },
    startActionBattle: function () {
        gv.engine.getBattleMgr().getBattleDataModel().setBattleState(STATE_ACTION);
    },
    finishBattle: function () {
        gv.engine.getBattleMgr().getBattleDataModel().setBattleState(STATE_FINISHED);
    },
    startSuddenDeadBattle: function () {
        gv.engine.getBattleMgr().getBattleDataModel().setBattleState(STATE_SUDDEN_DEATH);
        this.destroyAllObstacle();
    },
    isDuringSuddenDeadBattle: function () {
        return gv.engine.getBattleMgr().getBattleDataModel().getBattleState() == STATE_SUDDEN_DEATH;
    },
    setMatchResult: function (t) {
        gv.engine.getBattleMgr().getBattleDataModel().setBattleResult(t);
    },
    checkLogicSuddenDead: function () {
        var curState = gv.engine.getBattleMgr().getBattleDataModel().getBattleState();
        if (curState == STATE_ACTION) {
            var curT = gv.engine.getBattleMgr().getBattleDataModel().getTimeCountdownBattle();
            if (curT >= Setting.LOOPS_MATCH_END) {
                this.startSuddenDeadBattle();
            }
        }
    },
    checkLogicWinTimeUp: function () {
        var curT = gv.engine.getBattleMgr().getBattleDataModel().getTimeCountdownBattle();
        if (curT >= Setting.LOOPS_MATCH_END) {
            if (gv.engine.getBattleMgr().getPlayerMgr().isKnockoutTimeUpSuddenDead()) {
                //todo show win
                this.finishBattle();
                var teamWin = gv.engine.getBattleMgr().getPlayerMgr().getTeamWin();
                this.setMatchResult(teamWin == TEAM_1 ? MATCH_RESULT_TEAM_1_WIN : MATCH_RESULT_TEAM_2_WIN);
                gv.engine.getBattleMgr().endBattle();
                return true;
            }
            if (curT >= (Setting.LOOPS_MATCH_END + Setting.LOOPS_SUDDEN_DEATH)) {
                //todo show bad draw
                this.finishBattle();
                gv.engine.getBattleMgr().endBattle();//display before
                this.setMatchResult(MATCH_RESULT_DRAW);//logic after
            } else {
                this.setMatchResult(MATCH_RESULT_NOT_FINISH);//not yet finish
            }
        }
    },
    checkLogicWinKnockoutKillAllTank: function (id, team) {
        gv.engine.getBattleMgr().getPlayerMgr().removeTankID(id);
        if (gv.engine.getBattleMgr().getPlayerMgr().isKnockoutKillAllTank(team)) {
            var teamWin = team == TEAM_2 ? TEAM_1 : TEAM_2;
            gv.engine.getBattleMgr().getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.finishBattle();
            this.setMatchResult(team == TEAM_2 ? MATCH_RESULT_TEAM_1_WIN : MATCH_RESULT_TEAM_2_WIN);
            gv.engine.getBattleMgr().endBattle();
        }
    },
    checkLogicWinKnockoutKillMainBase: function (id, team) {
        gv.engine.getBattleMgr().getPlayerMgr().removeBaseID(id);
        if (gv.engine.getBattleMgr().getPlayerMgr().isKnockoutKillMainBase(id)) {
            var teamWin = team == TEAM_2 ? TEAM_1 : TEAM_2;
            gv.engine.getBattleMgr().getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.finishBattle();
            this.setMatchResult(team == TEAM_2 ? MATCH_RESULT_TEAM_1_WIN : MATCH_RESULT_TEAM_2_WIN);
            gv.engine.getBattleMgr().endBattle();
        }
    },
    checkLogicCollisionBulletWithTarget: function () {
        this.getListBulletID().forEach(function (id) {
            var bullet = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (bullet != null) {
                bullet.checkCollision();
            }
        });
    },
    checkLogicCollisionPowerUp: function () {
        this.getListPowerUpID().forEach(function (id) {
            var powerUp = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (powerUp != null && powerUp.isInActive()) {
                powerUp.checkForCollision();
            }
        });
    },
    checkSpawnPowerUp: function () {
        var c = gv.engine.getBattleMgr().getBattleDataModel().getSpawnPowerUpCountDown();
        if (c >= Setting.POWERUP_INTERVAL) {
            gv.engine.getBattleMgr().getBattleDataModel().resetSpawnPowerUpCountDown();
            gv.engine.getBattleMgr().spawnPowerUp();
        } else {
            gv.engine.getBattleMgr().getBattleDataModel().autoIncreaseSpawnPowerUpCountDown();
        }
    },
    getAvailableInfoSpawnPowerUp: function () {
        var spawnPointList = Setting.POWERUP_SPAWN_POINT;
        var spawnTypeList = [POWERUP_AIRSTRIKE, POWERUP_EMP];
        var listPowerUpID = this.getListPowerUpID();
        // Get available spawning point
        var availableSpawnPoint = [];
        for (var i = 0; i < spawnPointList.length; i++) {
            var takeThisPoint = true;
            for (var j = 0; j < listPowerUpID.length; j++) {
                var powerUpID = listPowerUpID[j];
                var powerUp = gv.engine.getBattleMgr().getGameObjectByID(powerUpID);
                if (powerUp != null && powerUp.isInActive()) {
                    var mapPointIdx = powerUp.getMapPointIndex();
                    if (mapPointIdx.x == spawnPointList[i].x && mapPointIdx.y == spawnPointList[i].y) {
                        takeThisPoint = false;
                        break;
                    }
                }
            }
            if (takeThisPoint) {
                availableSpawnPoint.push(spawnPointList[i]);
            }
        }
        // If there are free slots, random from those slots
        if (availableSpawnPoint.length > 0) {
            // Get a random
            var slotPoint = (Math.random() * availableSpawnPoint.length) >> 0;
            var slotType = (Math.random() * spawnTypeList.length) >> 0;
            var mapIdx = availableSpawnPoint[slotPoint];
            var type = spawnTypeList[slotType];
            return {
                mapIdx: mapIdx,
                type: type
            };
        }
        return null;
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
        var result = [];
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
        if (obj != null) {
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
                if (up) {
                    dx = i;
                } else if (down) {
                    dx = -i;
                } else if (left) {
                    dy = -i;
                } else if (right) {
                    dy = i;
                }
                nextIdx = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(tilePointIdx, dx, dy);
                if (!isEqualPoint(nextIdx, tilePointIdx)) {
                    if (skipCheckEmpty) {
                        foundedIdx = nextIdx;
                    } else {
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
    },
    activeAirstrike: function (team, powerUpID) {
        return this.activePowerUp(team, powerUpID);
    },
    activeEMP: function (team, powerUpID) {
        return this.activePowerUp(team, powerUpID);
    },
    activePowerUp: function (team, powerUpID) {
        var otherTeam;
        var playerMgr = gv.engine.getBattleMgr().getPlayerMgr();
        if (playerMgr.isMyTeam(team)) {
            otherTeam = playerMgr.getEnemyTeam();
        } else {
            otherTeam = playerMgr.getMyTeam();
        }
        var listTankID = playerMgr.getListTankIDForTeam(otherTeam);
        for (var i = 0; i < listTankID.length; ++i) {
            var id = listTankID[i];
            var tank = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (tank.isAlive()) {
                this.usePowerUp(team, powerUpID, tank.getStartTileLogicPointIndex());// BAM!!!
                return true;
            }
        }
    },
    usePowerUp: function (team, powerUpID, startTileLogicPointIdx) {
        LogUtils.getInstance().log([this.getClassName(), "usePowerUp", team, powerUpID]);
        var playerMgr = gv.engine.getBattleMgr().getPlayerMgr();
        var activeSuccess = playerMgr.activePowerUp(team, powerUpID);
        if (activeSuccess) {
            gv.engine.getBattleMgr().spawnStrike(team, startTileLogicPointIdx);
        }
    },
});