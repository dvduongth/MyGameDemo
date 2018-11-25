"use strict";
var SceneLoading = BaseScene.extend({
    _className: "SceneLoading",
    ctor: function () {
        //todo ccs element
        this.btnClose = null;
        this._super(resJson.ZCCS__SCENE__LOADING__SCENELOADING);
    },
    initScene: function () {
        LogUtils.getInstance().log([this.getClassName(), "initScene success"]);
        gv.engine.getLayerMgr().viewGUIById(GUI_ID.LOADING, gv.engine.getLayerMgr().getLayerById(LAYER_ID.LOADING));
        var guiLoading = gv.engine.getLayerMgr().getGUIByIdIfExist(GUI_ID.LOADING);
        if (guiLoading != null) {
            //set callback loading done
            guiLoading.setLoadingDoneCallback(function () {
                guiLoading.runAction(cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function () {
                        guiLoading.destroy();
                        gv.engine.viewSceneLogin();
                    })
                ));
            });
            //start load for cache data
            /*guiLoading.loadTextures(resImgList, function () {
                guiLoading.loadPlistTextures(resPlist, function () {
                    guiLoading.loadSoundMusic(resSoundMusic, guiLoading.getLoadingDoneCallback());
                });
            });*/
        } else {
            LogUtils.getInstance().error([this.getClassName(), "guiLoading is null"]);
        }
    },

    onTouchUIEndEvent: function (sender) {
        switch (sender) {
            case this.btnClose:
                gv.engine.end();
                break;
        }
    }
});