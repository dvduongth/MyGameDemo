"use strict";
var SceneLogin = BaseScene.extend({
    _className: "SceneLogin",
    ctor: function () {
        //todo ccs element
        this.btnLogin = null;
        this.btnClose = null;
        this._super(resJson.ZCCS__SCENE__LOGIN__SCENELOGIN);
    },
    initScene: function () {
        LogUtils.getInstance().log([this.getClassName(), "initScene success"]);
        //this.createKeyBoardListener();
        //this.createTouchListenerOneByOne();
    },
    onKeyPressed: function (keyCode, event) {
        LogUtils.getInstance().log(this.getClassName() + " onKeyPressed: " + keyCode);
        var args = {
            text: this.getClassName() + " onKeyPressed: " + keyCode,
            isSkipRetain: true,
            moveOffset: cc.p(Math.random() > 0.5 ? 200 : -200, 500)
        };
        Utility.getInstance().showTextOnScene(args);
        var eff = gv.engine.getEffectMgr().playEffectDragonBones("eff_appear_fall_down");
    },
    onKeyReleased: function (keyCode, event) {
        LogUtils.getInstance().log(this.getClassName() + " onKeyReleased: " + keyCode);
        var args = {
            text: this.getClassName() + " onKeyReleased: " + keyCode,
            isSkipRetain: true,
            moveOffset: cc.p(Math.random() > 0.5 ? 200 : -200, 500)
        };
        Utility.getInstance().showTextOnScene(args);
        //gv.engine.getBattleMgr().getPlayerMgr().setTeamWin(TEAM_1);
        //gv.engine.getBattleMgr().endBattle();
    },
    onTouchBegan: function (touch, event) {
        LogUtils.getInstance().log(this.getClassName() + " onTouchBegan");
        //var explosion = gv.engine.getEffectMgr().showExplosion(touch.getLocation(), EXPLOSION_TANK);
        //explosion.setCompleteCallback(function () {
        //    explosion.removeFromParent(true);
        //});
        //var fx = gv.engine.getEffectMgr().showEffectHandSlide(touch.getLocation(), false);
        //var fx = gv.engine.getEffectMgr().showEffectHandTouch(touch.getLocation(), true);
        //var smoke = gv.engine.getEffectMgr().showEffectSmoke(touch.getLocation());
        //gv.engine.getEffectMgr().showEffectCountDown(15);
        //gv.engine.getBattleMgr().getBattleFactory().showTextCountdownRestartBattle(function () {
        //    LogUtils.getInstance().error("test done");
        //});
        return true;
    },

    onTouchMoved: function (touch, event) {
        //LogUtils.getInstance().log(this.getClassName() + " onTouchMoved");
        return true;
    },

    onTouchEnded: function (touch, event) {
        //LogUtils.getInstance().log(this.getClassName() + " onTouchEnded");
        return true;
    },

    onTouchCancelled: function (touch, event) {
        //LogUtils.getInstance().log(this.getClassName() + " onTouchCancelled");
        return true;
    },
    onTouchUIEndEvent: function (sender) {
        switch (sender) {
            case this.btnLogin:
                gv.engine.viewSceneLobby();
                break;
            case this.btnClose:
                gv.engine.end();
                break;
        }
    }
});

