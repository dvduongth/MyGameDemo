"use strict";
var Bullet = cc.Sprite.extend({
    _className: "Bullet",
    getClassName: function () {
        return this._className;
    },
    ctor: function (id, direction, team, type, tankGunId) {
        this.updateInfo(id, direction, team, type, tankGunId);
        //super
        this._super(this.getPathTextResourceByType(type));
        this.initBullet();
    },
    updateInfo: function (id, direction, team, type, tankGunId) {
        this.setID(id);
        this.setTeam(team);
        this.setType(type);
        this.setDirection(direction);
        this.setTankGunID(tankGunId);
        this.setListTileLogicPointIndex([]);
    },
    getPathTextResourceByType: function (type) {
        var path;
        switch (type) {
            case TANK_LIGHT:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__BULLET__1_PNG);
                break;
            case TANK_MEDIUM:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__BULLET__2_PNG);
                break;
            case TANK_HEAVY:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__BULLET__3_PNG);
                break;
            default :
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__BULLET__1_PNG);
                break;
        }
        return path;
    },
    resetInfo: function () {
        this.updateInfo(-1, -1, -1, -1, -1);
    },
    initBullet: function () {
        switch (this.getType()) {
            case TANK_LIGHT:
                this.setSpeed(Setting.BULLET_TANK_LIGHT_SPEED);
                break;
            case TANK_MEDIUM:
                this.setSpeed(Setting.BULLET_TANK_MEDIUM_SPEED);
                break;
            case TANK_HEAVY:
                this.setSpeed(Setting.BULLET_TANK_HEAVY_SPEED);
                break;
        }
    },
    setID: function (id) {
        this._bulletID = id;
    },
    getID: function () {
        return this._bulletID;
    },
    setTeam: function (t) {
        this._bulletTeam = t;
    },
    getTeam: function () {
        return this._bulletTeam;
    },
    setType: function (t) {
        this._tankType = t;
    },
    getType: function () {
        return this._tankType;
    },
    setDirection: function (d) {
        this._bulletDirection = d;
        //LogUtils.getInstance().log([this.getClassName(), "setDirection", d]);
    },
    getDirection: function () {
        return this._bulletDirection;
    },
    setTankGunID: function (d) {
        this._tankGunID = d;
    },
    getTankGunID: function () {
        return this._tankGunID;
    },
    setSpeed: function (s) {
        this._bulletSpeed = s;
    },
    getSpeed: function () {
        return this._bulletSpeed;
    },
    // Draw
    update: function (dt) {
        var angle = 0;
        switch (this.getDirection()) {
            case DIRECTION_UP:
                angle = 0;
                gv.engine.getBattleMgr().getMatchMgr().moveGameObject(this, this.getSpeed(), 0, true);
                break;
            case DIRECTION_DOWN:
                angle = 180;
                gv.engine.getBattleMgr().getMatchMgr().moveGameObject(this, -this.getSpeed(), 0, true);
                break;
            case DIRECTION_LEFT:
                angle = 270;
                gv.engine.getBattleMgr().getMatchMgr().moveGameObject(this, 0, -this.getSpeed(), true);
                break;
            case DIRECTION_RIGHT:
                angle = 90;
                gv.engine.getBattleMgr().getMatchMgr().moveGameObject(this, 0, this.getSpeed(), true);
                break;
        }
        this.setRotation(angle);
        this.checkOutOfBoundingScreen();
    },
    checkOutOfBoundingScreen: function () {
        var parent = this.getParent();
        var worldPos = parent.convertToWorldSpace(this.getPosition());
        if (worldPos.x >= (gv.WIN_SIZE.width + Setting.MAP_OFFSET_X)) {
            this.destroy();
            return true;
        }
        if (worldPos.y >= (gv.WIN_SIZE.height + Setting.MAP_OFFSET_Y)) {
            this.destroy();
            return true;
        }
        if (worldPos.x <= -Setting.MAP_OFFSET_Y) {
            this.destroy();
            return true;
        }
        if (worldPos.y <= -Setting.MAP_OFFSET_Y) {
            this.destroy();
            return true;
        }
        return false;
    },
    getWorldPosition: function () {
        return this.getParent().convertToWorldSpace(this.getPosition());
    },
    getDamageValue: function () {
        switch (this.getType()) {
            case TANK_LIGHT:
                return Setting.BULLET_TANK_LIGHT_DAMAGE;
            case TANK_MEDIUM:
                return Setting.BULLET_TANK_MEDIUM_DAMAGE;
            case TANK_HEAVY:
                return Setting.BULLET_TANK_HEAVY_DAMAGE;
            default :
                return 0;
        }
    },
    destroy: function (hasExplosion) {
        if (hasExplosion) {
            var worldPos = this.getWorldPosition();
            var offset = 20;
            switch (this.getDirection()) {
                case DIRECTION_UP:
                    worldPos.y += offset;
                    break;
                case DIRECTION_DOWN:
                    worldPos.y -= offset;
                    break;
                case DIRECTION_LEFT:
                    worldPos.x -= offset;
                    break;
                case DIRECTION_RIGHT:
                    worldPos.x += offset;
                    break;
                default :
                    break;
            }
            var explosion = gv.engine.getEffectMgr().showExplosion(worldPos, EXPLOSION_CANNON);
            explosion.setScale(0.4);
            explosion.setCompleteCallback(function () {
                explosion.removeFromParent(true);
            });
        }
        this.clearListTileLogicPointIndex();
        gv.engine.getBattleMgr().removeBullet(this.getID());
        cc.pool.putInPool(this);
    },
    checkCollision: function () {
        var _this = this;
        var collision = false;
        var skipID = this.getID();
        var skipTankID = this.getTankGunID();
        var skipTankTeam = this.getTeam();
        var listTilePointIdx = this.getListTileLogicPointIndex();
        listTilePointIdx.forEach(function (p) {
            var existedListId = gv.engine.getBattleMgr().getMapMgr().existedGameObjectOnTileAtTilePointIndex(p, skipID);
            if(existedListId) {
                existedListId.forEach(function (id) {
                    if(id == skipTankID) {
                        return false;
                    }
                    var gameObj = gv.engine.getBattleMgr().getGameObjectByID(id);
                    if(gameObj != null) {
                        var str = gameObj.getGameObjectString();
                        switch (str) {
                            case STRING_BASE:
                                if(!gameObj.isAlive()) {
                                    return false;
                                }
                                collision = true;
                                gameObj.hitBullet(_this.getDamageValue());
                                break;
                            case STRING_TANK:
                                if(!gameObj.isAlive()) {
                                    return false;
                                }
                                if(gameObj.getTeam() == skipTankTeam) {
                                    //LogUtils.getInstance().log([_this.getClassName(), "checkCollision got skipTankTeam", skipTankTeam]);
                                    return false;
                                }
                                collision = true;
                                gameObj.hitBullet(_this.getDamageValue());
                                break;
                            case STRING_OBSTACLE:
                                if(gameObj.isBarrier()){
                                    collision = true;
                                    gameObj.hitBullet(_this.getDamageValue());
                                }
                                break;
                            default:
                                break;
                        }
                    }
                });
            }
        });
        if(collision) {
            this.destroy(true);
        }
    },
    setGameObjectString: function (l) {
        this._gameObjectString = l;
    },
    getGameObjectString: function () {
        return this._gameObjectString;
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
    unuse: function () {
        this.resetInfo();
        this.retain();//if in jsb
        this.setVisible(false);
        this.removeFromParent(true);
    },
    reuse: function (id, direction, team, type, tankGunId) {
        this.updateInfo(id, direction, team, type, tankGunId);
        this.setVisible(true);
        Utility.getInstance().updateSpriteWithFileName(this, this.getPathTextResourceByType(type));
    }
});

Bullet.createCtor = function (id, direction, team, type, tankGunId) {
    return new Bullet(id, direction, team, type, tankGunId);
};
Bullet.create = function (id, direction, team, type, tankGunId) {
    var pool = cc.pool;
    if (pool.hasObject(Bullet)) return pool.getFromPool(Bullet, id, direction, team, type, tankGunId);
    return Bullet.createCtor(id, direction, team, type, tankGunId);
};