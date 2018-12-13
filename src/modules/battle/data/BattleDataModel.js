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
        this.setListPickTank(TEAM_1, []);
        this.setListPickTank(TEAM_2, []);
        this.setTimeCountdownBattle(0);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    getNumberPickedTank: function (team) {
        return this.getListPickTank(team).length;
    },
    setListPickTank: function (team, l) {
        this["_listPickTank" + team] = l;
    },
    getListPickTank: function (team) {
        return this["_listPickTank" + team];
    },
    addPickedTankID: function (team, id) {
        this.getListPickTank(team).push(id);
    },
    setCurrentSelectedTankID: function (team, id) {
        this["_currentSelectedTankID" + team] = id;
    },
    getCurrentSelectedTankID: function (team) {
        return this["_currentSelectedTankID" + team];
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