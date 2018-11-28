"use strict";
/**
* MatchMgr manage game logic
* */
var MatchMgr = cc.Class.extend({
    _className: "MatchMgr",
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
                if(_id.indexOf(STRING_OBSTACLE) != -1) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with obstacle"]);
                        return true;
                    }
                }
                //check collision with base
                if(_id.indexOf(STRING_BASE) != -1) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with base"]);
                        return true;
                    }
                }
                //other tank
                if(_id.indexOf(STRING_TANK) != -1) {
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
                if(_id.indexOf(STRING_OBSTACLE) != -1 && sprObj.isBarrier()) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
                //check collision with base
                if(_id.indexOf(STRING_BASE) != -1) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
                //other tank
                if(_id.indexOf(STRING_TANK) != -1) {
                    if(Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)){
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
            }
        }
        return isCollision;
    },
    getGameObjectInfoByWorldPosition: function (worldPos) {
        var m = gv.engine.getBattleMgr().getBattleFactory().getMAPSprites();
        var target, _id;
        for (var i in m) {
            _id = i + "";
            target = m[_id];
            if (target != null) {
                var locationInNode = target.convertToNodeSpace(worldPos);
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                var isCorrect = cc.rectContainsPoint(rect, locationInNode);
                if (isCorrect) {
                    return {
                        ID: target.getID(),
                        type: target.getType(),
                        gameObject: target
                    };
                }
            }
        }
        return null;
    }
});