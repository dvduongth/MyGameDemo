"use strict";
/**
 * BattleDataModel save all data from battleMgr and matchMgr, is separate data with playerMgr
 * */
var BattleDataModel = cc.Class.extend({
    _className: "BattleDataModel",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setListPickTank([]);
        this.setTimeCountdownBattle(0);
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
    setTimeCountdownBattle: function (t) {
        this._timeCountdownBattle = t;
    },
    getTimeCountdownBattle: function () {
        return this._timeCountdownBattle;
    },
    autoIncreaseTimeCountdownBattle: function () {
        this.setTimeCountdownBattle(this.getTimeCountdownBattle() + 1);
    },
    setBattleState: function (t) {
        this._battleState = t;
    },
    getBattleState: function () {
        return this._battleState;
    },
    setBattleResult: function (t) {
        this._battleResult = t;
    },
    getBattleResult: function () {
        return this._battleResult;
    },
    setSpawnPowerUpCountDown: function (t) {
        this._spawnPowerUpCountDown = t;
    },
    getSpawnPowerUpCountDown: function () {
        return this._spawnPowerUpCountDown;
    },
    resetSpawnPowerUpCountDown: function () {
        this.setSpawnPowerUpCountDown(0);
    },
    autoIncreaseSpawnPowerUpCountDown: function () {
        this.setSpawnPowerUpCountDown(this.getSpawnPowerUpCountDown() + 1);
    }
});