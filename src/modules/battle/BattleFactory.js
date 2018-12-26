"use strict";
/**
 * BattleFactory manage generate game resource, save data display
 * */
var BattleFactory = cc.Class.extend({
    _className: "BattleFactory",
    _autoID: 0,
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setMAPSprite({});
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setMAPSprite: function (m) {
        this._mapSpr = m;
    },
    getMAPSprites: function () {
        return this._mapSpr;
    },
    getTankID: function () {
        return STRING_TANK + "_" + (this._autoID++);
    },
    getBulletID: function () {
        return STRING_BULLET + "_" + (this._autoID++);
    },
    getBaseID: function () {
        return STRING_BASE + "_" + (this._autoID++);
    },
    getObstacleID: function () {
        return STRING_OBSTACLE + "_" + (this._autoID++);
    },
    getPowerUpID: function () {
        return STRING_POWER_UP + "_" + (this._autoID++);
    },
    getStrikeID: function () {
        return STRING_STRIKE + "_" + (this._autoID++);
    },
    getGameObjectByIDFactory: function (id) {
        return this.getMAPSprites()[id];
    },

    throwTankFactory: function (parent, position, team, type) {
        LogUtils.getInstance().log([this.getClassName(), "throwTankFactory team", team, "type", type]);
        if (parent != null) {
            var tank = new Tank(this.getTankID(), team, type);
            tank.setLocalZOrder(ZORDER_FORCE_GROUND);
            tank.setGameObjectString(STRING_TANK);
            parent.addChild(tank);
            tank.setPosition(position);
            this.addTank(tank);
            LogUtils.getInstance().log([this.getClassName(), "throwTankFactory success", tank.getID()]);
            return tank;
        } else {
            LogUtils.getInstance().error([this.getClassName(), "throwTank with parent null"]);
            return null;
        }
    },
    addTank: function (tank) {
        this.getMAPSprites()[tank.getID()] = tank;
        LogUtils.getInstance().log([this.getClassName(), "addTank with id", tank.getID()]);
    },
    removeTank: function (id) {
        if (this.getMAPSprites()[id] != null) {
            this.getMAPSprites()[id] = null;
            LogUtils.getInstance().log([this.getClassName(), "removeTank id", id]);
        }
    },

    spawnBulletFactory: function (parent, position, direction, team, type, tankGunId) {
        //LogUtils.getInstance().log([this.getClassName(), "spawnBullet direction", direction]);
        if (parent != null) {
            var bullet = Bullet.create(this.getBulletID(), direction, team, type, tankGunId);
            bullet.setLocalZOrder(ZORDER_GROUND);
            bullet.setGameObjectString(STRING_BULLET);
            parent.addChild(bullet);
            bullet.setPosition(position);
            this.addBullet(bullet);
            return bullet;
        } else {
            LogUtils.getInstance().error([this.getClassName(), "spawnBullet with parent null"]);
            return null;
        }
    },
    addBullet: function (bullet) {
        this.getMAPSprites()[bullet.getID()] = bullet;
        //LogUtils.getInstance().log([this.getClassName(), "addBullet with id", bullet.getID()]);
    },
    removeBullet: function (id) {
        if (this.getMAPSprites()[id] != null) {
            this.getMAPSprites()[id] = null;
            //LogUtils.getInstance().log([this.getClassName(), "removeBullet id", id]);
        }
    },
    updateBaseFactory: function (rootNode, team, type) {
        LogUtils.getInstance().log([this.getClassName(), "updateBase team", team, "type", type]);
        if (rootNode != null) {
            var obj = new Base(this.getBaseID(), rootNode, team, type);
            obj.setLocalZOrder(ZORDER_GROUND);
            obj.setGameObjectString(STRING_BASE);
            this.addBase(obj);
            return obj;
        } else {
            LogUtils.getInstance().error([this.getClassName(), "updateBase with rootNode null"]);
            return null;
        }
    },
    addBase: function (spr) {
        this.getMAPSprites()[spr.getID()] = spr;
        LogUtils.getInstance().log([this.getClassName(), "addBase with id", spr.getID()]);
    },
    removeBase: function (id) {
        if (this.getMAPSprites()[id] != null) {
            this.getMAPSprites()[id] = null;
            LogUtils.getInstance().log([this.getClassName(), "removeBase id", id]);
        }
    },
    updateObstacleFactory: function (rootNode, type) {
        LogUtils.getInstance().log([this.getClassName(), "updateObstacle type", type]);
        if (rootNode != null) {
            var obj = new Obstacle(this.getObstacleID(), rootNode, type);
            obj.setLocalZOrder(ZORDER_GROUND);
            obj.setGameObjectString(STRING_OBSTACLE);
            this.addObstacle(obj);
            return obj;
        } else {
            LogUtils.getInstance().error([this.getClassName(), "updateObstacle with rootNode null"]);
            return null;
        }
    },
    addObstacle: function (spr) {
        this.getMAPSprites()[spr.getID()] = spr;
        LogUtils.getInstance().log([this.getClassName(), "addObstacle with id", spr.getID()]);
    },
    removeObstacle: function (id) {
        if (this.getMAPSprites()[id] != null) {
            this.getMAPSprites()[id] = null;
            LogUtils.getInstance().log([this.getClassName(), "removeObstacle id", id]);
        }
    },
    setTextEndBattle: function (t) {
        this._textEndBattle = t;
    },
    getTextEndBattle: function () {
        return this._textEndBattle;
    },

    showTextEndBattle: function () {
        if(this.getTextEndBattle() != null) {
            this.getTextEndBattle().removeFromParent(true);
            this.setTextEndBattle(null);
        }
        var teamWin = gv.engine.getBattleMgr().getPlayerMgr().getTeamWin();
        if(gv.engine.getBattleMgr().getPlayerMgr().isMyTeam(teamWin)){
            gv.engine.getSoundMusicMgr().playSoundEffect(resSoundMusic.SOUNDS__SOUND__WIN);
        }else{
            gv.engine.getSoundMusicMgr().playSoundEffect(resSoundMusic.SOUNDS__SOUND__LOSE);
        }
        var path;
        var matchResult = gv.engine.getBattleMgr().getBattleDataModel().getBattleResult();
        switch (matchResult) {
            case MATCH_RESULT_TEAM_1_WIN:
                path = resImg.RESOURCES__TEXTURES__STRINGS__TEAM1WIN_PNG;
                break;
            case MATCH_RESULT_TEAM_2_WIN:
                path = resImg.RESOURCES__TEXTURES__STRINGS__TEAM2WIN_PNG;
                break;
            case MATCH_RESULT_DRAW:
                path = resImg.RESOURCES__TEXTURES__STRINGS__DRAW_PNG;
                break;
            case MATCH_RESULT_BAD_DRAW:
                path = resImg.RESOURCES__TEXTURES__STRINGS__BADDRAW_PNG;
                break;
            case MATCH_RESULT_NOT_FINISH:
                path = resImg.RESOURCES__TEXTURES__STRINGS__BADDRAW_PNG;
                break;
            default :
                path = resImg.RESOURCES__TEXTURES__STRINGS__BADDRAW_PNG;
                break;
        }
        var sprText = Utility.getInstance().createSpriteFromFileName(path);
        gv.engine.getLayerMgr().getLayerById(LAYER_ID.POPUP).addChild(sprText);
        sprText.setPosition(gv.WIN_SIZE.width / 2, gv.WIN_SIZE.height / 2);
        this.setTextEndBattle(sprText);
    },
    spawnPowerUpFactory: function () {
        //LogUtils.getInstance().log([this.getClassName(), "spawnPowerUpFactory"]);
        var availableInfo = gv.engine.getBattleMgr().getMatchMgr().getAvailableInfoSpawnPowerUp();
        if (availableInfo != null) {
            var powerUp = new PowerUp(this.getPowerUpID(), availableInfo.type, availableInfo.mapIdx);
            powerUp.setGameObjectString(STRING_POWER_UP);
            powerUp.setLocalZOrder(ZORDER_GROUND);
            var parent = gv.engine.getBattleMgr().getMapMgr().getMapBackgroundObj();
            parent.addChild(powerUp);
            this.addPowerUp(powerUp);
            return powerUp;
        } else {
            LogUtils.getInstance().log([this.getClassName(), "spawnPowerUpFactory not getAvailableInfoSpawnPowerUp"]);
            return null;
        }
    },
    addPowerUp: function (powerUp) {
        this.getMAPSprites()[powerUp.getID()] = powerUp;
        LogUtils.getInstance().log([this.getClassName(), "addPowerUp with id", powerUp.getID()]);
    },
    removePowerUp: function (id) {
        if (this.getMAPSprites()[id] != null) {
            this.getMAPSprites()[id] = null;
            LogUtils.getInstance().log([this.getClassName(), "removePowerUp id", id]);
        }
    },
    spawnStrikeFactory: function (team, type) {
        var parent = gv.engine.getBattleMgr().getMapMgr().getMapBackgroundObj();
        var strike = new Strike(this.getStrikeID(), team, type);
        strike.setGameObjectString(STRING_STRIKE);
        strike.setLocalZOrder(ZORDER_SKY);
        parent.addChild(strike);
        this.addStrike(strike);
        gv.engine.getSoundMusicMgr().playSoundEffectById(SOUND_AIRSTRIKE);
        LogUtils.getInstance().log([this.getClassName(), "spawnStrikeFactory", team, type, strike.getID()]);
        return strike;
    },
    addStrike: function (strike) {
        this.getMAPSprites()[strike.getID()] = strike;
        LogUtils.getInstance().log([this.getClassName(), "addStrike with id", strike.getID()]);
    },
    removeStrike: function (id) {
        if (this.getMAPSprites()[id] != null) {
            this.getMAPSprites()[id] = null;
            LogUtils.getInstance().log([this.getClassName(), "removeStrike id", id]);
        }
    },
    pushTankIDNotUse: function (id) {
        gv.engine.getBattleMgr().getBattleDataModel().getListTankIDNotUse().push(id);
    },
    pushBaseIDNotUse: function (id) {
        gv.engine.getBattleMgr().getBattleDataModel().getListBaseIDNotUse().push(id);
    },
    pushObstacleNotUse: function (id) {
        gv.engine.getBattleMgr().getBattleDataModel().getListObstacleNotUse().push(id);
    },
    removeAllTank: function () {
        var _this = this;
        var list = gv.engine.getBattleMgr().getBattleDataModel().getListTankIDNotUse();
        list = list.concat(gv.engine.getBattleMgr().getMatchMgr().getListTankID());
        list.forEach(function (id) {
            var obj = _this.getGameObjectByIDFactory(id);
            obj.removeSelf();
        });
        gv.engine.getBattleMgr().getBattleDataModel().setListTankIDNotUse([]);
        gv.engine.getBattleMgr().getMatchMgr().setListTankID([]);
    },
    removeAllPowerUp: function () {
        var _this = this;
        var list = gv.engine.getBattleMgr().getMatchMgr().getListPowerUpID();
        list.forEach(function (id) {
            var obj = _this.getGameObjectByIDFactory(id);
            obj.destroy();
        });
        gv.engine.getBattleMgr().getMatchMgr().setListPowerUpID([]);
    },
    removeAllSmoke: function () {
        var list = gv.engine.getBattleMgr().getBattleDataModel().getListEffectSmoke();
        list.forEach(function (smoke) {
            smoke.removeFromParent(true);
        });
        gv.engine.getBattleMgr().getBattleDataModel().setListEffectSmoke([]);
    },
    removeTextEndBattle: function () {
        if(this.getTextEndBattle() != null) {
            this.getTextEndBattle().removeFromParent(true);
            this.setTextEndBattle(null);
        }
    },
    respawnAllBase: function () {
        var _this = this;
        var list = gv.engine.getBattleMgr().getBattleDataModel().getListBaseIDNotUse();
        list.forEach(function (id) {
            var obj = _this.getGameObjectByIDFactory(id);
            obj.respawnSelf();
        });
    },
    respawnAllObstacle: function () {
        var list = gv.engine.getBattleMgr().getBattleDataModel().getListObstacleNotUse();
        list.forEach(function (obj) {
            obj.respawnSelf();
        });
    }
});