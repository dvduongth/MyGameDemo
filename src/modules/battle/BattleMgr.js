'use strict';
/**
 * BattleMgr quan ly viec phan bo nhiem vu cho mgr thich hop
 * MatchMgr quan ly logic game
 * MapMgr quan ly map game
 * PlayerMgr quan ly thong tin nguoi choi
 * BattleFactory quan ly tai nguyen, du lieu, va doi tuong trong battle
 * */
var BattleMgr = cc.Class.extend({
    _className: "BattleMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setMatchMgr(new MatchMgr());
        this.setMapMgr(new MapMgr());
        this.setBattleFactory(new BattleFactory());
        this.setBattleDataModel(new BattleDataModel());
        this.setPlayerMgr(new PlayerMgr());
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        this.getPlayerMgr().setMyTeam(TEAM_1);
        return true;
    },
    setBattleFactory: function (m) {
        this._battleFactory = m;
    },
    getBattleFactory: function () {
        return this._battleFactory;
    },
    setBattleDataModel: function (m) {
        this._battleDataModel = m;
    },
    getBattleDataModel: function () {
        return this._battleDataModel;
    },
    setMatchMgr: function (m) {
        this._matchMgr = m;
    },
    getMatchMgr: function () {
        return this._matchMgr;
    },
    setMapMgr: function (m) {
        this._mapMgr = m;
    },
    getMapMgr: function () {
        return this._mapMgr;
    },
    setPlayerMgr: function (m) {
        this._playerMgr = m;
    },
    getPlayerMgr: function () {
        return this._playerMgr;
    },

    update: function (dt) {
        if (this.getMatchMgr().isPauseGame()) {
            return false;//todo during pause
        }
        this.getMatchMgr().runUpdateTank(dt);
        this.getMatchMgr().runUpdateBullet(dt);
        this.getMatchMgr().checkLogicCollisionBulletWithTarget();
    },
    getGameObjectByID: function (id) {
        return this.getBattleFactory().getGameObjectByIDFactory(id);
    },
    getCurrentSelectedTank: function () {
        return this.getBattleFactory().getGameObjectByIDFactory(this.getBattleDataModel().getCurrentSelectedTankID());
    },
    throwTank: function (parent, position, team, type) {
        var maxNumTank = Setting.NUMBER_OF_TANK;
        var numberPicked = this.getBattleDataModel().getNumberPickedTank();
        if (numberPicked >= maxNumTank) {
            Utility.getInstance().showTextOnScene("RICK MAX NUMBER TANK CAN PICK " + Setting.NUMBER_OF_TANK);
        } else {
            LogUtils.getInstance().log([this.getClassName(), "throwTank team", team, "type", type]);
            var tank = this.getBattleFactory().throwTankFactory(parent, position, team, type);
            if (tank != null) {
                this.getPlayerMgr().addTankIDForTeam(tank.getID(), tank.getTeam(), tank.getType());
                this.getBattleDataModel().addPickedTankID(tank.getID());
                this.getBattleDataModel().setCurrentSelectedTankID(tank.getID());
                this.getMatchMgr().pushTankID(tank.getID());
                //matchMgr find suitable location and update position
                this.getMatchMgr().findSuitableLocationForThrowTank(tank);
            }
        }
    },
    removeTank: function (id) {
        //this.getBattleFactory().removeTank(id);//remove all logic
        this.getMatchMgr().removeTankID(id);
    },
    spawnBullet: function (parent, position, direction, team, type, tankGunId) {
        var bullet = this.getBattleFactory().spawnBulletFactory(parent, position, direction, team, type, tankGunId);
        if(bullet != null) {
            var startTilePointIdx = this.getGameObjectByID(tankGunId).getStartTileLogicPointIndex();
            this.getMapMgr().pushGameObjectForTileLogic(bullet.getID(), bullet, startTilePointIdx);
            this.getMatchMgr().pushBulletID(bullet.getID());
        }
    },
    removeBullet: function (id) {
        this.getBattleFactory().removeBullet(id);
        this.getMatchMgr().removeBulletID(id);
    },
    updateBase: function (rootNode, type, mapPointIdx, idx) {
        var team = idx == 0 ? TEAM_1 : TEAM_2;
        LogUtils.getInstance().log([this.getClassName(), "updateBase team", team, "type", type]);
        var base = this.getBattleFactory().updateBaseFactory(rootNode, team, type);
        if (base != null) {
            this.getPlayerMgr().addBaseIDForTeam(base.getID(), base.getTeam(), base.getType());
            this.getMapMgr().updateGameObjectIDForTileLogic(base.getID(), base, mapPointIdx);
            this.getMatchMgr().pushBaseID(base.getID());
        }
    },
    removeBase: function (id) {
        //this.getBattleFactory().removeBase(id);//remove all logic
        this.getMatchMgr().removeBaseID(id);
    },
    updateObstacle: function (rootNode, type, mapPointIdx) {
        LogUtils.getInstance().log([this.getClassName(), "updateObstacle type", type]);
        var obstacle = this.getBattleFactory().updateObstacleFactory(rootNode, type);
        if(obstacle != null) {
            this.getMapMgr().updateGameObjectIDForTileLogic(obstacle.getID(), obstacle, mapPointIdx);
            this.getMatchMgr().pushObstacleID(obstacle.getID());
        }
    },
    removeObstacle: function (id) {
        this.getBattleFactory().removeObstacle(id);//remove all logic
        this.getMatchMgr().removeObstacleID(id);
    },
    checkWinKnockoutKillMainBase: function (id, team) {
        this.getMatchMgr().checkLogicWinKnockoutKillMainBase(id, team);
    },

    checkWinKnockoutKillAllTank: function (id, team) {
        this.getMatchMgr().checkLogicWinKnockoutKillAllTank(id, team);
    },

    showWinGame: function () {
        this.getBattleFactory().showTextWinGame(this.getPlayerMgr().getTeamWin());
    }
});