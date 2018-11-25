"use strict";
var Tank = cc.Sprite.extend({
    _className: "Tank",
    getClassName: function () {
        return this._className;
    },
    ctor: function (id, team, type) {
        this.setID(id);
        this.setTeam(team);
        this.setType(type);
        //super
        var path;
        switch (type) {
            case TANK_LIGHT:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1A_PNG);
                break;
            case TANK_MEDIUM:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2A_PNG);
                break;
            case TANK_HEAVY:
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3A_PNG);
                break;
            default :
                path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1B_PNG);
                break;
        }
        this._super(path);
        this.initTank();
    },
    initTank: function () {
        this.setDirection(DIRECTION_IDLE);
        this.setAngle(0);
        this.setSpeed(Setting.MAX_SPEED / this.getType());
        this.setMapPressAction({});
    },
    setID: function (id) {
        this._tankID = id;
    },
    getID: function () {
        return this._tankID;
    },
    setTeam: function (t) {
        this._tankTeam = t;
    },
    getTeam: function () {
        return this._tankTeam;
    },
    setType: function (t) {
        this._tankType = t;
    },
    getType: function () {
        return this._tankType;
    },
    setDirection: function (d) {
        this._tankDirection = d;
    },
    getDirection: function () {
        return this._tankDirection;
    },
    setAngle: function (d) {
        this._tankAngle = d;
        this.setRotation(d);
    },
    getAngle: function () {
        return this._tankAngle;
    },
    setSpeed: function (s) {
        this._tankSpeed = s;
    },
    getSpeed: function () {
        return this._tankSpeed;
    },
    setMapPressAction: function (m) {
        this._mapPressAction = m;
    },
    getMapPressAction: function () {
        return this._mapPressAction;
    },

    createActionHIT: function () {
        this.removeActionHIT();
        this._actionTankHIT = cc.sequence(
            cc.callFunc(this.spawnBullet.bind(this)),
            cc.delayTime(Setting.MAX_DELAY_SPAWN_BULLET / this.getType())
        ).repeatForever();
        this.runAction(this._actionTankHIT);
    },
    removeActionHIT: function () {
        if (this._actionTankHIT != null) {
            this.stopAction(this._actionTankHIT);
            this._actionTankHIT = null;
        }
    },
    spawnBullet: function () {
        var direction;
        //LogUtils.getInstance().log([this.getClassName(), "spawnBullet angle", this.getAngle()]);
        switch (this.getAngle()) {
            case 0:
                direction = DIRECTION_UP;
                break;
            case 90:
                direction = DIRECTION_RIGHT;
                break;
            case 180:
                direction = DIRECTION_DOWN;
                break;
            case 270:
            case -90:
                direction = DIRECTION_LEFT;
                break;
            default :
                LogUtils.getInstance().error([this.getClassName(), "spawnBullet with unknown angle", this.getAngle()]);
                direction = DIRECTION_UP;
                break;
        }
        gv.engine.getBattleMgr().spawnBullet(this.getParent(), this.getPosition(), direction, this.getTeam(), this.getType());
    },
    onEnter: function () {
        this._super();
        this.createKeyBoardListener();
    },
    onExit: function () {
        this.removeKeyBoardListener();
        this._super();
    },
    createKeyBoardListener: function () {
        this.removeKeyBoardListener();
        LogUtils.getInstance().log(this.getClassName() + " createKeyBoardListener");
        if ('keyboard' in cc.sys.capabilities) {
            var _this = this;
            this._keyboardListener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyFlagsChanged: _this.onKeyFlagsChanged.bind(_this),
                onKeyPressed: _this.onKeyPressed.bind(_this),
                onKeyReleased: _this.onKeyReleased.bind(_this)
            });
            cc.eventManager.addListener(this._keyboardListener, this);
        } else {
            LogUtils.getInstance().error([this.getClassName(), "createKeyBoardListener not supported keyboard"]);
        }
    },
    removeKeyBoardListener: function () {
        if (this._keyboardListener != null) {
            LogUtils.getInstance().log(this.getClassName() + " removeKeyBoardListener");
            cc.eventManager.removeListener(this._keyboardListener);
        }
        this._keyboardListener = null;
    },
    // this callback is only available on JSB + OS X
    // Not supported on cocos2d-html5
    onKeyFlagsChanged: function (key) {
        LogUtils.getInstance().log([this.getClassName(), "Key flags changed:" + key]);
    },
    onKeyPressed: function (keyCode, event) {
        //todo override me
        //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed keyCode", keyCode]);
        switch (keyCode) {
            case cc.KEY.up:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed UP", keyCode]);
                this.setDirection(DIRECTION_UP);
                this.getMapPressAction()["up"] = true;
                break;
            case cc.KEY.down:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed DOWN", keyCode]);
                this.setDirection(DIRECTION_DOWN);
                this.getMapPressAction()["down"] = true;
                break;
            case cc.KEY.left:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed LEFT", keyCode]);
                this.setDirection(DIRECTION_LEFT);
                this.getMapPressAction()["left"] = true;
                break;
            case cc.KEY.right:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed RIGHT", keyCode]);
                this.setDirection(DIRECTION_RIGHT);
                this.getMapPressAction()["right"] = true;
                break;
            case cc.KEY.enter:
            case cc.KEY.space:
                if (!this._isHitting) {
                    this._isHitting = true;
                    this.Hit();
                } else {
                    this._isHitting = false;
                    this.stopHit();
                }
                break;
        }
    },
    onKeyReleased: function (keyCode, event) {
        var isDuringPress;
        //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased keyCode", keyCode]);
        switch (keyCode) {
            case cc.KEY.up:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased UP", keyCode]);
                this.getMapPressAction()["up"] = false;
                break;
            case cc.KEY.down:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased DOWN", keyCode]);
                this.getMapPressAction()["down"] = false;
                break;
            case cc.KEY.left:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased LEFT", keyCode]);
                this.getMapPressAction()["left"] = false;
                break;
            case cc.KEY.right:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased RIGHT", keyCode]);
                this.getMapPressAction()["right"] = false;
                break;
        }
        isDuringPress = this.getMapPressAction()["left"] || this.getMapPressAction()["right"];
        isDuringPress = isDuringPress || this.getMapPressAction()["up"] || this.getMapPressAction()["down"];
        if (isDuringPress) {
            if (this.getMapPressAction()["up"]) {
                this.onKeyPressed(cc.KEY.up, event);
            } else if (this.getMapPressAction()["down"]) {
                this.onKeyPressed(cc.KEY.down, event);
            } else if (this.getMapPressAction()["left"]) {
                this.onKeyPressed(cc.KEY.left, event);
            } else if (this.getMapPressAction()["right"]) {
                this.onKeyPressed(cc.KEY.right, event);
            }
        } else {
            this.setDirection(DIRECTION_IDLE);
        }
    },

    Hit: function () {
        LogUtils.getInstance().log([this.getClassName(), "start HIT"]);
        this.createActionHIT();
    },
    stopHit: function () {
        LogUtils.getInstance().log([this.getClassName(), "STOP HIT"]);
        this.removeActionHIT();
    },
    // Draw - obvious comment is obvious
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

            case DIRECTION_IDLE:
                angle = this.getRotation();
                dX = 0;
                dY = 0;
                break;
        }
        this.setPositionX(this.getPositionX() + dX);
        this.setPositionY(this.getPositionY() + dY);
        this.setAngle(angle);
    }
});