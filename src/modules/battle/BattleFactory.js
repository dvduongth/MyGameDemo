"use strict";
/**
 * BattleFactory manage generate game resource, save data
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
        return "tank_" + (this._autoID++);
    },
    getBulletID: function () {
        return "bullet_" + (this._autoID++);
    },
    getBaseID: function () {
        return "base_" + (this._autoID++);
    },
    getObstacleID: function () {
        return "obstacle_" + (this._autoID++);
    },
    getGameObjectByID: function (id) {
        return this.getMAPSprites()[id];
    },

    throwTankFactory: function (parent, position, team, type) {
        LogUtils.getInstance().log([this.getClassName(), "throwTank team", team, "type", type]);
        if (parent != null) {
            var tank = new Tank(this.getTankID(), team, type);
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
            var bullet = new Bullet(this.getBulletID(), direction, team, type, tankGunId);
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
    showTextWinGame: function (teamWin) {
        var path;
        switch (teamWin){
            case TEAM_1:
                path = resImg.RESOURCES__TEXTURES__STRINGS__TEAM1WIN_PNG;
                break;
            case TEAM_2:
                path = resImg.RESOURCES__TEXTURES__STRINGS__TEAM2WIN_PNG;
                break;
        }
        var sprText = Utility.getInstance().createSpriteFromFileName(path);
        gv.engine.getLayerMgr().getLayerById(LAYER_ID.POPUP).addChild(sprText);
        sprText.setPosition(gv.WIN_SIZE.width / 2, gv.WIN_SIZE.height / 2);
    }
});