"use strict";
/**
* MatchManager manage game logic
* */
var MatchManager = cc.Class.extend({
    _className: "MatchManager",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setPauseGame(false);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setPauseGame: function (eff) {
        this._isPauseGame = eff;
    },
    isPauseGame: function () {
        return this._isPauseGame;
    },
    checkLogicWinKnockoutKillAllTank: function (id, team) {
        if(gv.engine.getBattleMgr().getPlayerMgr().isKnockoutKillAllTank(id)){
            var teamWin = team == TEAM_1 ? TEAM_2 : TEAM_1;
            gv.engine.getBattleMgr().getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.setPauseGame(true);
            gv.engine.getBattleMgr().showWinGame();
        }
        gv.engine.getBattleMgr().getPlayerMgr().removeTankID(id);
    },
    checkLogicWinKnockoutKillMainBase: function (id, team) {
        if(gv.engine.getBattleMgr().getPlayerMgr().isKnockoutKillMainBase(id)){
            var teamWin = team == TEAM_1 ? TEAM_2 : TEAM_1;
            gv.engine.getBattleMgr().getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.setPauseGame(true);
            gv.engine.getBattleMgr().showWinGame();
        }
        gv.engine.getBattleMgr().getPlayerMgr().removeBaseID(id);
    },

    checkLogicCollisionTankWithBarrier: function (id) {
        var m = gv.engine.getBattleMgr().getBattleFactory().getMAPSprites();
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
    checkLogicCollisionBulletWithTarget: function (id) {
        var m = gv.engine.getBattleMgr().getBattleFactory().getMAPSprites();
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
    }
});