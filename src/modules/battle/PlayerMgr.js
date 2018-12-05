'use strict';
/**
 * PlayerMgr manage player game state
 * */
var PlayerMgr = cc.Class.extend({
    _className: "PlayerMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setMAPGameObjectID({});
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
    addTankIDForTeam: function (id, team, type) {
        this.getMAPGameObjectID()[id] = {team: team, type: type};
    },
    getInfoOfTankID: function (id) {
        return this.getMAPGameObjectID()[id];
    },
    addBaseIDForTeam: function (id, team, type) {
        this.getMAPGameObjectID()[id] = {team: team, type: type};
    },
    getInfoOfBaseID: function (id) {
        return this.getMAPGameObjectID()[id];
    },
    removeTankID: function (id) {
        this.removeGameObjectID(id);
    },
    removeBaseID: function (id) {
        this.removeGameObjectID(id);
    },
    removeGameObjectID: function (id) {
        this.getMAPGameObjectID()[id] = null;
        delete this.getMAPGameObjectID()[id];
    },
    isKnockoutKillMainBase: function (id) {
        return true;
    },
    isKnockoutKillAllTank: function (team) {
        if(!this.isAlreadyDoneThrowAllTank()) {
            LogUtils.getInstance().log([this.getClassName(), "isKnockoutKillAllTank false because of not yet done pick tank"]);
            return false;
        }
        var map = this.getMAPGameObjectID();
        for (var _id in map) {
            var id = _id + "";
            var _info = map[id];
            if (_info != null && _info.team == team) {
                //existed other tank alive
                var gObj = gv.engine.getBattleMgr().getGameObjectByID(id);
                if(gObj.getGameObjectString() == STRING_TANK) {
                    LogUtils.getInstance().log([this.getClassName(), "isKnockoutKillAllTank existed tank alive", id]);
                    return false;
                }
            }
        }
        return true;
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
        for(var i = 0; i < Setting.NUMBER_OF_TANK; ++i) {
            Utility.getInstance().callFunctionWithDelay(i * 0.3, function () {
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
        if(tank != null) {
            tank.tankAction(cc.KEY.enter);
            tank.setIsBot(true);
        }
    },
    getRandomMapIndexThrowBotTank: function () {
        var row = Utility.getInstance().randomBetweenRound(15, 20);
        var col = Utility.getInstance().randomBetweenRound(1, 20);
        return cc.p(row, col);
    },
    isAlreadyDoneThrowAllTank: function () {
        var maxNumTank = Setting.NUMBER_OF_TANK;
        var numberPicked = gv.engine.getBattleMgr().getBattleDataModel().getNumberPickedTank();
        return numberPicked >= maxNumTank;
    }
});