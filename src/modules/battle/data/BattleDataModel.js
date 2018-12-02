"use strict";
/**
 * BattleDataModel save all data from battleMgr and matchMgr
 * */
var BattleDataModel = cc.Class.extend({
    _className: "BattleDataModel",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setListPickTank([]);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    getNumberPickedTank: function () {
        return this.getListPickTank().length;
    },
    setListPickTank: function (l) {
        this._listPickTank = l;
    },
    getListPickTank: function () {
        return this._listPickTank;
    },
    addPickedTankID: function (id) {
        this.getListPickTank().push(id);
    },
    setCurrentSelectedTankID: function (t) {
        this._currentSelectedTankID = t;
    },
    getCurrentSelectedTankID: function () {
        return this._currentSelectedTankID;
    },
});