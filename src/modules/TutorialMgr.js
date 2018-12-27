'use strict';

var TutorialMgr = cc.Class.extend({
    _className: "TutorialMgr",
    getClassName: function(){
        return this._className;
    },
    ctor: function () {
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    showTipsDragThrowTankForPlay: function () {
        var sceneBattle = gv.engine.getSceneBattleIfExist();
        var listWPos = sceneBattle.getListWorldPositionPickTankSlot();
        var wPos = listWPos[Utility.getInstance().randomBetweenRound(0, listWPos.length - 1)];
        var fx = gv.engine.getEffectMgr().showEffectHandSlide(wPos, false);
    }
});