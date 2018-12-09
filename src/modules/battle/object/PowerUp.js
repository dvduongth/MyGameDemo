var PowerUp = cc.Sprite.extend({
    _className: "PowerUp",
    getClassName: function () {
        return this._className;
    },
    ctor: function (id, type, mapIdx) {
        this.setID(id);
        this.setType(type);
        this.setMapPointIndex(mapIdx);
        var path;
        switch (type) {
            case POWERUP_AIRSTRIKE:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRSTRIKE_PNG);
                break;
            case POWERUP_EMP:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__EMP_PNG);
                break;
            default :
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRSTRIKE_PNG);
                break;
        }
        this._super(path);
        this.initPowerUp();
    },
    setID: function (id) {
        this._ID = id;
    },
    getID: function () {
        return this._ID;
    },
    setType: function (t) {
        this._type = t;
    },
    getType: function () {
        return this._type;
    },
    setGameObjectString: function (l) {
        this._gameObjectString = l;
    },
    getGameObjectString: function () {
        return this._gameObjectString;
    },
    setMapPointIndex: function (t) {
        this._mapPointIndex = t;
    },
    getMapPointIndex: function () {
        return this._mapPointIndex;
    },
    setInActive: function (t) {
        this._isInActive = t;
        this.setVisible(t);
    },
    isInActive: function () {
        return this._isInActive;
    },
    initPowerUp: function () {
        this.spawn(this.getType(), this.getMapPointIndex());
        this.setGameObjectString(STRING_POWER_UP);
        this.setLocalZOrder(ZORDER_GROUND);
    },
    spawn: function (type, mapIdx) {
        this.setInActive(true);
        this.setListTileLogicPointIndex([]);

    },
    runEffectAppear: function () {
        gv.engine.getSoundMusicMgr().PlaySoundById(SOUND_BULLETIMPACT);
        var args = {};
        args["animationName"] = "eff_appear_fall_down";
        args["animationRun"] = "run";
        args["pos"] = this.getWorldPosition();
        args["pos"].y += this.getContentSize().height;
        var eff = gv.engine.getEffectMgr().playEffectDragonBones(args);
    },
    checkForCollision: function () {
        if(!this.isInActive()) {
            return false;
        }
        return false;//todo test edit after
        // Check collision with any tanks.
        for (var i = 0; i < game.m_tanks[Enum.TEAM_1].length; i++) {
            var tempTank = game.m_tanks[Enum.TEAM_1][i];
            if (tempTank == null || tempTank.m_HP == 0) continue;
            if (Math.abs(instance.m_x - tempTank.m_x) < 1 && Math.abs(instance.m_y - tempTank.m_y) < 1) {
                instance.m_active = 0;
                instance.m_dirty = true;
                instance.m_x = -1;
                instance.m_y = -1;

                game.AcquirePowerup(Enum.TEAM_1, instance.m_type);

                return;
            }
        }

        for (var i = 0; i < game.m_tanks[Enum.TEAM_2].length; i++) {
            var tempTank = game.m_tanks[Enum.TEAM_2][i];
            if (tempTank == null || tempTank.m_HP == 0) continue;
            if (Math.abs(instance.m_x - tempTank.m_x) < 1 && Math.abs(instance.m_y - tempTank.m_y) < 1) {
                instance.m_active = 0;
                instance.m_dirty = true;
                instance.m_x = -1;
                instance.m_y = -1;

                game.AcquirePowerup(Enum.TEAM_2, instance.m_type);

                return;
            }
        }
    },
    getWorldPosition: function () {
        return this.getParent().convertToWorldSpace(this.getPosition());
    },
    setGameObjectSizeNumberPoint: function (l) {
        this._gameObjectSizeNumberPoint = l;
    },
    getGameObjectSizeNumberPoint: function () {
        return this._gameObjectSizeNumberPoint;
    },
    setStartTileLogicPointIndex: function (l) {
        this._startTileLogicPointIndex = l;
    },
    getStartTileLogicPointIndex: function () {
        return this._startTileLogicPointIndex;
    },
    setListTileLogicPointIndex: function (l) {
        this._listTileLogicPointIndex = l;
    },
    getListTileLogicPointIndex: function () {
        return this._listTileLogicPointIndex;
    },
    pushTileLogicPointIndex: function (t) {
        this.getListTileLogicPointIndex().push(t);
    },
    updateLocationByWorldPosition: function (wPos) {
        var parent = this.getParent();
        var nPos = parent.convertToNodeSpace(wPos);
        this.setAnchorPoint(cc.p(0.5, 0.5));
        this.setPosition(nPos);
    },
    clearListTileLogicPointIndex: function () {
        var id = this.getID();
        var list = this.getListTileLogicPointIndex();
        list.forEach(function (c) {
            var tileLogic = gv.engine.getBattleMgr().getMapMgr().getTileLogicByTilePointIndex(c);
            if(tileLogic != null) {
                tileLogic.removeGameObjectIDOnTile(id);
            }
        });
        this.setListTileLogicPointIndex([]);
    }
});