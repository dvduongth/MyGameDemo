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
        if (gv.engine.getBattleMgr().getPlayerMgr().isMyTeam(this.getTeam())) {
            this.setAngle(0);//up
        } else {
            this.setAngle(180);//down
        }
        switch (this.getType()) {
            case TANK_LIGHT:
                this.setSpeed(Setting.TANK_LIGHT_SPEED);
                break;
            case TANK_MEDIUM:
                this.setSpeed(Setting.TANK_MEDIUM_SPEED);
                break;
            case TANK_HEAVY:
                this.setSpeed(Setting.TANK_HEAVY_SPEED);
                break;
        }
        this.setMapPressAction({});
        this.createTankSprite();
        this.createHPDisplayProgress();
        this.createTouchListenerOneByOneTank();
        this.setListTileLogicPointIndex([]);
        this.setEMPCountdown(0);
        this.autoCalculateReachDestinationDeltaDistance();
        this.setListFlagMarkDestinationPointInfo([]);
    },
    autoCalculateReachDestinationDeltaDistance: function () {
        var tileSize = gv.engine.getBattleMgr().getMapMgr().getTileLogicSize();
        var d = cc.pDistance(cc.POINT_ZERO, cc.p(tileSize.width, tileSize.height));
        this._destinationDeltaDistance = d * Setting.REACH_DESTINATION_DELTA_NUMBER_TILE;
    },
    getReachDestinationDeltaDistance: function () {
        return this._destinationDeltaDistance;
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
        var shadowOffset = cc.p(-2, -2);
        this._tankSprite.setPosition(this.getContentSize().width / 2 - shadowOffset.x, this.getContentSize().height / 2 - shadowOffset.y);
    },
    getTankSprite: function () {
        return this._tankSprite;
    },
    createSelectedSprite: function () {
        var path;
        switch (this.getType()) {
            case TANK_LIGHT:
                path = resImg.RESOURCES__TEXTURES__TANK__TANK1SELECTED_PNG;
                break;
            case TANK_MEDIUM:
                path = resImg.RESOURCES__TEXTURES__TANK__TANK2SELECTED_PNG;
                break;
            case TANK_HEAVY:
                path = resImg.RESOURCES__TEXTURES__TANK__TANK3SELECTED_PNG;
                break;
            default :
                break;
        }
        this._selectedSprite = Utility.getInstance().createSpriteFromFileName(path);
        this.addChild(this._selectedSprite, -1);
        this._selectedSprite.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
    },
    getSelectedSprite: function () {
        if (!this._selectedSprite) {
            this.createSelectedSprite();
        }
        return this._selectedSprite;
    },
    setMoveDestinationWorldPosition: function (wPos) {
        this._flagWorldPosition = wPos;
        if(wPos != null) {
            this.getDestinationPointDisplay().setPosition(wPos);
        }else{
            this.clearDestinationPointDisplay();
        }
    },
    getFlagWorldPosition: function () {
        return this._flagWorldPosition;
    },
    setListFlagMarkDestinationPointInfo: function (p) {
        this._listFlagMarkDestinationPointInfo = p;
    },
    getListFlagMarkDestinationPointInfo: function () {
        return this._listFlagMarkDestinationPointInfo;
    },
    pushListFlagMarkDestinationPointInfo: function (worldPos) {
        var parent = gv.engine.getLayerMgr().getLayerById(LAYER_ID.EFFECT);
        var spr = Utility.getInstance().createSpriteFromFileName(resImg.RESOURCES__TEXTURES__DESTINATION_POINT_PNG);
        parent.addChild(spr);
        spr.setPosition(worldPos);
        spr.runAction(cc.sequence(cc.fadeOut(1),cc.fadeIn(0.4)).repeatForever());
        this.getListFlagMarkDestinationPointInfo().push({
            spr: spr,
            pos: worldPos
        });
    },
    createDestinationPointDisplay: function () {
        var parent = gv.engine.getLayerMgr().getLayerById(LAYER_ID.EFFECT);
        var spr = Utility.getInstance().createSpriteFromFileName(resImg.RESOURCES__TEXTURES__DESTINATION_TOUCH_PNG);
        parent.addChild(spr);
        var opacity = 255;
        if(!gv.engine.getBattleMgr().getPlayerMgr().isMyTeam(this.getTeam())){
            spr.setColor(cc.color.RED);
            opacity = 50;
        }
        spr.runAction(cc.sequence(cc.fadeOut(0.4),cc.fadeTo(0.25, opacity)).repeatForever());
        return spr;
    },
    getDestinationPointDisplay: function () {
        if(!this._destinationPointDisplay) {
            this._destinationPointDisplay = this.createDestinationPointDisplay();
        }
        return this._destinationPointDisplay;
    },
    clearDestinationPointDisplay: function () {
        if(this._destinationPointDisplay != null) {
            this._destinationPointDisplay.removeFromParent(true);
            this._destinationPointDisplay = null;
        }
    },
    checkHandleTankActionByFlagDestination: function () {
        if (this.getFlagWorldPosition() != null) {
            this.checkForTankActionByWorldPosition(this.getFlagWorldPosition());
        } else {
            var list = this.getListFlagMarkDestinationPointInfo();
            if (list.length > 0) {
                var info = list[0];
                if (info != null) {
                    LogUtils.getInstance().log([this.getClassName(), "checkHandleTankActionByFlagDestination auto set next flag destination", list.length]);
                    this.setMoveDestinationWorldPosition(info.pos);
                    this.checkForTankActionByWorldPosition(this.getFlagWorldPosition());
                }
            }
        }
    },
    clearFlagMarkDestinationPointInfoByWorldPosition: function (wPos) {
        LogUtils.getInstance().log([this.getClassName(), "clearFlagMarkDestinationPointInfoByWorldPosition"]);
        var list = this.getListFlagMarkDestinationPointInfo();
        var exitedIdx = list.findIndex(function (info) {
            var pos = info.pos;
            if (pos.x == wPos.x && pos.y == wPos.y) {
                return true;
            }
            if (Math.floor(pos.x) == Math.floor(wPos.x) && Math.floor(pos.y) == Math.floor(wPos.y)) {
                return true;
            }
            return false;
        });
        if (exitedIdx != -1) {
            var info = list[exitedIdx];
            if (info != null) {
                info.spr.removeFromParent(true);
            }
            list.splice(exitedIdx, 1);
            LogUtils.getInstance().log([this.getClassName(), "clearFlagMarkDestinationPointInfoByWorldPosition success", exitedIdx]);
        } else {
            LogUtils.getInstance().log([this.getClassName(), "clearFlagMarkDestinationPointInfoByWorldPosition not existed", wPos.x, wPos.y]);
        }
    },
    clearAllFlagMarkDestinationPointInfo: function () {
        LogUtils.getInstance().log([this.getClassName(), "clearAllFlagMarkDestinationPointInfo"]);
        var list = this.getListFlagMarkDestinationPointInfo();
        list.forEach(function (info) {
            info.spr.removeFromParent(true);
        });
        this.setListFlagMarkDestinationPointInfo([]);
        this.setMoveDestinationWorldPosition(null);
        this.clearDestinationPointDisplay();
    },

    createTouchListenerOneByOneTank: function () {
        this.removeTouchListenerOneByOneTank();
        var _this = this;
        this._touchListenerBaseOneByOne = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: _this.onTouchBeganTank.bind(_this),
            onTouchMoved: _this.onTouchMovedTank.bind(_this),
            onTouchEnded: _this.onTouchEndedTank.bind(_this),
            onTouchCancelled: _this.onTouchCancelledTank.bind(_this)
        });
        cc.eventManager.addListener(this._touchListenerBaseOneByOne, this.getTankSprite());
    },
    removeTouchListenerOneByOneTank: function () {
        if (this._touchListenerBaseOneByOne != null) {
            cc.eventManager.removeListener(this._touchListenerBaseOneByOne);
        }
        this._touchListenerBaseOneByOne = null;
    },
    onTouchBeganTank: function (touch, event) {
        if(gv.engine.getBattleMgr().getMatchMgr().isPauseGame()){
            LogUtils.getInstance().log([this.getClassName(), "onTouchBeganTank during pause game"]);
            return false;
        }
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
        var isCorrect = cc.rectContainsPoint(rect, locationInNode);
        if (isCorrect && gv.engine.getBattleMgr().getPlayerMgr().isMyTeam(this.getTeam())) {
            LogUtils.getInstance().log([this.getClassName(), "touch tank began"]);
            Utility.getInstance().showTextOnScene(this.getClassName() + " SELECT THIS TANK");
            if (this.getID() == gv.engine.getBattleMgr().getPlayerMgr().getCurrentSelectedTankID(this.getTeam())) {
                this.tankAction(cc.KEY.enter);
            }
            gv.engine.getBattleMgr().getPlayerMgr().setCurrentSelectedTankID(this.getTeam(), this.getID());
            this.clearAllFlagMarkDestinationPointInfo();
            return true;
        } else {
            //LogUtils.getInstance().log([this.getClassName(), "touch not correct"]);
            return false;
        }
    },
    onTouchMovedTank: function (touch, event) {
        this.setMoveDestinationWorldPosition(touch.getLocation());
        return true;
    },
    onTouchEndedTank: function (touch, event) {
        this.tankAction(null);
        this.setMoveDestinationWorldPosition(null);
    },
    onTouchCancelledTank: function (touch, event) {
        this.tankAction(null);
        this.setMoveDestinationWorldPosition(null);
    },
    checkForTankActionByWorldPosition: function (touchPos) {
        var target = this;
        var parent = target.getParent();
        var worldPos = parent.convertToWorldSpace(target.getPosition());
        var delta = cc.pSub(touchPos, worldPos);
        var mapMgr = gv.engine.getBattleMgr().getMapMgr();
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            if (delta.x > 0) {
                //move to right
                if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_RIGHT, 1)) {
                    this.tankAction(cc.KEY.right);
                } else {
                    //find other way
                    if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_UP, 1)) {
                        this.tankAction(cc.KEY.up);
                    } else if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_LEFT, 1)) {
                        this.tankAction(cc.KEY.left);
                    } else if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_DOWN, 1)) {
                        this.tankAction(cc.KEY.down);
                    }
                }
            } else {
                if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_LEFT, 1)) {
                    this.tankAction(cc.KEY.left);
                } else {
                    //find other way
                    if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_DOWN, 1)) {
                        this.tankAction(cc.KEY.down);
                    } else if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_RIGHT, 1)) {
                        this.tankAction(cc.KEY.right);
                    } else if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_UP, 1)) {
                        this.tankAction(cc.KEY.up);
                    }
                }
            }
        } else {
            if (delta.y > 0) {
                //move to top
                if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_UP, 1)) {
                    this.tankAction(cc.KEY.up);
                } else {
                    //find other way
                    if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_LEFT, 1)) {
                        this.tankAction(cc.KEY.left);
                    } else if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_DOWN, 1)) {
                        this.tankAction(cc.KEY.down);
                    } else if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_RIGHT, 1)) {
                        this.tankAction(cc.KEY.right);
                    }
                }
            } else {
                if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_DOWN, 1)) {
                    this.tankAction(cc.KEY.down);
                } else {
                    //find other way
                    if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_RIGHT, 1)) {
                        this.tankAction(cc.KEY.right);
                    } else if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_UP, 1)) {
                        this.tankAction(cc.KEY.up);
                    } else if (mapMgr.isCanMoveTankByIdWithDirection(this.getID(), DIRECTION_LEFT, 1)) {
                        this.tankAction(cc.KEY.left);
                    }
                }
            }
        }
        //todo check reach destination pos
        var d = cc.pDistance(cc.POINT_ZERO, delta);
        if (d <= this.getReachDestinationDeltaDistance()) {
            LogUtils.getInstance().log([this.getClassName(), "checkForTankActionByWorldPosition reach flag"]);
            this.clearFlagMarkDestinationPointInfoByWorldPosition(this.getFlagWorldPosition());
            this.setMoveDestinationWorldPosition(null);
            this.tankAction(null);
        }
    },
    tankAction: function (keyCode) {
        if(gv.engine.getBattleMgr().getMatchMgr().isPauseGame()) {
            return false;
        }
        var tank = this;
        switch (keyCode) {
            case cc.KEY.up:
                tank.setDirection(DIRECTION_UP);
                break;
            case cc.KEY.down:
                tank.setDirection(DIRECTION_DOWN);
                break;
            case cc.KEY.left:
                tank.setDirection(DIRECTION_LEFT);
                break;
            case cc.KEY.right:
                tank.setDirection(DIRECTION_RIGHT);
                break;
            case cc.KEY.enter:
                if (!tank._isHunting) {
                    tank._isHunting = true;
                    tank.Hunt();
                } else {
                    tank._isHunting = false;
                    tank.stopHunt();
                }
                break;
            default :
                tank.setDirection(DIRECTION_IDLE);
                break;
        }
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
        switch (this.getType()) {
            case TANK_LIGHT:
                return Setting.TANK_LIGHT_ROF;
            case TANK_MEDIUM:
                return Setting.TANK_MEDIUM_ROF;
            case TANK_HEAVY:
                return Setting.TANK_HEAVY_ROF;
        }
    },
    isDuringActionHunting: function () {
        return this._actionTankHunt != null;
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
        if(gv.engine.getBattleMgr().getMatchMgr().isPauseGame()) {
            return false;
        }
        if (this.getEMPCountdown() > 0) {
            return false;
        }
        this.playEffectGunShot();
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
    playEffectGunShot: function () {
        var exId = EXPLOSION_GUN_MUZZLE;
        switch (this.getType()) {
            case TANK_LIGHT:
            case TANK_MEDIUM:
                exId = EXPLOSION_GUN_MUZZLE;
                break;
            case TANK_HEAVY:
                exId = EXPLOSION_CANNON_MUZZLE;
                break;
        }
        var explosion = gv.engine.getEffectMgr().showExplosion(this.getWorldPosition(), exId);
        explosion.setRotation(this.getAngle());
        explosion.setCompleteCallback(function () {
            explosion.removeFromParent(true);
        });
    },
    setBlockGun: function (eff) {
        this._blockGun = eff;
    },
    isBlockGun: function () {
        return this._blockGun;
    },
    Hunt: function () {
        if (gv.engine.getBattleMgr().getMatchMgr().isPauseGame()) {
            LogUtils.getInstance().log([this.getClassName(), "can not Hunt because of pause game"]);
            return;
        }
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
        if (this.getEMPCountdown() > 0) {
            this.autoCountdownEMP();
            return false;
        }
        this.checkHandleTankActionByFlagDestination();
        if (this.getDirection() == DIRECTION_IDLE) {
            return false;
        }
        var angle = 0;
        switch (this.getDirection()) {
            case DIRECTION_UP:
                angle = 0;
                gv.engine.getBattleMgr().getMatchMgr().moveGameObject(this, this.getSpeed(), 0);
                break;
            case DIRECTION_DOWN:
                angle = 180;
                gv.engine.getBattleMgr().getMatchMgr().moveGameObject(this, -this.getSpeed(), 0);
                break;
            case DIRECTION_LEFT:
                angle = 270;
                gv.engine.getBattleMgr().getMatchMgr().moveGameObject(this, 0, -this.getSpeed());
                break;
            case DIRECTION_RIGHT:
                angle = 90;
                gv.engine.getBattleMgr().getMatchMgr().moveGameObject(this, 0, this.getSpeed());
                break;
        }
        this.setAngle(angle);
    },
    getWorldPosition: function () {
        return this.getParent().convertToWorldSpace(this.getPosition());
    },
    setHP: function (t) {
        this._HP = t;
        var percent = Math.round(100 * t / this.getHPMax());
        if (_.isNaN(percent) || percent < 0) {
            percent = 0;
        }
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
    setEMPCountdown: function (t) {
        this._EMPCountdown = t;
    },
    getEMPCountdown: function () {
        return this._EMPCountdown;
    },
    autoCountdownEMP: function () {
        this.setEMPCountdown(this.getEMPCountdown() - 1);
    },
    setObjectProgressDisplay: function (o) {
        this._objectProgressDisplay = o;
    },
    getObjectProgressDisplay: function () {
        return this._objectProgressDisplay;
    },
    createHPDisplayProgress: function () {
        var progressBg = Utility.getInstance().createSpriteFromFileName(resImg.RESOURCES__TEXTURES__PROGRESS_RED_PNG);
        this.addChild(progressBg, 0);
        progressBg.setPosition(this.getContentSize().width / 2, -2);
        this._HPDisplayProgress = Utility.getInstance().createLoadingBar(resImg.RESOURCES__TEXTURES__PROGRESS_BULE_PNG);
        progressBg.addChild(this._HPDisplayProgress);
        this._HPDisplayProgress.setPosition(progressBg.getContentSize().width / 2, progressBg.getContentSize().height / 2);
        this._HPDisplayProgress.setPercent(100);
        progressBg.setScale(0.5);
        this.setObjectProgressDisplay(progressBg);
        this.resetHP();
    },
    getHPDisplayProgress: function () {
        return this._HPDisplayProgress;
    },
    isAlive: function () {
        return this.getHP() > 0;
    },
    hitBullet: function (damage) {
        this.setHP(Math.max(this.getHP() - damage, 0));
        var path = null;
        switch (this.getType()) {
            case TANK_LIGHT:
                switch (this.getTeam()) {
                    case TEAM_1:
                        if (this.getHP() < 40) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1C_PNG;
                        } else if (this.getHP() < 80) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1B_PNG;
                        }
                        break;
                    case TEAM_2:
                        if (this.getHP() < 40) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__1C_PNG;
                        } else if (this.getHP() < 80) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__1B_PNG;
                        }
                        break;
                }
                break;
            case TANK_MEDIUM:
                switch (this.getTeam()) {
                    case TEAM_1:
                        if (this.getHP() < 40) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2C_PNG;
                        } else if (this.getHP() < 80) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2B_PNG;
                        }
                        break;
                    case TEAM_2:
                        if (this.getHP() < 40) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__2C_PNG;
                        } else if (this.getHP() < 80) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__2B_PNG;
                        }
                        break;
                }
                break;
            case TANK_HEAVY:
                switch (this.getTeam()) {
                    case TEAM_1:
                        if (this.getHP() < 40) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3C_PNG;
                        } else if (this.getHP() < 80) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3B_PNG;
                        }
                        break;
                    case TEAM_2:
                        if (this.getHP() < 40) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__3C_PNG;
                        } else if (this.getHP() < 80) {
                            path = resImg.RESOURCES__TEXTURES__TANK__TEAM___2__3B_PNG;
                        }
                        break;
                }
                break;
            default :
                break;
        }
        if (path != null) {
            Utility.getInstance().updateSpriteWithFileName(this.getTankSprite(), path);
        }
        if (!this.isAlive()) {
            //todo die
            this.destroy();
        }
    },
    hitAirStrike: function (damage) {
        this.hitBullet(damage);
    },
    hitEMP: function (damage) {
        this.setEMPCountdown(damage);
    },
    destroy: function () {
        this.removeTouchListenerOneByOneTank();
        this.clearAllFlagMarkDestinationPointInfo();
        this.stopHunt();
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
        var worldPos = this.getWorldPosition();
        var explosion = gv.engine.getEffectMgr().showExplosion(worldPos, EXPLOSION_TANK);
        explosion.setCompleteCallback(function () {
            explosion.removeFromParent(true);
        });
        var smoke = gv.engine.getEffectMgr().showEffectSmoke(cc.p(worldPos.x, worldPos.y - this.getContentSize().height / 2));
        gv.engine.getBattleMgr().getBattleDataModel().pushEffectSmoke(smoke);
        Utility.getInstance().updateSpriteWithFileName(this.getTankSprite(), path);
        this.getObjectProgressDisplay().setVisible(false);
        if(gv.engine.getBattleMgr().getPlayerMgr().isMyTeam(this.getTeam())){
            gv.engine.getSceneBattleIfExist().updateDisplayButtonHunt();
        }
        if (this.getID() == gv.engine.getBattleMgr().getPlayerMgr().getCurrentSelectedTankID(this.getTeam())) {
            this.setSelected(false);
            gv.engine.getBattleMgr().getPlayerMgr().autoSelectOtherTankIDForCurrentSelectedFunction(this.getTeam());
        } else {
            gv.engine.getBattleMgr().getPlayerMgr().removeTankIDNotYetSelectForTeam(this.getTeam(), this.getID());
        }
        gv.engine.getBattleMgr().checkWinKnockoutKillAllTank(this.getID(), this.getTeam());
        gv.engine.getBattleMgr().removeTank(this.getID());
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
     * @return {GameObjectPointIndex}
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
            if (tileLogic != null) {
                tileLogic.removeGameObjectIDOnTile(id);
            }
        });
        this.setListTileLogicPointIndex([]);
    },
    runEffectAppearThrowDown: function (funCall) {
        gv.engine.getSoundMusicMgr().playSoundEffect(resSoundMusic.SOUNDS__SOUND__THROW_DOWN);
        var args = {};
        args["animationName"] = "eff_appear_fall_down";
        args["animationRun"] = "run";
        args["pos"] = this.getWorldPosition();
        args["pos"].y += this.getContentSize().height;
        args["funCall"] = funCall;
        var eff = gv.engine.getEffectMgr().playEffectDragonBones(args);
    },
    setSelected: function (eff) {
        this.getSelectedSprite().setVisible(eff);
    },
    removeSelf: function () {
        LogUtils.getInstance().log([this.getClassName(), "removeSelf"]);
        this.clearListTileLogicPointIndex();//remove all logic
        gv.engine.getBattleMgr().getBattleFactory().removeTank(this.getID());//remove all logic
        this.removeFromParent(true);
    }
});