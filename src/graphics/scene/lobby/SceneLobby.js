"use strict";
var SceneLobby = BaseScene.extend({
    _className: 'SceneLobby',
    ctor: function(){
        //todo ccs element
        this.btnPlayNow = null;
        this.btnClose = null;
        this._super(resJson.ZCCS__SCENE__LOBBY__SCENELOBBY);
    },
    initScene: function () {
        LogUtils.getInstance().log([this.getClassName(), "initScene success"]);
    },
    onTouchUIEndEvent: function (sender) {
        switch (sender) {
            case this.btnPlayNow:
                gv.engine.viewSceneBattle();
                break;
            case this.btnClose:
                gv.engine.end();
                break;
        }
    }
});

