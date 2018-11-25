'use strict';

var BattleMgr = cc.Class.extend({
    _className: "BattleMgr",
    getClassName: function(){
        return this._className;
    },
    ctor: function () {
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    throwTank: function (parent, position) {
        LogUtils.getInstance().log([this.getClassName(), "throwTank", position.x, position.y]);
    }

});