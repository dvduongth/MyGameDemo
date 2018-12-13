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
    setIsInActive: function (t) {
        this._isInActive = t;
        this.setVisible(t);
    },
    isInActive: function () {
        return this._isInActive;
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
    initPowerUp: function () {
        this.setListTileLogicPointIndex([]);
        this.spawn();
    },
    spawn: function () {
        this.setIsInActive(true);
    },
    runEffectAppear: function () {
        gv.engine.getSoundMusicMgr().playSoundEffect(resSoundMusic.SOUNDS__SOUND__APPEAR_POWER_UP);
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
        var collision = false;
        var powerUpID = this.getID();
        var listTilePointIdx = this.getListTileLogicPointIndex();
        for(var k = 0; k < listTilePointIdx.length; ++k) {
            var p = listTilePointIdx[k];
            var existedListId = gv.engine.getBattleMgr().getMapMgr().existedGameObjectOnTileAtTilePointIndex(p, powerUpID);
            if(existedListId) {
                for(var i = 0; i < existedListId.length; ++i) {
                    var id = existedListId[i];
                    var gObj = gv.engine.getBattleMgr().getGameObjectByID(id);
                    if(gObj != null) {
                        var str = gObj.getGameObjectString();
                        switch (str) {
                            case STRING_TANK:
                                if(gObj.isAlive()) {
                                    collision = true;
                                    gv.engine.getBattleMgr().getPlayerMgr().acquirePowerUp(gObj.getTeam(), powerUpID);
                                    break;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    //stop loop if collision
                    if(collision) {
                        break;
                    }
                }
            }
            //stop loop if collision
            if(collision) {
                break;
            }
        }
        if(collision) {
            gv.engine.getSoundMusicMgr().playSoundEffect(resSoundMusic.SOUNDS__SOUND__GET_POWER_UP);
            this.setIsInActive(false);
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
    },
    /**
     * auto destroy when spawn strike that used case
     * */
    destroy: function () {
        LogUtils.getInstance().log([this.getClassName(), "destroy"]);
        this.clearListTileLogicPointIndex();
        gv.engine.getBattleMgr().removePowerUp(this.getID());
        this.removeFromParent(true);
    }
});