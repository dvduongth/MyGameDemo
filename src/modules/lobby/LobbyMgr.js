'use strict';

var LobbyMgr = cc.Class.extend({
    _className: "LobbyMgr",
    getClassName: function(){
        return this._className;
    },
    ctor: function () {
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },

});