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
        this.createKeyBoardListener();
        this.createTouchListenerOneByOne();
    },
    onKeyPressed: function (keyCode, event) {
        LogUtils.getInstance().log(this.getClassName() + " onKeyPressed: " + keyCode);
        var args = {
            text: this.getClassName() + " onKeyPressed: " + keyCode,
            isSkipRetain: true,
            moveOffset: cc.p(Math.random() > 0.5 ? 200 : -200, 500)
        };
        Utility.getInstance().showTextOnScene(args);
    },
    onKeyReleased: function (keyCode, event) {
        LogUtils.getInstance().log(this.getClassName() + " onKeyReleased: " + keyCode);
        var args = {
            text: this.getClassName() + " onKeyReleased: " + keyCode,
            isSkipRetain: true,
            moveOffset: cc.p(Math.random() > 0.5 ? 200 : -200, 500)
        };
        Utility.getInstance().showTextOnScene(args);
    },
    onTouchBegan: function (touch, event) {
        LogUtils.getInstance().log(this.getClassName() + " onTouchBegan");
        return true;
    },

    onTouchMoved: function (touch, event) {
        LogUtils.getInstance().log(this.getClassName() + " onTouchMoved");
        return true;
    },

    onTouchEnded: function (touch, event) {
        LogUtils.getInstance().log(this.getClassName() + " onTouchEnded");
        return true;
    },

    onTouchCancelled: function (touch, event) {
        LogUtils.getInstance().log(this.getClassName() + " onTouchCancelled");
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

