var Strike = cc.Node.extend({
    _className: "Strike",
    getClassName: function () {
        return this._className;
    },
    ctor: function (id, team, type) {
        this.setID(id);
        this.setTeam(team);
        this.setType(type);
        this._super();
        this.initStrike();
    },
    createStrikeSprite: function () {
        var path;
        var rotation = 0;
        switch (this.getTeam()) {
            case TEAM_1:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRPLANE___1_PNG);
                rotation = 0;
                break;
            case TEAM_2:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRPLANE___2_PNG);
                rotation = 180;
                break;
            default :
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRPLANE___1_PNG);
                rotation = 0;
                break;
        }
        this._strikeSprite = Utility.getInstance().createSpriteFromFileName(path);
        this.addChild(this._strikeSprite);
        var shadowOffset = cc.p(-2, -2);
        this._strikeSprite.setPosition(this.getContentSize().width / 2 - shadowOffset.x, this.getContentSize().height / 2 - shadowOffset.y);
        this._strikeSprite.setRotation(rotation);
    },
    getStrikeSprite: function () {
        return this._strikeSprite;
    },
    setID: function (id) {
        this._ID = id;
    },
    getID: function () {
        return this._ID;
    },
    setTeam: function (t) {
        this._team = t;
    },
    getTeam: function () {
        return this._team;
    },
    setType: function (t) {
        this._type = t;
    },
    getType: function () {
        return this._type;
    },
    setCountDown: function (t) {
        this._countdown = t;
    },
    getCountDown: function () {
        return this._countdown;
    },
    setOptionValue: function (t) {
        this._optionValue = t;
    },
    getOptionValue: function () {
        return this._optionValue;
    },
    autoDecreaseCoundown: function () {
        this.setCountDown(this.getCountDown() - 1);
    },
    setLiving: function (t) {
        this._isLiving = t;
    },
    isLiving: function () {
        return this._isLiving;
    },
    initStrike: function () {
        this.setListTileLogicPointIndex([]);
        this.spawn();
        this.createStrikeSprite();
    },
    spawn: function () {
        this.setCountDown(Setting.POWERUP_DELAY);
        this.setLiving(true);
    },
    calculateStrikeSize: function () {
        var tileLogicSize = gv.engine.getBattleMgr().getMapMgr().getTileLogicSize();
        var w = this.getAOEValue() * 2 * Setting.GAME_OBJECT_SIZE * tileLogicSize.width;
        this.setStrikeSize(w);
        this.setOptionValue((gv.WIN_SIZE.height + w) / Setting.AIRSTRIKE_COUNTDOWN);
    },
    setStrikeSize: function (t) {
        this._strikeSize = t;
    },
    getStrikeSize: function () {
        return this._strikeSize;
    },
    update: function (dt) {
        if (this.isLiving()) {
            if (this.getCountDown() > 0) {
                var AIRPLANE_SPRITE_SIZE = this.getStrikeSize();
                switch (this.getTeam()) {
                    case TEAM_1:
                        this.getStrikeSprite().y = AIRPLANE_SPRITE_SIZE - this.getCountDown() * this.getOptionValue() - Setting.MAP_OFFSET_Y;
                        break;
                    case TEAM_2:
                        this.getStrikeSprite().y = -AIRPLANE_SPRITE_SIZE + this.getCountDown() * this.getOptionValue() + Setting.MAP_OFFSET_Y;
                        break;
                    default :
                        break;
                }
                this.autoDecreaseCoundown();
            } else {
                // Strike here
                this.setLiving(false);
                this.throwStrike();
                this.destroy();
            }
        }
    },
    throwStrike: function () {
        switch (this.getType()) {
            case POWERUP_AIRSTRIKE:
                this.throwAirStrike();
                break;
            case POWERUP_EMP:
                this.throwEMPStrike();
                break;
            default :
                break;
        }
    },
    throwAirStrike: function () {
        var _this = this;
        var worldPos = this.getWorldPosition();
        var explosion = gv.engine.getEffectMgr().showExplosion(worldPos, EXPLOSION_TANK);
        explosion.setScale(this.getStrikeSize() / explosion.getContentSize().width);
        explosion.setCompleteCallback(function () {
            explosion.removeFromParent(true);
        });
        var skipID = this.getID();
        var listTileIdx = this.getListTileLogicIdxForThrowStrike();
        listTileIdx.forEach(function (p) {
            var existedListId = gv.engine.getBattleMgr().getMapMgr().existedGameObjectOnTileAtTilePointIndex(p, skipID);
            if(existedListId) {
                existedListId.forEach(function (id) {
                    var gameObj = gv.engine.getBattleMgr().getGameObjectByID(id);
                    if(gameObj != null) {
                        var str = gameObj.getGameObjectString();
                        switch (str) {
                            case STRING_BASE:
                                if(!gameObj.isAlive()) {
                                    return false;
                                }
                                gameObj.hitAirStrike(_this.getDamageValue());
                                break;
                            case STRING_TANK:
                                if(!gameObj.isAlive()) {
                                    return false;
                                }
                                gameObj.hitAirStrike(_this.getDamageValue());
                                break;
                            case STRING_OBSTACLE:
                                if(gameObj.isBarrier()){
                                    gameObj.hitAirStrike(_this.getDamageValue());
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
        });
    },
    throwEMPStrike: function () {
        var _this = this;
        var worldPos = this.getWorldPosition();
        var explosion = gv.engine.getEffectMgr().showExplosion(worldPos, EXPLOSION_EMP);
        explosion.setScale(this.getStrikeSize() / explosion.getContentSize().width);
        explosion.setCompleteCallback(function () {
            explosion.removeFromParent(true);
        });
        var skipID = this.getID();
        var listTileIdx = this.getListTileLogicIdxForThrowStrike();
        listTileIdx.forEach(function (p) {
            var existedListId = gv.engine.getBattleMgr().getMapMgr().existedGameObjectOnTileAtTilePointIndex(p, skipID);
            if(existedListId) {
                existedListId.forEach(function (id) {
                    var gameObj = gv.engine.getBattleMgr().getGameObjectByID(id);
                    if(gameObj != null) {
                        var str = gameObj.getGameObjectString();
                        switch (str) {
                            case STRING_TANK:
                                if(!gameObj.isAlive()) {
                                    return false;
                                }
                                gameObj.hitEMP(_this.getDamageValue());
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
        });
    },
    getListTileLogicIdxForThrowStrike: function () {
        var list = [];
        var curIdx = this.getStartTileLogicPointIndex();
        list.push(curIdx);
        var radius = this.getAOEValue();
        for(var row = 0; row <= radius; ++row) {
            for(var col = 0; col <= radius; ++col) {
                var curTile0 = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curIdx, -row, -col);
                var curTile1 = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curIdx, -row, col);
                var curTile2 = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curIdx, row, -col);
                var curTile3 = gv.engine.getBattleMgr().getMapMgr().getNextTileLogicPointIndexByDelta(curIdx, row, col);
                if(list.findIndex(function(p){return p.x == curTile0.x && p.y == curTile0.y;}) == -1) {
                    list.push(curTile0);
                }
                if(list.findIndex(function(p){return p.x == curTile1.x && p.y == curTile1.y;}) == -1) {
                    list.push(curTile1);
                }
                if(list.findIndex(function(p){return p.x == curTile2.x && p.y == curTile2.y;}) == -1) {
                    list.push(curTile2);
                }
                if(list.findIndex(function(p){return p.x == curTile3.x && p.y == curTile3.y;}) == -1) {
                    list.push(curTile3);
                }
            }
        }
        return list;
    },
    getDamageValue: function () {
        switch (this.getType()) {
            case POWERUP_AIRSTRIKE:
                return Setting.AIRSTRIKE_DAMAGE;
            case POWERUP_EMP:
                return Setting.EMP_DURATION;
            default :
                return 0;
        }
    },
    getAOEValue: function () {
        switch (this.getType()) {
            case POWERUP_AIRSTRIKE:
                return Setting.AIRSTRIKE_AOE;
            case POWERUP_EMP:
                return Setting.EMP_AOE;
            default :
                return 0;
        }
    },
    destroy: function () {
        this.clearListTileLogicPointIndex();
        gv.engine.getBattleMgr().removeStrike(this.getID());
        this.removeFromParent(true);
    },
    getWorldPosition: function () {
        return this.getParent().convertToWorldSpace(this.getPosition());
    },
    setGameObjectString: function (l) {
        this._gameObjectString = l;
    },
    getGameObjectString: function () {
        return this._gameObjectString;
    },
    /**
     * @param {GameObjectPointIndex} l
     * */
    setGameObjectSizeNumberPoint: function (l) {
        this._gameObjectSizeNumberPoint = l;
    },
    /**
     * @return {GameObjectPointIndex} l
     * */
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