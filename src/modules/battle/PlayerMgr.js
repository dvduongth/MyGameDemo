'use strict';
/**
 * PlayerMgr manage player game state and player data
 * */
var PlayerMgr = cc.Class.extend({
    _className: "PlayerMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setMAPGameObjectID({});
        this.setListTankIDForTeam([], TEAM_1);
        this.setListTankIDForTeam([], TEAM_2);
        this.setListBaseIDForTeam([], TEAM_1);
        this.setListBaseIDForTeam([], TEAM_2);
        this.setListInventoryForTeam([], TEAM_1);
        this.setListInventoryForTeam([], TEAM_2);
        this.setListTankIDNotYetSelectForTeam([], TEAM_1);
        this.setListTankIDNotYetSelectForTeam([], TEAM_2);
        this.setNumberPickedTankForTeam(TEAM_1, 0);
        this.setNumberPickedTankForTeam(TEAM_2, 0);
        this.setTeamWin(-1);
        this.setListBotID([]);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setMAPGameObjectID: function (m) {
        this._mapGameObjectID = m;
    },
    getMAPGameObjectID: function () {
        return this._mapGameObjectID;
    },
    setListBotID: function (m) {
        this._listBotID = m;
    },
    getListBotID: function () {
        return this._listBotID;
    },
    setListTankIDForTeam: function (m, team) {
        this.getMAPGameObjectID()["_listTankID" + team] = m;
    },
    getListTankIDForTeam: function (team) {
        return this.getMAPGameObjectID()["_listTankID" + team];
    },
    setListBaseIDForTeam: function (m, team) {
        this.getMAPGameObjectID()["_listBaseID" + team] = m;
    },
    getListBaseIDForTeam: function (team) {
        return this.getMAPGameObjectID()["_listBaseID" + team];
    },
    setListTankIDNotYetSelectForTeam: function (m, team) {
        this.getMAPGameObjectID()["_listTankIDNotYetSelectForTeam" + team] = m;
    },
    getListTankIDNotYetSelectForTeam: function (team) {
        return this.getMAPGameObjectID()["_listTankIDNotYetSelectForTeam" + team];
    },
    setListInventoryForTeam: function (m, team) {
        this.getMAPGameObjectID()["_listInventory" + team] = m;
    },
    getListInventoryForTeam: function (team) {
        return this.getMAPGameObjectID()["_listInventory" + team];
    },
    setMyTeam: function (m) {
        this._myTeam = m;
    },
    getMyTeam: function () {
        return this._myTeam;
    },
    setEnemyTeam: function (m) {
        this._enemyTeam = m;
    },
    getEnemyTeam: function () {
        return this._enemyTeam;
    },
    isMyTeam: function (m) {
        return m === this.getMyTeam();
    },
    setNumberPickedTankForTeam: function (team, n) {
        this["_numberPickedTankForTeam" + team] = n;
    },
    getNumberPickedTankForTeam: function (team) {
        return this["_numberPickedTankForTeam" + team];
    },
    autoIncreaseNumberPickedTankForTeam: function (team) {
        this.setNumberPickedTankForTeam(team, this.getNumberPickedTankForTeam(team) + 1);
    },
    removeTankIDNotYetSelectForTeam: function (team, id) {
        LogUtils.getInstance().log([this.getClassName(), "removeTankIDNotYetSelectForTeam", team, id]);
        var list = this.getListTankIDNotYetSelectForTeam(team).filter(function (_id) {
            return _id != id;
        });
        this.setListTankIDNotYetSelectForTeam(list);
    },
    pushTankIDNotYetSelectForTeam: function (team, id) {
        LogUtils.getInstance().log([this.getClassName(), "pushTankIDNotYetSelectForTeam", team, id]);
        var tank = gv.engine.getBattleMgr().getGameObjectByID(id);
        if (tank != null) {
            tank.setSelected(false);
            //push old into not yet select
            if (tank.isAlive()) {
                this.getListTankIDNotYetSelectForTeam(team).push(id);
                LogUtils.getInstance().log([this.getClassName(), "pushTankIDNotYetSelectForTeam success", team, id]);
            }
        } else {
            LogUtils.getInstance().error([this.getClassName(), "pushTankIDNotYetSelectForTeam tank null"]);
        }
    },
    setCurrentSelectedTankID: function (team, id) {
        if (!this.isMyTeam(team)) {
            return false;
        }
        var oldSelectedID = this["_currentSelectedTankID" + team];
        if (oldSelectedID == id) {
            return false;
        }
        LogUtils.getInstance().log([this.getClassName(), "setCurrentSelectedTankID", team, id]);
        //remove from not yet select
        this.removeTankIDNotYetSelectForTeam(team, id);
        if (oldSelectedID != null) {
            this.pushTankIDNotYetSelectForTeam(team, oldSelectedID);
        }
        var tank = gv.engine.getBattleMgr().getGameObjectByID(id);
        if (tank != null && tank.isAlive()) {
            tank.setSelected(true);
            this["_currentSelectedTankID" + team] = id;
            LogUtils.getInstance().log([this.getClassName(), "setCurrentSelectedTankID success", team, id]);
        } else {
            LogUtils.getInstance().log([this.getClassName(), "setCurrentSelectedTankID failed", team, id]);
        }
    },
    getCurrentSelectedTankID: function (team) {
        return this["_currentSelectedTankID" + team];
    },
    addTankIDForTeam: function (team, id) {
        this.getListTankIDForTeam(team).push(id);
        this.getListTankIDNotYetSelectForTeam(team).push(id);
        this.autoIncreaseNumberPickedTankForTeam(team);
    },
    addBaseIDForTeam: function (team, id) {
        this.getListBaseIDForTeam(team).push(id);
    },
    removeIDFromList: function (id, list) {
        var exitedIdx = list.findIndex(function (_id) {
            return _id == id;
        });
        if (exitedIdx != -1) {
            list.splice(exitedIdx, 1);
            return true;
        } else {
            return false;
        }
    },
    removeTankID: function (id) {
        var list = this.getListTankIDForTeam(TEAM_1);
        if (!this.removeIDFromList(id, list)) {
            list = this.getListTankIDForTeam(TEAM_2);
            this.removeIDFromList(id, list);
        }
    },
    removeBaseID: function (id) {
        var list = this.getListBaseIDForTeam(TEAM_1);
        if (!this.removeIDFromList(id, list)) {
            list = this.getListBaseIDForTeam(TEAM_2);
            this.removeIDFromList(id, list);
        }
    },
    isKnockoutKillMainBase: function (id) {
        LogUtils.getInstance().log([this.getClassName(), "isKnockoutKillMainBase", id]);
        return true;
    },
    isKnockoutKillAllTank: function (team) {
        //Check win-lost in SuddenDeath mode
        if (gv.engine.getBattleMgr().getMatchMgr().isDuringSuddenDeadBattle()) {
            LogUtils.getInstance().log([this.getClassName(), "isKnockoutKillAllTank true isDuringSuddenDeadBattle"]);
            return true;
        }
        if (!this.isAlreadyDoneThrowAllTank(team)) {
            LogUtils.getInstance().log([this.getClassName(), "isKnockoutKillAllTank false because of not yet done pick tank", this.getNumberPickedTankForTeam(team), team]);
            return false;
        }
        var listTankID = this.getListTankIDForTeam(team);
        for (var i = 0; i < listTankID.length; ++i) {
            var id = listTankID[i];
            var gObj = gv.engine.getBattleMgr().getGameObjectByID(id);
            if (gObj.isAlive()) {
                LogUtils.getInstance().log([this.getClassName(), "isKnockoutKillAllTank existed tank alive", id]);
                return false;
            }
        }
        return true;
    },
    isKnockoutTimeUpSuddenDead: function () {
        var num1 = this.getNumberBaseAliveByTeam(TEAM_1);
        var num2 = this.getNumberBaseAliveByTeam(TEAM_2);
        var teamWin;
        if (num1 != num2) {
            teamWin = num1 > num2 ? TEAM_1 : TEAM_2;
            this.setTeamWin(teamWin);
            return true;
        }
        num1 = this.getNumberTankAliveByTeam(TEAM_1);
        num2 = this.getNumberTankAliveByTeam(TEAM_2);
        if (num1 != num2) {
            teamWin = num1 > num2 ? TEAM_1 : TEAM_2;
            this.setTeamWin(teamWin);
            return true;
        }
    },
    getNumberBaseAliveByTeam: function (team) {
        return this.getNumberGameObjectAliveByTeam(team, STRING_BASE);
    },
    getNumberTankAliveByTeam: function (team) {
        return this.getNumberGameObjectAliveByTeam(team, STRING_TANK);
    },
    getNumberGameObjectAliveByTeam: function (team, gObjString) {
        var num = 0;
        var list;
        switch (gObjString) {
            case STRING_TANK:
                list = this.getListTankIDForTeam(team);
                break;
            case STRING_BASE:
                list = this.getListBaseIDForTeam(team);
                break;
        }
        if (list && list.length > 0) {
            list.forEach(function (id) {
                //existed base alive
                var gObj = gv.engine.getBattleMgr().getGameObjectByID(id);
                if (gObj.isAlive()) {
                    num++;
                }
            });
        }
        return num;
    },
    setTeamWin: function (t) {
        this._teamWin = t;
    },
    getTeamWin: function () {
        return this._teamWin;
    },
    throwEnemyTank: function () {
        var _this = this;
        this.setEnemyTeam(TEAM_2);
        for (var i = 0; i < Setting.NUMBER_OF_TANK; ++i) {
            Utility.getInstance().callFunctionWithDelay(i * 2, function () {
                _this.randomThrowBotTank();
            });
        }
    },
    randomThrowBotTank: function () {
        var worldPos;
        var mapIdx;
        var type;
        var tilePointIdx;
        var tileLogic;
        var team = this.getEnemyTeam();
        type = Utility.getInstance().randomBetweenRound(1, 3);
        mapIdx = this.getRandomMapIndexThrowBotTank();
        tilePointIdx = gv.engine.getBattleMgr().getMapMgr().convertMapIndexPointToStartTileIndexPoint(mapIdx);
        tileLogic = gv.engine.getBattleMgr().getMapMgr().getTileLogicByTilePointIndex(tilePointIdx);
        worldPos = tileLogic.getTileWorldPosition();
        var tank = gv.engine.getBattleMgr().throwTank(worldPos, team, type, true);
        if (tank != null) {
            this.getListBotID().push(tank.getID());
        } else {
            LogUtils.getInstance().error([this.getClassName(), "randomThrowBotTank tank null"]);
        }
    },
    getRandomMapIndexThrowBotTank: function () {
        var row = Utility.getInstance().randomBetweenRound(Setting.MAP_H - 1 - Setting.MAP_LIMIT_ROW_THROW_TANK, Setting.MAP_H - 2);
        var col = Utility.getInstance().randomBetweenRound(1, Setting.MAP_W - 2);
        return cc.p(row, col);
    },
    isAlreadyDoneThrowAllTank: function (team) {
        var maxNumTank = Setting.NUMBER_OF_TANK;
        var numberPicked = gv.engine.getBattleMgr().getPlayerMgr().getNumberPickedTankForTeam(team);
        return numberPicked >= maxNumTank;
    },
    acquirePowerUp: function (team, powerUpID) {
        this.getListInventoryForTeam(team).push(powerUpID);
        LogUtils.getInstance().log([this.getClassName(), "acquirePowerUp", team, powerUpID]);
    },
    activePowerUp: function (team, powerUpID) {
        var list = this.getListInventoryForTeam(team);
        LogUtils.getInstance().log([this.getClassName(), "activePowerUp", team, powerUpID, list.length]);
        var existedIdx = list.findIndex(function (pId) {
            return pId == powerUpID;
        });
        if (existedIdx != -1) {
            list.splice(existedIdx, 1);
            LogUtils.getInstance().log([this.getClassName(), "activePowerUp remove item", existedIdx, list.length]);
            return true;
        } else {
            return false;
        }
    },
    // =========================================================================================================
    // This is an example on how you use your power up if you acquire one.
    // If you have airstrike or EMP, you may use them anytime.
    // I just give a primitive example here: I strike on the first enemy tank, as soon as I acquire power up
    // =========================================================================================================
    checkAutoUsePowerUp: function () {
        var obj = this.hasAirstrike();
        if (obj != null) {
            gv.engine.getBattleMgr().getMatchMgr().activeAirstrike(obj.team, obj.powerUpID);
        }
        obj = this.hasEMP();
        if (obj != null) {
            gv.engine.getBattleMgr().getMatchMgr().activeEMP(obj.team, obj.powerUpID);
        }
    },
    hasAirstrike: function () {
        // Call this function to see if you have airstrike powerup.
        return this.hasPowerUpType(POWERUP_AIRSTRIKE);
    },
    hasEMP: function () {
        // Call this function to see if you have EMP powerup.
        return this.hasPowerUpType(POWERUP_EMP);
    },
    hasPowerUpType: function (type) {
        var list = this.getListInventoryForTeam(TEAM_1);
        var existed = list.findIndex(function (powerUpID) {
            var powerUp = gv.engine.getBattleMgr().getGameObjectByID(powerUpID);
            return powerUp != null && powerUp.getType() == type;
        });
        if (existed != -1) {
            return {team: TEAM_1, powerUpID: list[existed]};
        }
        list = this.getListInventoryForTeam(TEAM_2);
        existed = list.findIndex(function (powerUpID) {
            var powerUp = gv.engine.getBattleMgr().getGameObjectByID(powerUpID);
            return powerUp != null && powerUp.getType() == type;
        });
        if (existed != -1) {
            return {team: TEAM_2, powerUpID: list[existed]};
        }
        return null;
    },
    autoSelectOtherTankIDForCurrentSelectedFunction: function (team) {
        var id = -1;
        var found = false;
        while (!found && this.getListTankIDNotYetSelectForTeam(team).length > 0) {
            id = this.getListTankIDNotYetSelectForTeam(team).shift();
            var tank = gv.engine.getBattleMgr().getGameObjectByID(id);
            found = tank != null && tank.isAlive();
        }
        if (found) {
            this.setCurrentSelectedTankID(team, id);
        }
    },
    setCurrentSelectedTankIDByIndex: function (idx) {
        LogUtils.getInstance().log([this.getClassName(), "setCurrentSelectedTankIDByIndex", idx]);
        var listTankID = this.getListTankIDForTeam(this.getMyTeam());
        var tankID = listTankID[idx];
        var tank = gv.engine.getBattleMgr().getGameObjectByID(tankID);
        if (tank != null && tank.isAlive()) {
            this.setCurrentSelectedTankID(this.getMyTeam(), tankID);
        }
    },
    isTankAliveByIndex: function (idx) {
        var listTankID = this.getListTankIDForTeam(this.getMyTeam());
        var tank = gv.engine.getBattleMgr().getGameObjectByID(listTankID[idx]);
        return tank != null && tank.isAlive();
    },
    update: function (dt) {
        // Update all strike
        this.checkAutoUsePowerUp();
    },
    updatePerSecond: function () {
        this.autoCheckActionForBot();
    },
    autoCheckActionForBot: function () {
        var _this = this;
        var baseMainId = this.getListBaseIDForTeam(this.getMyTeam()).find(function (id) {
            var base = gv.engine.getBattleMgr().getGameObjectByID(id);
            return base != null && base.getType() == BASE_MAIN;
        });
        var baseMain = gv.engine.getBattleMgr().getGameObjectByID(baseMainId);
        if(!baseMain) {
            //battle ended
            return false;
        }
        var baseMainWPos = baseMain.getWorldPosition();
        var listBotID = this.getListBotID();
        listBotID.forEach(function (id) {
            var botTank = gv.engine.getBattleMgr().getGameObjectByID(id);
            var wPos = botTank.getWorldPosition();
            var powerUpPos = _this.autoBotCheckFindNearestPowerupIfExist(id);
            var tankEnemyPos = _this.autoBotCheckFindNearestEnemyCanAttack(id);
            var baseSidePos = _this.autoBotCheckFindNearestSideBaseCanAttack(id);
            var result = baseMainWPos;
            var curD = cc.pDistance(baseMainWPos, wPos);
            var d;
            //check has enemy tank
            if(tankEnemyPos) {
                if(powerUpPos) {
                    result = powerUpPos;
                    curD = cc.pDistance(powerUpPos, wPos);
                }
                d = cc.pDistance(tankEnemyPos, wPos);
                if(d < curD) {
                    curD = d;
                    result = tankEnemyPos;
                }else{
                    if(baseSidePos) {
                        d = cc.pDistance(baseSidePos, wPos);
                        if(d < curD) {
                            result = baseSidePos;
                        }
                    }
                }
            }
            if(result) {
                botTank.setMoveDestinationWorldPosition(result);
            }
        });
    },
    autoBotCheckFindWorldPositionOfListTargetId: function (botId, listID, checkAlive) {
        var len, i, id, d;
        var botTank = gv.engine.getBattleMgr().getGameObjectByID(botId);
        if (botTank != null && botTank.isAlive()) {
            var foundTarget = null;
            var curD = null;
            var botStartTileIdx = botTank.getStartTileLogicPointIndex();
            len = listID.length;
            for (i = 0; i < len; ++i) {
                id = listID[i];
                var gObj = gv.engine.getBattleMgr().getGameObjectByID(id);
                if (gObj != null) {
                    if(checkAlive && !gObj.isAlive()){
                        continue;//skip this case caused died
                    }
                    //kiem tra khoang cach den power up
                    var powerUpStartTileIdx = gObj.getStartTileLogicPointIndex();
                    //calculate distance
                    if (foundTarget == null) {
                        foundTarget = gObj;
                    }
                    d = cc.pDistance(botStartTileIdx, powerUpStartTileIdx);
                    if (curD == null) {
                        curD = d;
                    } else {
                        if (d < curD) {
                            foundTarget = gObj;
                            curD = d;
                        }
                    }
                }
            }
            if (foundTarget != null) {
                return foundTarget.getWorldPosition();
            } else {
                //LogUtils.getInstance().error([this.getClassName(), "autoBotCheckFindNearestPowerupIfExist foundTarget null"]);
            }
        } else {
            //LogUtils.getInstance().error([this.getClassName(), "autoBotCheckFindNearestPowerupIfExist bot null or died"]);
        }
        return false;
    },
    autoBotCheckFindNearestPowerupIfExist: function (botId) {
        var listID = gv.engine.getBattleMgr().getMatchMgr().getListPowerUpID();
        return this.autoBotCheckFindWorldPositionOfListTargetId(botId, listID, false);
    },
    autoBotCheckFindNearestEnemyCanAttack: function (botId) {
        var listID = this.getListTankIDForTeam(this.getMyTeam());
        return this.autoBotCheckFindWorldPositionOfListTargetId(botId, listID, true);
    },
    autoBotCheckFindNearestSideBaseCanAttack: function (botId) {
        var listID = this.getListBaseIDForTeam(this.getMyTeam());
        listID = listID.filter(function (id) {
            var base = gv.engine.getBattleMgr().getGameObjectByID(id);
            return base != null && base.getType() != BASE_MAIN;
        });
        return this.autoBotCheckFindWorldPositionOfListTargetId(botId, listID, true);
    },
    autoBotCheckMustAvoidEnemyBullet: function (botId) {
        var botTank = gv.engine.getBattleMgr().getGameObjectByID(botId);
        if (botTank != null && botTank.isAlive()) {
            var botStartTileIdx = botTank.getStartTileLogicPointIndex();
            var botNumTilePoint = botTank.getGameObjectSizeNumberPoint();
            var rect1 = cc.rect(botStartTileIdx.x, botStartTileIdx.y, botNumTilePoint.x, botNumTilePoint.y);
            var listID = gv.engine.getBattleMgr().getMatchMgr().getListBulletID();
            var len = listID.length;
            for (var i = 0; i < len; ++i) {
                var id = listID[i];
                var bullet = gv.engine.getBattleMgr().getGameObjectByID(id);
                if (bullet != null) {
                    var bulletStartTileIdx = bullet.getStartTileLogicPointIndex();
                    var bulletNumTilePoint = bullet.getGameObjectSizeNumberPoint();
                    var rect2 = cc.rect(bulletStartTileIdx.x, bulletStartTileIdx.y, bulletNumTilePoint.x, bulletNumTilePoint.y);
                    //isCollisionOverLapRect
                    //kiem tra cung row hoac cung col
                    //kiem tra huong bay ve phia bot => dangerous => move away
                }
            }
        }

    },
    autoCheckObstacleFrontOfBotId: function (botId) {
        //can not move immediately, no quickly
    }

});