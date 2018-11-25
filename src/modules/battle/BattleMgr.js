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
        var tankSprMap = this.getMAPSprites();
        for (var t in tankSprMap) {
            if (tankSprMap[t] != null) {
                tankSprMap[t].update(dt);
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

});