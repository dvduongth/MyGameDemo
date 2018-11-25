'use strict';

var LoadingMgr = cc.Class.extend({
    _className: "LoadingMgr",
    getClassName: function(){
        return this._className;
    },
    ctor: function () {
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },

});