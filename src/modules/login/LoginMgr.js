'use strict';

var LoginMgr = cc.Class.extend({
    _className: "LoginMgr",
    getClassName: function(){
        return this._className;
    },
    ctor: function () {
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },

});