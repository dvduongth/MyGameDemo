'use strict';
/**
 * BattleMgr quan ly viec phan bo nhiem vu cho mgr thich hop
 * MatchMgr quan ly logic game
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
        var m = this.getBattleFactory().getMAPSprites();
        for (var t in m) {
            if (m[t] != null) {
                m[t].update(dt);
            }
        }
    },
    getCurrentSelectedTank: function () {
        return this.getBattleFactory().getGameObjectByID(this.getBattleDataModel().getCurrentSelectedTankID());
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
            }
        }
    },
    removeTank: function (id) {
        this.getBattleFactory().removeTank(id);
    },
    spawnBullet: function (parent, position, direction, team, type, tankGunId) {
        var bullet = this.getBattleFactory().spawnBulletFactory(parent, position, direction, team, type, tankGunId);
    },
    removeBullet: function (id) {
        this.getBattleFactory().removeBullet(id);
    },
    updateBase: function (rootNode, team, type) {
        LogUtils.getInstance().log([this.getClassName(), "updateBase team", team, "type", type]);
        var base = this.getBattleFactory().updateBaseFactory(rootNode, team, type);
        if (base != null) {
            this.getPlayerMgr().addBaseIDForTeam(base.getID(), base.getTeam(), base.getType());
        }
    },
    removeBase: function (id) {
        this.getBattleFactory().removeBase(id);
    },
    updateObstacle: function (rootNode, type) {
        LogUtils.getInstance().log([this.getClassName(), "updateObstacle type", type]);
        var obstacle = this.getBattleFactory().updateObstacleFactory(rootNode, type);
    },
    removeObstacle: function (id) {
        this.getBattleFactory().removeObstacle(id);
    },

    checkCollisionTankWithBarrier: function (id) {
        return this.getMatchMgr().checkLogicCollisionTankWithBarrier(id);
    },
    checkCollisionBulletWithTarget: function (id) {
        return this.getMatchMgr().checkLogicCollisionBulletWithTarget(id);
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