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
    getGameObjectByIDFactory: function (id) {
        return this.getMAPSprites()[id];
    },

    throwTankFactory: function (parent, position, team, type) {
        LogUtils.getInstance().log([this.getClassName(), "throwTank team", team, "type", type]);
        if (parent != null) {
            var tank = new Tank(this.getTankID(), team, type);
            tank.setLocalZOrder(ZORDER_FORCE_GROUND);
            tank.setGameObjectString(STRING_TANK);
            parent.addChild(tank);
            tank.setPosition(position);
            this.addTank(tank);
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
    showTextEndBattle: function () {
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
    }
});