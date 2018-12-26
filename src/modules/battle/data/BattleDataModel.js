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
        this.initBattleData();
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    initBattleData: function () {
        this.setTimeCountdownBattle(0);
        this.setListTankIDNotUse([]);
        this.setListBaseIDNotUse([]);
        this.setListObstacleNotUse([]);
        this.setListEffectSmoke([]);
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
    },
    setListTankIDNotUse: function (t) {
        this._listTankIDNotUse = t;
    },
    getListTankIDNotUse: function () {
        return this._listTankIDNotUse;
    },
    setListBaseIDNotUse: function (t) {
        this._listBaseIDNotUse = t;
    },
    getListBaseIDNotUse: function () {
        return this._listBaseIDNotUse;
    },
    setListObstacleNotUse: function (t) {
        this._listObstacleNotUse = t;
    },
    getListObstacleNotUse: function () {
        return this._listObstacleNotUse;
    },
    setListEffectSmoke: function (t) {
        this._listEffectSmoke = t;
    },
    getListEffectSmoke: function () {
        return this._listEffectSmoke;
    },
    pushEffectSmoke: function (s) {
        this.getListEffectSmoke().push(s);
    }
});