'use strict';

var BattleMgr = cc.Class.extend({
    _className: "BattleMgr",
    _autoID: 0,
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setMAPTankSpr({});
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setMAPTankSpr: function (m) {
        this._mapTankSpr = m;
    },
    getMAPSprites: function () {
        return this._mapTankSpr;
    },

    update: function (dt) {
        var spr = this.getMAPSprites();
        for (var t in spr) {
            if (spr[t] != null) {
                spr[t].update(dt);
            }
        }
    },
    getTankID: function () {
        return "tank_" + (this._autoID++);
    },
    getBulletID: function () {
        return "bullet_" + (this._autoID++);
    },
    throwTank: function (parent, position, team, type) {
        LogUtils.getInstance().log([this.getClassName(), "throwTank team", team, "type", type]);
        if (parent != null) {
            var tank = new Tank(this.getTankID(), team, type);
            parent.addChild(tank);
            tank.setPosition(position);
            this.addTank(tank);
        } else {
            LogUtils.getInstance().error([this.getClassName(), "throwTank with parent null"]);
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

    spawnBullet: function (parent, position, direction, team, type) {
        //LogUtils.getInstance().log([this.getClassName(), "spawnBullet direction", direction]);
        if (parent != null) {
            var bullet = new Bullet(this.getBulletID(), direction, team, type);
            parent.addChild(bullet);
            bullet.setPosition(position);
            this.addBullet(bullet);
        } else {
            LogUtils.getInstance().error([this.getClassName(), "spawnBullet with parent null"]);
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
    getBaseID: function () {
        return "base_" + (this._autoID++);
    },
    updateBase: function (rootNode, team, type) {
        LogUtils.getInstance().log([this.getClassName(), "updateBase team", team, "type", type]);
        if (rootNode != null) {
            var obj = new Base(this.getBaseID(), rootNode, team, type);
            this.addBase(obj);
        } else {
            LogUtils.getInstance().error([this.getClassName(), "updateBase with rootNode null"]);
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

    getObstacleID: function () {
        return "obstacle_" + (this._autoID++);
    },
    updateObstacle: function (rootNode, type) {
        LogUtils.getInstance().log([this.getClassName(), "updateObstacle type", type]);
        if (rootNode != null) {
            var obj = new Obstacle(this.getObstacleID(), rootNode, type);
            this.addObstacle(obj);
        } else {
            LogUtils.getInstance().error([this.getClassName(), "updateObstacle with rootNode null"]);
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

});