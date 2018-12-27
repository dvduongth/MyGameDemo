"use strict";
var Base = BaseGameObject.extend({
    _className: "Base",
    ctor: function (id, rootNode, team, type) {
        //super
        this._super(id, rootNode, team, type);
        this.initBase();
    },
    setHP: function (value) {
        this._super(value);
        var percent = Math.round(100 * value / this.getHPMax());
        this.getHPDisplayProgress().setPercent(percent);
    },
    initBase: function () {
        this.createHPDisplayProgress();
        this.initStartDisplay();
    },
    initStartDisplay: function () {
        switch (this.getType()) {
            case BASE_MAIN:
                this.setHPMax(Setting.BASE_MAIN_HP);
                this.setHP(Setting.BASE_MAIN_HP);
                switch (this.getTeam()) {
                    case TEAM_1:
                        Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__BASE__TEAM___1__MAINBASE_PNG);
                        break;
                    case TEAM_2:
                        Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__BASE__TEAM___2__MAINBASE_PNG);
                        break;
                }
                break;
            case BASE_SIDE:
                this.setHPMax(Setting.BASE_SIDE_HP);
                this.setHP(Setting.BASE_SIDE_HP);
                switch (this.getTeam()) {
                    case TEAM_1:
                        Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__BASE__TEAM___1__SIDEBASE_PNG);
                        break;
                    case TEAM_2:
                        Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__BASE__TEAM___2__SIDEBASE_PNG);
                        break;
                }
                break;
        }
    },
    setObjectProgressDisplay: function (o) {
        this._objectProgressDisplay = o;
    },
    getObjectProgressDisplay: function () {
        return this._objectProgressDisplay;
    },
    createHPDisplayProgress: function () {
        var progressBg = this._super();
        //progressBg.setScale(0.4);
        this.setObjectProgressDisplay(progressBg);
    },
    destroy: function () {
        var worldPos = this.getWorldPosition();
        var explosion = gv.engine.getEffectMgr().showExplosion(worldPos, EXPLOSION_TANK);
        explosion.setCompleteCallback(function () {
            explosion.removeFromParent(true);
        });
        var smoke = gv.engine.getEffectMgr().showEffectSmoke(cc.p(worldPos.x, worldPos.y - this.getContentSize().height / 2));
        smoke.setScale(2);
        gv.engine.getBattleMgr().getBattleDataModel().pushEffectSmoke(smoke);
        var path = null;
        switch (this.getType()) {
            case BASE_MAIN:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = resImg.RESOURCES__TEXTURES__BASE__TEAM___1__MAINBASED_PNG;
                        break;
                    case TEAM_2:
                        path = resImg.RESOURCES__TEXTURES__BASE__TEAM___2__MAINBASED_PNG;
                        break;
                }
                break;
            case BASE_SIDE:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = resImg.RESOURCES__TEXTURES__BASE__TEAM___1__SIDEBASED_PNG;
                        break;
                    case TEAM_2:
                        path = resImg.RESOURCES__TEXTURES__BASE__TEAM___2__SIDEBASED_PNG;
                        break;
                }
                break;
        }
        if (path != null) {
            Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), path);
            this.getObjectProgressDisplay().setVisible(false);
        }
        if (this.getType() == BASE_MAIN) {
            gv.engine.getBattleMgr().checkWinKnockoutKillMainBase(this.getID(), this.getTeam());
        }else{
            //Check win-lost in SuddenDeath mode
            if (gv.engine.getBattleMgr().getMatchMgr().isDuringSuddenDeadBattle()) {
                LogUtils.getInstance().log([this.getClassName(), "destroy base isDuringSuddenDeadBattle"]);
                gv.engine.getBattleMgr().checkWinKnockoutKillMainBase(this.getID(), this.getTeam());
            }
        }
        gv.engine.getBattleMgr().removeBase(this.getID());
    },
    respawnSelf: function () {
        //check alive
        if(!this.isAlive()) {
            gv.engine.getBattleMgr().getMatchMgr().pushBaseID(this.getID());
        }
        this.initStartDisplay();
        this.getObjectProgressDisplay().setVisible(true);
    }
});