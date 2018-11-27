'use strict';
/**
 * BattleMgr quan ly viec phan bo nhiem vu cho mgr thich hop
 * MatchMgr quan ly logic game
 * PlayerMgr quan ly thong tin nguoi choi
 * BattleFactory quan ly tai nguyen, du lieu, va doi tuong trong battle
 * */
var BattleMgr = cc.Class.extend({
    _className: "BattleMgr",
    _autoID: 0,
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setMAPTankSpr({});
        this.setPauseGame(false);
        this.setPlayerMgr(new PlayerMgr());
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setPlayerMgr: function (m) {
        this._playerMgr = m;
    },
    getPlayerMgr: function () {
        return this._playerMgr;
    },
    setMAPTankSpr: function (m) {
        this._mapTankSpr = m;
    },
    getMAPSprites: function () {
        return this._mapTankSpr;
    },
    setPauseGame: function (eff) {
        this._isPauseGame = eff;
    },
    isPauseGame: function () {
        return this._isPauseGame;
    },

    update: function (dt) {
        if(this.isPauseGame()) {
            return false;//todo during pause
        }
        var m = this.getMAPSprites();
        for (var t in m) {
            if (m[t] != null) {
                m[t].update(dt);
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
            this.getPlayerMgr().addTankIDForTeam(tank.getID(), team, type);
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

    spawnBullet: function (parent, position, direction, team, type, tankGunId) {
        //LogUtils.getInstance().log([this.getClassName(), "spawnBullet direction", direction]);
        if (parent != null) {
            var bullet = new Bullet(this.getBulletID(), direction, team, type, tankGunId);
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
            this.getPlayerMgr().addBaseIDForTeam(obj.getID(), team, type);
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
    checkCollisionTankWithBarrier: function (id) {
        var m = this.getMAPSprites();
        var curSpr = m[id];
        var sprObj, _id;
        for (var i in m) {
            _id = i + "";
            sprObj = m[_id];
            if (sprObj != null && _id != id) {
                //check collision with obstacle
                if(_id.indexOf("obstacle") != -1) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with obstacle"]);
                        return true;
                    }
                }
                //check collision with base
                if(_id.indexOf("base") != -1) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with base"]);
                        return true;
                    }
                }
                //other tank
                if(_id.indexOf("tank") != -1) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with other tank"]);
                        return true;
                    }
                }
            }
        }
        return false;
    },
    checkCollisionBulletWithTarget: function (id) {
        var m = this.getMAPSprites();
        var curSpr = m[id];
        var tankGunID = curSpr.getTankGunID();
        var sprObj, _id;
        var isCollision = false;
        for (var i in m) {
            _id = i + "";
            sprObj = m[_id];
            if (sprObj != null && _id != id && _id != tankGunID) {
                //check collision with obstacle
                if(_id.indexOf("obstacle") != -1 && sprObj.isBarrier()) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
                //check collision with base
                if(_id.indexOf("base") != -1) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
                //other tank
                if(_id.indexOf("tank") != -1) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
            }
        }
        return isCollision;
    },

    checkWinKnockoutKillMainBase: function (id, team) {
        if(this.getPlayerMgr().isKnockoutKillMainBase(id)){
            var teamWin = team == TEAM_1 ? TEAM_2 : TEAM_1;
            this.getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.setPauseGame(true);
            this.showWinGame();
        }
        this.getPlayerMgr().removeBaseID(id);
    },

    checkWinKnockoutKillAllTank: function (id, team) {
        if(this.getPlayerMgr().isKnockoutKillAllTank(id)){
            var teamWin = team == TEAM_1 ? TEAM_2 : TEAM_1;
            this.getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.setPauseGame(true);
            this.showWinGame();
        }
        this.getPlayerMgr().removeTankID(id);
    },

    showWinGame: function () {
        var path;
        switch (this.getPlayerMgr().getTeamWin()){
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