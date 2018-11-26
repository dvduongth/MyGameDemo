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
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1S_PNG);
                        break;
                    case TEAM_2:
                        path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___2__1S_PNG);
                        break;
                }
                this.setHPMax(Setting.TANK_LIGHT_HP);
                break;
            case TANK_MEDIUM:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2S_PNG);
                        break;
                    case TEAM_2:
                        path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___2__2S_PNG);
                        break;
                }
                this.setHPMax(Setting.TANK_MEDIUM_HP);
                break;
            case TANK_HEAVY:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3S_PNG);
                        break;
                    case TEAM_2:
                        path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__TANK__TEAM___2__3S_PNG);
                        break;
                }
                this.setHPMax(Setting.TANK_HEAVY_HP);
                break;
            default :
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
        this.createTankSprite();
        this.createHPDisplayProgress();
    },
    createTankSprite: function () {
        var path;
        switch (this.getType()) {
            case TANK_LIGHT:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1A_PNG;
                        break;
                    case TEAM_2:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__1A_PNG;
                        break;
                }
                break;
            case TANK_MEDIUM:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2A_PNG;
                        break;
                    case TEAM_2:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__2A_PNG;
                        break;
                }
                break;
            case TANK_HEAVY:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3A_PNG;
                        break;
                    case TEAM_2:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__3A_PNG;
                        break;
                }
                break;
            default :
                break;
        }
        this._tankSprite = Utility.getInstance().createSpriteFromFileName(path);
        this.addChild(this._tankSprite);
        this._tankSprite.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
    },
    getTankSprite: function () {
        return this._tankSprite;
    },
    resetHP: function () {
        switch (this.getType()) {
            case TANK_LIGHT:
                this.setHP(Setting.TANK_LIGHT_HP);
                break;
            case TANK_MEDIUM:
                this.setHP(Setting.TANK_MEDIUM_HP);
                break;
            case TANK_HEAVY:
                this.setHP(Setting.TANK_HEAVY_HP);
                break;
            default :
                this.setHP(Setting.TANK_LIGHT_HP);
                break;
        }
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
    getDelayTimeSpawnBullet: function () {
        return Setting.MAX_DELAY_SPAWN_BULLET / this.getType();
    },

    createActionHunt: function () {
        this.removeActionHunt();
        this._actionTankHunt = cc.sequence(
            cc.callFunc(this.spawnBullet.bind(this)),
            cc.delayTime(this.getDelayTimeSpawnBullet())
        ).repeatForever();
        this.runAction(this._actionTankHunt);
    },
    removeActionHunt: function () {
        if (this._actionTankHunt != null) {
            this.stopAction(this._actionTankHunt);
            this._actionTankHunt = null;
        }
    },
    spawnBullet: function () {
        var _this = this;
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
        gv.engine.getBattleMgr().spawnBullet(this.getParent(), this.getPosition(), direction, this.getTeam(), this.getType(), this.getID());
        this.setBlockGun(true);
        this.runAction(cc.sequence(
            cc.delayTime(this.getDelayTimeSpawnBullet()),
            cc.callFunc(function () {
                _this.setBlockGun(false);
            })
        ));
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
                if (!this._isHunting) {
                    this._isHunting = true;
                    this.Hunt();
                } else {
                    this._isHunting = false;
                    this.stopHunt();
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
    setBlockGun: function (eff) {
        this._blockGun = eff;
    },
    isBlockGun: function () {
        return this._blockGun;
    },
    Hunt: function () {
        if (!this.isBlockGun()) {
            LogUtils.getInstance().log([this.getClassName(), "start Hunt"]);
            this.createActionHunt();
        } else {
            LogUtils.getInstance().log([this.getClassName(), "can not Hunt because of blocking"]);
        }
    },
    stopHunt: function () {
        LogUtils.getInstance().log([this.getClassName(), "STOP Hunt"]);
        this.removeActionHunt();
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
        this.setAngle(angle);
        if (dX != 0 || dY != 0) {
            //todo check collision
            //move before
            this.setPositionX(this.getPositionX() + dX);
            this.setPositionY(this.getPositionY() + dY);
            if (gv.engine.getBattleMgr().checkCollisionTankWithBarrier(this.getID())) {
                //can not move ==> move back
                this.setPositionX(this.getPositionX() - dX);
                this.setPositionY(this.getPositionY() - dY);
                //LogUtils.getInstance().log([this.getClassName(), "can not move because of collision"]);
                this.setDirection(DIRECTION_IDLE);
            }
        }
    },
    getWorldPosition: function () {
        return this.getParent().convertToWorldSpace(this.getPosition());
    },
    setHP: function (t) {
        this._HP = t;
        var percent = Math.round(100 * t / this.getHPMax());
        this.getHPDisplayProgress().setPercent(percent);
    },
    getHP: function () {
        return this._HP;
    },
    setHPMax: function (t) {
        this._HPMax = t;
    },
    getHPMax: function () {
        return this._HPMax;
    },
    createHPDisplayProgress: function () {
        var progressBg = Utility.getInstance().createSpriteFromFileName(resImg.RESOURCES__TEXTURES__PROGRESS_RED_PNG);
        this.addChild(progressBg);
        progressBg.setPosition(this.getContentSize().width / 2, -2);
        this._HPDisplayProgress = Utility.getInstance().createLoadingBar(resImg.RESOURCES__TEXTURES__PROGRESS_BULE_PNG);
        progressBg.addChild(this._HPDisplayProgress);
        this._HPDisplayProgress.setPosition(progressBg.getContentSize().width / 2, progressBg.getContentSize().height / 2);
        this._HPDisplayProgress.setPercent(100);
        progressBg.setScale(0.25);
    },
    getHPDisplayProgress: function () {
        return this._HPDisplayProgress;
    },
    hitBullet: function (damage) {
        this.setHP(Math.max(this.getHP() - damage, 0));
        var path;
        switch (this.getType()) {
            case TANK_LIGHT:
                switch (this.getTeam()) {
                    case TEAM_1:
                        if(this.getHP() < 40){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1C_PNG;
                        }else if(this.getHP() < 80){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1B_PNG;
                        }
                        break;
                    case TEAM_2:
                        if(this.getHP() < 40){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__1C_PNG;
                        }else if(this.getHP() < 80){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__1B_PNG;
                        }
                        break;
                }
                break;
            case TANK_MEDIUM:
                switch (this.getTeam()) {
                    case TEAM_1:
                        if(this.getHP() < 40){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2C_PNG;
                        }else if(this.getHP() < 80){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2B_PNG;
                        }
                        break;
                    case TEAM_2:
                        if(this.getHP() < 40){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__2C_PNG;
                        }else if(this.getHP() < 80){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__2B_PNG;
                        }
                        break;
                }
                break;
            case TANK_HEAVY:
                switch (this.getTeam()) {
                    case TEAM_1:
                        if(this.getHP() < 40){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3C_PNG;
                        }else if(this.getHP() < 80){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3B_PNG;
                        }
                        break;
                    case TEAM_2:
                        if(this.getHP() < 40){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__3C_PNG;
                        }else if(this.getHP() < 80){
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__3B_PNG;
                        }
                        break;
                }
                break;
            default :
                break;
        }
        Utility.getInstance().updateSpriteWithFileName(this.getTankSprite(), path);
        if (this.getHP() == 0) {
            //todo die
            this.destroy();
        }
    },
    destroy: function () {
        gv.engine.getBattleMgr().removeTank(this.getID());
        var path;
        switch (this.getType()) {
            case TANK_LIGHT:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1D_PNG;
                        break;
                    case TEAM_2:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__1D_PNG;
                        break;
                }
                break;
            case TANK_MEDIUM:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2D_PNG;
                        break;
                    case TEAM_2:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__2D_PNG;
                        break;
                }
                break;
            case TANK_HEAVY:
                switch (this.getTeam()) {
                    case TEAM_1:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3D_PNG;
                        break;
                    case TEAM_2:
                        path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__3D_PNG;
                        break;
                }
                break;
            default :
                break;
        }
        Utility.getInstance().updateSpriteWithFileName(this.getTankSprite(), path);
    }
});