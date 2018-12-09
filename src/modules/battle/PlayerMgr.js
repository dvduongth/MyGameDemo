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
        if(exitedIdx != -1) {
            list.splice(exitedIdx, 1);
            return true;
        }else{
            return false;
        }
    },
    removeTankID: function (id) {
        var list = this.getListTankIDForTeam(TEAM_1);
        if(!this.removeIDFromList(id, list)) {
            list = this.getListTankIDForTeam(TEAM_2);
            this.removeIDFromList(id, list);
        }
    },
    removeBaseID: function (id) {
        var list = this.getListBaseIDForTeam(TEAM_1);
        if(!this.removeIDFromList(id, list)) {
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
        if(list && list.length > 0) {
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
        return false;//todo test edit after
        /*instance.m_inventory[team].push(powerUp);
         inventoryDirty = true;*/
    },
    usePowerUp: function (team, powerup, x, y) {
        return false;//todo test edit after
        /*console.log('game use power up');
         logger.print('game use power up');
         var checkOK = false;

         for (var i = 0; i < instance.m_inventory[team].length; i++) {
         if (instance.m_inventory[team][i] == powerup) {
         instance.m_inventory[team].splice(i, 1);
         inventoryDirty = true;
         checkOK = true;
         break;
         }
         }

         if (checkOK) {
         var strike = null;
         for (var i = 0; i < instance.m_strikes[team].length; i++) {
         if (instance.m_strikes[team][i].m_live == false) {
         strike = instance.m_strikes[team][i];
         }
         }

         if (strike == null) {
         var id = instance.m_strikes[team].length;
         strike = new Strike(instance, id, team);
         instance.m_strikes[team][id] = strike;
         }
         console.log('strike spawn ', x, y);
         logger.print('strike spawn x ' + x + " y " + y);
         strike.Spawn(powerup, x, y);
         }*/
    }
});