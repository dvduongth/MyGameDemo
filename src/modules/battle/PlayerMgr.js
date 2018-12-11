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
        this.setTeamWin(-1);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setMAPGameObjectID: function (m) {
        this._mapGameObjectID = m;
    },
    getMAPGameObjectID: function () {
        return this._mapGameObjectID;
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
    addTankIDForTeam: function (id, team) {
        this.getListTankIDForTeam(team).push(id);
    },
    addBaseIDForTeam: function (id, team) {
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
        if (this.isMyTeam(team) && !this.isAlreadyDoneThrowAllTank()) {
            LogUtils.getInstance().log([this.getClassName(), "isKnockoutKillAllTank false because of not yet done pick tank"]);
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
            Utility.getInstance().callFunctionWithDelay(i * 0.9, function () {
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
        var tank = gv.engine.getBattleMgr().throwTank(worldPos, team, type);
        if (tank != null) {
            tank.tankAction(cc.KEY.enter);
            tank.setIsBot(true);
        }
    },
    getRandomMapIndexThrowBotTank: function () {
        var row = Utility.getInstance().randomBetweenRound(Setting.MAP_H - 1 - Setting.MAP_LIMIT_ROW_THROW_TANK, Setting.MAP_H - 2);
        var col = Utility.getInstance().randomBetweenRound(1, Setting.MAP_W - 2);
        return cc.p(row, col);
    },
    isAlreadyDoneThrowAllTank: function () {
        var maxNumTank = Setting.NUMBER_OF_TANK;
        var numberPicked = gv.engine.getBattleMgr().getBattleDataModel().getNumberPickedTank();
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
    }
});