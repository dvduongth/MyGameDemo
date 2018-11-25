"use strict";
var Bullet = cc.Sprite.extend({
    _className: "Bullet",
    getClassName: function () {
        return this._className;
    },
    ctor: function (id, direction, team, type) {
        this.setID(id);
        this.setTeam(team);
        this.setType(type);
        this.setDirection(direction);
        //super
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
        this._super(path);
        this.initBullet();
    },
    initBullet: function () {
        this.setSpeed(Setting.BULLET_SPEED);
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
    setSpeed: function (s) {
        this._bulletSpeed = s;
    },
    getSpeed: function () {
        return this._bulletSpeed;
    },
    // Draw
    update: function (dt) {
        var angle = 0;
        var dX = 0;
        var dY = 0;
        switch (this.getDirection()) {
            case DIRECTION_UP:
                angle = 0;
                dY = this.getSpeed();
                break;
            case DIRECTION_DOWN:
                angle = 180;
                dY = -this.getSpeed();
                break;
            case DIRECTION_LEFT:
                angle = 270;
                dX = -this.getSpeed();
                break;
            case DIRECTION_RIGHT:
                angle = 90;
                dX = this.getSpeed();
                break;
            default :
                //DIRECTION_UP
                angle = 0;
                dY = this.getSpeed();
                break;
        }
        this.setPositionX(this.getPositionX() + dX);
        this.setPositionY(this.getPositionY() + dY);
        this.setRotation(angle);
        this.checkOutOfBoundingScreen();
    },
    checkOutOfBoundingScreen: function () {
        var parent = this.getParent();
        var worldPos = parent.convertToWorldSpace(this.getPosition());
        if (worldPos.x >= (gv.WIN_SIZE.width + MAP_OFFSET_X)) {
            this.destroy();
            return true;
        }
        if (worldPos.y >= (gv.WIN_SIZE.height + MAP_OFFSET_Y)) {
            this.destroy();
            return true;
        }
        if (worldPos.x <= -MAP_OFFSET_Y) {
            this.destroy();
            return true;
        }
        if (worldPos.y <= -MAP_OFFSET_Y) {
            this.destroy();
            return true;
        }
        return false;
    },
    destroy: function () {
        gv.engine.getBattleMgr().removeBullet(this.getID());
        this.removeFromParent(true);
    }
});