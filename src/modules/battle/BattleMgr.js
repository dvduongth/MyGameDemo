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
    startBattle: function () {
        this.getMatchMgr().startActionBattle();
        this.getBattleDataModel().resetSpawnPowerUpCountDown();
        Utility.getInstance().callFunctionWithDelay(3, function () {
            gv.engine.getBattleMgr().getPlayerMgr().throwEnemyTank();
        });
    },

    update: function (dt) {
        if (this.getMatchMgr().isPauseGame()) {
            return false;//todo during pause
        }
        this.getMatchMgr().update(dt);
        this.getPlayerMgr().update(dt);
    },
    updatePerSecond: function () {
        if (this.getMatchMgr().isPauseGame()) {
            return false;//todo during pause
        }
        this.getBattleDataModel().autoIncreaseTimeCountdownBattle();
        var sceneBattle = gv.engine.getSceneBattleIfExist();
        if (sceneBattle != null) {
            sceneBattle.countDownTimeUp();//update display
        }
        this.getMatchMgr().updatePerSecond();
        this.getPlayerMgr().updatePerSecond();
    },
    spawnPowerUp: function () {
        var powerUp = this.getBattleFactory().spawnPowerUpFactory();
        if (powerUp != null) {
            var mapIdx = powerUp.getMapPointIndex();
            var startTilePointIdx = this.getMapMgr().convertMapIndexPointToStartTileIndexPoint(mapIdx);
            var delta = Math.round(Setting.GAME_OBJECT_SIZE / 2);
            startTilePointIdx.x += delta;
            startTilePointIdx.y += delta;
            this.getMapMgr().pushGameObjectForTileLogic(powerUp.getID(), powerUp, startTilePointIdx);
            this.getMatchMgr().pushPowerUpID(powerUp.getID());
            powerUp.runEffectAppear();
        }
    },
    removePowerUp: function (id) {
        this.getBattleFactory().removePowerUp(id);//remove all logic
        this.getMatchMgr().removePowerUpID(id);
    },
    spawnStrike: function (team, type, startTilePointIdx) {
        var strike = this.getBattleFactory().spawnStrikeFactory(team, type);
        if (strike != null) {
            this.getMapMgr().pushGameObjectForTileLogic(strike.getID(), strike, startTilePointIdx);
            this.getMatchMgr().pushStrikeID(strike.getID());
            strike.calculateStrikeSize();
        }
    },
    removeStrike: function (id) {
        this.getBattleFactory().removeStrike(id);//remove all logic
        this.getMatchMgr().removeStrikeID(id);
    },
    getGameObjectByID: function (id) {
        return this.getBattleFactory().getGameObjectByIDFactory(id);
    },
    getCurrentSelectedTank: function (team) {
        return this.getBattleFactory().getGameObjectByIDFactory(this.getPlayerMgr().getCurrentSelectedTankID(team));
    },
    throwTank: function (worldPos, team, type, isBot) {
        var _this = this;
        var parent = gv.engine.getBattleMgr().getMapMgr().getMapBackgroundObj();
        var position = parent.convertToNodeSpace(worldPos);
        if (this.getPlayerMgr().isAlreadyDoneThrowAllTank(team)) {
            LogUtils.getInstance().error([this.getClassName(), "throwTank RICK MAX NUMBER TANK CAN PICK", team]);
            Utility.getInstance().showTextOnScene("RICK MAX NUMBER TANK CAN PICK " + Setting.NUMBER_OF_TANK);
        } else {
            LogUtils.getInstance().log([this.getClassName(), "throwTank team", team, "type", type]);
            var tank = this.getBattleFactory().throwTankFactory(parent, position, team, type);
            if (tank != null) {
                this.getPlayerMgr().addTankIDForTeam(team, tank.getID());
                this.getPlayerMgr().setCurrentSelectedTankID(team, tank.getID());
                this.getMatchMgr().pushTankID(tank.getID());
                //matchMgr find suitable location and update position
                this.getMatchMgr().findSuitableLocationForThrowTank(tank);
                tank.runEffectAppearThrowDown(function () {
                    tank.tankAction(cc.KEY.enter);
                    if(_this.getPlayerMgr().isMyTeam(team)){
                        gv.engine.getSceneBattleIfExist().updateDisplayButtonHunt();
                    }
                });
                return tank;
            } else {
                LogUtils.getInstance().error([this.getClassName(), "throwTank tank null", team, type]);
            }
        }
        LogUtils.getInstance().error([this.getClassName(), "throwTank return null", team, type]);
        return null;
    },
    removeTank: function (id) {
        this.getMatchMgr().removeTankID(id);
    },
    spawnBullet: function (parent, position, direction, team, type, tankGunId) {
        var bullet = this.getBattleFactory().spawnBulletFactory(parent, position, direction, team, type, tankGunId);
        if (bullet != null) {
            var startTilePointIdx = this.getGameObjectByID(tankGunId).getStartTileLogicPointIndex();
            this.getMapMgr().pushGameObjectForTileLogic(bullet.getID(), bullet, startTilePointIdx);
            this.getMatchMgr().pushBulletID(bullet.getID());
        }
    },
    removeBullet: function (id) {
        this.getBattleFactory().removeBullet(id);//remove all logic
        this.getMatchMgr().removeBulletID(id);
    },
    updateBase: function (rootNode, type, mapPointIdx, idx) {
        var team = idx == 0 ? TEAM_1 : TEAM_2;
        LogUtils.getInstance().log([this.getClassName(), "updateBase team", team, "type", type]);
        var base = this.getBattleFactory().updateBaseFactory(rootNode, team, type);
        if (base != null) {
            this.getPlayerMgr().addBaseIDForTeam(team, base.getID());
            this.getMapMgr().updateGameObjectIDForTileLogic(base.getID(), base, mapPointIdx);
            this.getMatchMgr().pushBaseID(base.getID());
        }
    },
    removeBase: function (id) {
        this.getMatchMgr().removeBaseID(id);
    },
    updateObstacle: function (rootNode, type, mapPointIdx) {
        LogUtils.getInstance().log([this.getClassName(), "updateObstacle type", type]);
        var obstacle = this.getBattleFactory().updateObstacleFactory(rootNode, type);
        if (obstacle != null) {
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

    endBattle: function () {
        var _this = this;
        this.getMatchMgr().stopGunAllTank();
        this.getBattleFactory().showTextEndBattle();
        Utility.getInstance().callFunctionWithDelay(1, function () {
            _this.getMatchMgr().finishBattle();
            _this.getMatchMgr().destroyAllBullet();
        });
    }
});