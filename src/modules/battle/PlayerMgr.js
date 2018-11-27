'use strict';
/**
 * PlayerMgr manage player game state
 * */
var PlayerMgr = cc.Class.extend({
    _className: "PlayerMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setMAPGameObjectID({});
        this.setTeamWin(-1);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setMAPGameObjectID: function (m) {
        this._mapGameObjectID = m;
    },
    getMAPGameObjectID: function () {
        return this._mapGameObjectID;
    },
    addTankIDForTeam: function (id, team, type) {
        this.getMAPGameObjectID()[id] = {team: team, type: type};
    },
    getInfoOfTankID: function (id) {
        return this.getMAPGameObjectID()[id];
    },
    addBaseIDForTeam: function (id, team, type) {
        this.getMAPGameObjectID()[id] = {team: team, type: type};
    },
    getInfoOfBaseID: function (id) {
        return this.getMAPGameObjectID()[id];
    },
    removeTankID: function (id) {
        this.removeGameObjectID(id);
    },
    removeBaseID: function (id) {
        this.removeGameObjectID(id);
    },
    removeGameObjectID: function (id) {
        this.getMAPGameObjectID()[id] = null;
        delete this.getMAPGameObjectID()[id];
    },
    isKnockoutKillMainBase: function (id) {
        //var team = this.getTeamOfBaseID(id);
        return true;
    },
    isKnockoutKillAllTank: function (id) {
        var info = this.getInfoOfTankID(id);
        var map = this.getMAPGameObjectID();
        for(var _id in map) {
            var _info = map[_id];
            if(_info != null) {
                var isTankType = _info.type == TANK_LIGHT || _info.type == TANK_MEDIUM || _info.type == TANK_HEAVY;
                if((_id != id) && isTankType &&  _info.team == info.team){
                    //existed other tank alive
                    return false;
                }
            }
        }
        return true;
    },
    setTeamWin: function (t) {
        this._teamWin = t;
    },
    getTeamWin: function () {
        return this._teamWin;
    }
});