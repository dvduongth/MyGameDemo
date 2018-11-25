'use strict';

var g_resources = [];
var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;

var Enum = function (enumName) {
    if(enumName === undefined){
        enumName = "ENUM";
    }
    LogUtils.getInstance().log(["create enum", enumName]);
    this._enumCount = 0;
    this.getNextEnum = function () {
        return this._enumCount++;
    };
    this.getCount = function () {
        return this._enumCount;
    };
    this.toEnumStringByValue = function (value) {
        for(var x in this){
            if(this[x] instanceof Function){
                continue;
            }
            if(this[x] == value) {
                //LogUtils.getInstance().log([enumName,  "toEnumStringByValue", x + " = " + this[x]]);
                return x + "";
            }
        }
        LogUtils.getInstance().error([enumName, "unknown property with value", value]);
        return false;
    };
    this.toEnumString = function () {
        for(var x in this){
            if(this[x] instanceof Function){
                continue;
            }
            LogUtils.getInstance().log(enumName + "." + x + " = " + this[x]);
        }
    };
    return this;
};

var gv = gv || {};
gv.DESIGN_SIZE = cc.size(1242, 2208);
gv.engine = null;
gv.WIN_SIZE = null;
