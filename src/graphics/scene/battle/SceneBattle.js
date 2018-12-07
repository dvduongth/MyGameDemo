var SceneBattle = BaseScene.extend({
    _className: 'SceneBattle',
    ctor: function () {
        //todo ccs element
        this.btnBackToLobby = null;
        this.btnClose = null;
        this.sprMapBackground = null;
        this.sprClock = null;
        this.lbCountdownTime = null;
        this.ndSlotPickTank = null;
        this.imgTank_0 = null;
        this.imgTank_1 = null;
        this.imgTank_2 = null;
        this.btnTank_0 = null;
        this.btnTank_1 = null;
        this.btnTank_2 = null;
        this.btnTank_3 = null;
        this.btnNextTank = null;
        this.btnTankHunt = null;

        this._super(resJson.ZCCS__SCENE__BATTLE__SCENEBATTLE);
    },
    initScene: function () {
        //local zorder
        this.sprMapBackground.setLocalZOrder(ZORDER_BACK_GROUND);
        this.sprClock.setLocalZOrder(ZORDER_SKY);
        this.btnBackToLobby.setLocalZOrder(ZORDER_FORCE_GROUND);
        this.btnClose.setLocalZOrder(ZORDER_FORCE_GROUND);
        this.ndSlotPickTank.setLocalZOrder(ZORDER_SKY);
        gv.engine.getBattleMgr().getMapMgr().setMapBackgroundObj(this.sprMapBackground);
        gv.engine.getBattleMgr().getMapMgr().initMap();
        this.findAndInitGameObject();
        this.initDisplayPickTankSlot();
        this.createKeyBoardListener();
        this.createTouchListenerOneByOne();
        this.createTouchListenerOneByOneTank();
        LogUtils.getInstance().log([this.getClassName(), "initScene success"]);
    },
    initDisplayPickTankSlot: function () {
        switch (gv.engine.getBattleMgr().getPlayerMgr().getMyTeam()) {
            case TEAM_1:
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_0, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1A_PNG);
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2A_PNG);
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_2, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3A_PNG);
                break;
            case TEAM_2:
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_0, resImg.RESOURCES__TEXTURES__TANK__TEAM___2__1A_PNG);
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___2__2A_PNG);
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_2, resImg.RESOURCES__TEXTURES__TANK__TEAM___2__3A_PNG);
                break;
        }
    },
    onEnter: function () {
        this._super();
        Utility.getInstance().callFunctionWithDelay(0.4, function () {
            gv.engine.getBattleMgr().getPlayerMgr().throwEnemyTank();
        });
    },
    clearScene: function () {
        this.removeTouchListenerOneByOneTank();
        this._super();
    },
    updateDisplayPickTankSlot: function () {
        if (gv.engine.getBattleMgr().getPlayerMgr().isAlreadyDoneThrowAllTank()) {
            this.removeTouchListenerOneByOneTank();
            this.imgTank_0.setVisible(false);
            this.imgTank_1.setVisible(false);
            this.imgTank_2.setVisible(false);
        } else {
            this.imgTank_0.setVisible(true);
            this.imgTank_1.setVisible(true);
            this.imgTank_2.setVisible(true);

        }
    },
    update: function (dt) {
        gv.engine.getBattleMgr().update(dt);
    },
    updatePerSecond: function () {
        gv.engine.getBattleMgr().updatePerSecond();
    },
    countDownTimeUp: function () {
        var t = gv.engine.getBattleMgr().getBattleDataModel().getTimeCountdownBattle();
        t = Setting.BATTLE_DURATION - t;
        this.lbCountdownTime.setString(Utility.getInstance().numberToStringGlobal(t));
    },
    findAndInitGameObject: function () {
        var MainBase = "MainBase";
        var SideBase = "SideBase";
        var ObstacleSoft = "ObstacleSoft";
        var ObstacleHard = "ObstacleHard";
        var Water = "Water";
        var listNodeGround = ["ndWater", "ndConcrete", "ndBrick"];

        function findObj(node) {
            if (node == null) {
                return false;
            }
            var allChildren = node.getChildren();
            if (allChildren == null || allChildren.length === 0) {
                return false;
            }
            var nameChild;
            //LogUtils.getInstance().log(["findObj length",allChildren.length]);
            for (var i = 0; i < allChildren.length; i++) {
                var child = allChildren[i];
                nameChild = child.getName();
                //LogUtils.getInstance().log(["findBase", nameChild]);
                if (nameChild != null) {
                    var arr = nameChild.split("_");
                    switch (arr[0]) {
                        case MainBase:
                            gv.engine.getBattleMgr().updateBase(child, BASE_MAIN, cc.p(arr[1], arr[2]), arr[3]);
                            child.setLocalZOrder(ZORDER_GROUND);
                            break;
                        case SideBase:
                            gv.engine.getBattleMgr().updateBase(child, BASE_SIDE, cc.p(arr[1], arr[2]), arr[3]);
                            child.setLocalZOrder(ZORDER_GROUND);
                            break;
                        case ObstacleSoft:
                            gv.engine.getBattleMgr().updateObstacle(child, BLOCK_SOFT_OBSTACLE, cc.p(arr[1], arr[2]));
                            break;
                        case ObstacleHard:
                            gv.engine.getBattleMgr().updateObstacle(child, BLOCK_HARD_OBSTACLE, cc.p(arr[1], arr[2]));
                            break;
                        case Water:
                            gv.engine.getBattleMgr().updateObstacle(child, BLOCK_WATER, cc.p(arr[1], arr[2]));
                            break;
                        default :
                            var existedGroundIdx = listNodeGround.findIndex(function (str) {
                                return str == arr[0];
                            });
                            if (existedGroundIdx != -1) {
                                child.setLocalZOrder(ZORDER_GROUND);
                            }
                            break;
                    }
                }
                findObj(child);
            }
            return true;
        }

        findObj(this.getRootNode());
    },
    createLayerRedLimitThrowTank: function () {
        var parentSize = this.sprMapBackground.getContentSize();
        var cSize = cc.size(gv.WIN_SIZE.width, gv.WIN_SIZE.height);
        this._layerRedLimitThrowTank = new cc.LayerColor(cc.color.RED, cSize.width, cSize.height);
        this._layerRedLimitThrowTank.setOpacity(80);
        this.sprMapBackground.addChild(this._layerRedLimitThrowTank, 0);
        this._layerRedLimitThrowTank.setLocalZOrder(ZORDER_MID_GROUND);
        this._layerRedLimitThrowTank.attr({
            anchorX: 0,
            anchorY: 0,
            x: parentSize.width / 2 - cSize.width / 2,
            y: parentSize.height / 2 - cSize.height / 2
        });
    },
    getLayerRedLimitThrowTank: function () {
        if (!this._layerRedLimitThrowTank) {
            this.createLayerRedLimitThrowTank();
        }
        return this._layerRedLimitThrowTank;
    },
    removeLayerRedLimitThrowTank: function () {
        if (this._layerRedLimitThrowTank != null) {
            this._layerRedLimitThrowTank.removeFromParent(true);
            this._layerRedLimitThrowTank = null;
        }
    },
    createLayerGreenLimitThrowTank: function () {
        var size = cc.size();
        var tileLogicSize = gv.engine.getBattleMgr().getMapMgr().getTileLogicSize();
        var tileMapSize = cc.size(tileLogicSize.width * Setting.GAME_OBJECT_SIZE_W, tileLogicSize.height * Setting.GAME_OBJECT_SIZE_H);
        size.width = tileMapSize.width * (Setting.MAP_W - 2);
        size.height = tileMapSize.height * Setting.MAP_LIMIT_ROW_THROW_TANK;
        this._layerGreenLimitThrowTank = new cc.LayerColor(cc.color.GREEN, size.width, size.height);
        this._layerGreenLimitThrowTank.setOpacity(100);
        this.sprMapBackground.addChild(this._layerGreenLimitThrowTank, 0);
        this._layerGreenLimitThrowTank.setPosition(tileMapSize.width, tileMapSize.height);
        this._layerGreenLimitThrowTank.setLocalZOrder(ZORDER_MID_GROUND);
    },
    getLayerGreenLimitThrowTank: function () {
        if (!this._layerGreenLimitThrowTank) {
            this.createLayerGreenLimitThrowTank();
        }
        return this._layerGreenLimitThrowTank;
    },
    removeLayerGreenLimitThrowTank: function () {
        if (this._layerGreenLimitThrowTank != null) {
            this._layerGreenLimitThrowTank.removeFromParent(true);
            this._layerGreenLimitThrowTank = null;
        }
    },
    //touch listener
    createTouchListenerOneByOneTank: function () {
        this.removeTouchListenerOneByOneTank();
        var _this = this;
        this._touchListenerBaseOneByOneTank_0 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: _this.onTouchBeganTank.bind(_this),
            onTouchMoved: _this.onTouchMovedTank.bind(_this),
            onTouchEnded: _this.onTouchEndedTank.bind(_this),
            onTouchCancelled: _this.onTouchCancelledTank.bind(_this)
        });
        this._touchListenerBaseOneByOneTank_1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: _this.onTouchBeganTank.bind(_this),
            onTouchMoved: _this.onTouchMovedTank.bind(_this),
            onTouchEnded: _this.onTouchEndedTank.bind(_this),
            onTouchCancelled: _this.onTouchCancelledTank.bind(_this)
        });
        this._touchListenerBaseOneByOneTank_2 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: _this.onTouchBeganTank.bind(_this),
            onTouchMoved: _this.onTouchMovedTank.bind(_this),
            onTouchEnded: _this.onTouchEndedTank.bind(_this),
            onTouchCancelled: _this.onTouchCancelledTank.bind(_this)
        });
        cc.eventManager.addListener(this._touchListenerBaseOneByOneTank_0, this.imgTank_0);
        cc.eventManager.addListener(this._touchListenerBaseOneByOneTank_1, this.imgTank_1);
        cc.eventManager.addListener(this._touchListenerBaseOneByOneTank_2, this.imgTank_2);
    },
    removeTouchListenerOneByOneTank: function () {
        if (this._touchListenerBaseOneByOneTank_0 != null) {
            cc.eventManager.removeListener(this._touchListenerBaseOneByOneTank_0);
        }
        this._touchListenerBaseOneByOneTank_0 = null;
        if (this._touchListenerBaseOneByOneTank_1 != null) {
            cc.eventManager.removeListener(this._touchListenerBaseOneByOneTank_1);
        }
        this._touchListenerBaseOneByOneTank_1 = null;
        if (this._touchListenerBaseOneByOneTank_2 != null) {
            cc.eventManager.removeListener(this._touchListenerBaseOneByOneTank_2);
        }
        this._touchListenerBaseOneByOneTank_2 = null;
    },
    onTouchBeganTank: function (touch, event) {
        var target = event.getCurrentTarget();
        var locationInNode = target.convertToNodeSpace(touch.getLocation());
        var s = target.getContentSize();
        var rect = cc.rect(0, 0, s.width, s.height);
        var isCorrect = cc.rectContainsPoint(rect, locationInNode);
        if (isCorrect) {
            LogUtils.getInstance().log([this.getClassName(), "touch tank began"]);
            Utility.getInstance().showTextOnScene(this.getClassName() + " touch tank began");
            this.getLayerRedLimitThrowTank().setVisible(true);
            this.getLayerGreenLimitThrowTank().setVisible(true);
            return true;
        } else {
            //LogUtils.getInstance().log([this.getClassName(), "touch not correct"]);
            return false;
        }
    },
    onTouchMovedTank: function (touch, event) {
        var target = event.getCurrentTarget();
        var parent = target.getParent();
        //target.setPosition(nPos);
        target.x += touch.getDelta().x;
        target.y += touch.getDelta().y;
        var worldPos = parent.convertToWorldSpace(target.getPosition());
        var nPos = this.getLayerGreenLimitThrowTank().convertToNodeSpace(worldPos);

        var rect = cc.rect(0, 0, this.getLayerGreenLimitThrowTank().getContentSize().width, this.getLayerGreenLimitThrowTank().getContentSize().height);
        if (cc.rectContainsPoint(rect, nPos)) {
            target.setScale(0.3);
        } else {
            target.setScale(1);
        }
        return true;
    },
    onTouchEndedTank: function (touch, event) {
        LogUtils.getInstance().log([this.getClassName(), "touch tank ended"]);
        var target = event.getCurrentTarget();
        var parent = target.getParent();
        var worldPos = parent.convertToWorldSpace(target.getPosition());
        var validArea = this.getLayerGreenLimitThrowTank();
        var nPos = validArea.convertToNodeSpace(worldPos);

        var rect = cc.rect(0, 0, validArea.getContentSize().width, validArea.getContentSize().height);
        if (cc.rectContainsPoint(rect, nPos)) {
            var type;
            switch (target) {
                case this.imgTank_0:
                    type = TANK_LIGHT;
                    break;
                case this.imgTank_1:
                    type = TANK_MEDIUM;
                    break;
                case this.imgTank_2:
                    type = TANK_HEAVY;
                    break;
                default :
                    type = TANK_LIGHT;
                    break;
            }
            gv.engine.getBattleMgr().throwTank(worldPos, gv.engine.getBattleMgr().getPlayerMgr().getMyTeam(), type);
            this.updateDisplayPickTankSlot();
        }
        target.setPosition(parent.getContentSize().width / 2, parent.getContentSize().height / 2);
        target.setScale(1);
        this.removeLayerRedLimitThrowTank();
        this.removeLayerGreenLimitThrowTank();
    },
    onTouchCancelledTank: function (touch, event) {
        LogUtils.getInstance().log([this.getClassName(), "touch tank cancelled"]);
        var target = event.getCurrentTarget();
        var parent = target.getParent();
        target.setPosition(parent.getContentSize().width / 2, parent.getContentSize().height / 2);
        target.setScale(1);
        this.removeLayerRedLimitThrowTank();
        this.removeLayerGreenLimitThrowTank();
    },

    checkTankAction: function (touch) {
        var tank = gv.engine.getBattleMgr().getCurrentSelectedTank();
        if (!tank) {
            LogUtils.getInstance().error([this.getClassName(), "checkTankAction not yet select tank"]);
            return false;
        }
        var parent = tank.getParent();
        var worldPos = parent.convertToWorldSpace(tank.getPosition());
        var touchPos = touch.getLocation();
        var delta = cc.pSub(touchPos, worldPos);
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            if (delta.x > 0) {
                //move to right
                tank.tankAction(cc.KEY.right);
            } else {
                tank.tankAction(cc.KEY.left);
            }
        } else {
            if (delta.y > 0) {
                //move to top
                tank.tankAction(cc.KEY.up);
            } else {
                tank.tankAction(cc.KEY.down);
            }
        }
    },
    checkTouchPickTank: function (touch) {
        var worldPos = touch.getLocation();
        var list = [this.imgTank_0, this.imgTank_1, this.imgTank_2];
        var target;
        for (var i = 0; i < list.length; ++i) {
            target = list[i];
            if (target != null) {
                var locationInNode = target.convertToNodeSpace(worldPos);
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                var isCorrect = cc.rectContainsPoint(rect, locationInNode);
                if (isCorrect) {
                    return {
                        ID: target.getName(),
                        type: target.getName(),
                        gameObject: target
                    };
                }
            }
        }
        return null;
    },
    onTouchBegan: function (touch, event) {
        var worldPos = touch.getLocation();
        var gameObjectInfo = gv.engine.getBattleMgr().getMatchMgr().getGameObjectInfoByWorldPosition(worldPos);
        if (gameObjectInfo != null
            && gameObjectInfo.gameObject.getGameObjectString() == STRING_TANK
            && gv.engine.getBattleMgr().getPlayerMgr().isMyTeam(gameObjectInfo.gameObject.getTeam())) {
            LogUtils.getInstance().log([this.getClassName(), "onTouchBegan is during lock tank action", gameObjectInfo.ID, gameObjectInfo.type]);
            return false;
        }
        //check during pick tank
        gameObjectInfo = this.checkTouchPickTank(touch);
        if ((!gv.engine.getBattleMgr().getPlayerMgr().isAlreadyDoneThrowAllTank()) && (gameObjectInfo != null)) {
            LogUtils.getInstance().log([this.getClassName(), "onTouchBegan is during lock tank action THROW TANK", gameObjectInfo.ID, gameObjectInfo.type]);
            return false;
        }

        LogUtils.getInstance().log([this.getClassName(), "onTouchBegan check tank action"]);
        this.checkTankAction(touch);
        return true;
    },
    onTouchMoved: function (touch, event) {
        this.checkTankAction(touch);
        return true;
    },
    onTouchEnded: function (touch, event) {
        var tank = gv.engine.getBattleMgr().getCurrentSelectedTank();
        if (!tank) {
            LogUtils.getInstance().error([this.getClassName(), "onTouchEnded not yet select tank"]);
            return false;
        }
        tank.tankAction(null);
    },
    onTouchCancelled: function (touch, event) {
        var tank = gv.engine.getBattleMgr().getCurrentSelectedTank();
        if (!tank) {
            LogUtils.getInstance().error([this.getClassName(), "onTouchCancelled not yet select tank"]);
            return false;
        }
        tank.tankAction(null);
    },
    onKeyPressed: function (keyCode, event) {
        //todo override me
        //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed keyCode", keyCode]);
        var tank = gv.engine.getBattleMgr().getCurrentSelectedTank();
        if (!tank) {
            LogUtils.getInstance().error([this.getClassName(), "onKeyPressed not yet select tank"]);
            return false;
        }
        switch (keyCode) {
            case cc.KEY.up:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed UP", keyCode]);
                tank.setDirection(DIRECTION_UP);
                tank.getMapPressAction()["up"] = true;
                break;
            case cc.KEY.down:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed DOWN", keyCode]);
                tank.setDirection(DIRECTION_DOWN);
                tank.getMapPressAction()["down"] = true;
                break;
            case cc.KEY.left:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed LEFT", keyCode]);
                tank.setDirection(DIRECTION_LEFT);
                tank.getMapPressAction()["left"] = true;
                break;
            case cc.KEY.right:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyPressed RIGHT", keyCode]);
                tank.setDirection(DIRECTION_RIGHT);
                tank.getMapPressAction()["right"] = true;
                break;
            case cc.KEY.enter:
            case cc.KEY.space:
                if (!tank._isHunting) {
                    tank._isHunting = true;
                    tank.Hunt();
                } else {
                    tank._isHunting = false;
                    tank.stopHunt();
                }
                break;
        }
    },
    onKeyReleased: function (keyCode, event) {
        var isDuringPress;
        //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased keyCode", keyCode]);
        var tank = gv.engine.getBattleMgr().getCurrentSelectedTank();
        if (!tank) {
            LogUtils.getInstance().error([this.getClassName(), "onKeyReleased not yet select tank"]);
            return false;
        }
        switch (keyCode) {
            case cc.KEY.up:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased UP", keyCode]);
                tank.getMapPressAction()["up"] = false;
                break;
            case cc.KEY.down:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased DOWN", keyCode]);
                tank.getMapPressAction()["down"] = false;
                break;
            case cc.KEY.left:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased LEFT", keyCode]);
                tank.getMapPressAction()["left"] = false;
                break;
            case cc.KEY.right:
                //LogUtils.getInstance().log([this.getClassName(), "onKeyReleased RIGHT", keyCode]);
                tank.getMapPressAction()["right"] = false;
                break;
        }
        isDuringPress = tank.getMapPressAction()["left"] || tank.getMapPressAction()["right"];
        isDuringPress = isDuringPress || tank.getMapPressAction()["up"] || tank.getMapPressAction()["down"];
        if (isDuringPress) {
            if (tank.getMapPressAction()["up"]) {
                this.onKeyPressed(cc.KEY.up, event);
            } else if (tank.getMapPressAction()["down"]) {
                this.onKeyPressed(cc.KEY.down, event);
            } else if (tank.getMapPressAction()["left"]) {
                this.onKeyPressed(cc.KEY.left, event);
            } else if (tank.getMapPressAction()["right"]) {
                this.onKeyPressed(cc.KEY.right, event);
            }
        } else {
            tank.setDirection(DIRECTION_IDLE);
        }
    },
    onTouchUIEndEvent: function (sender) {
        switch (sender) {
            case this.btnBackToLobby:
                gv.engine.viewSceneLobby();
                break;
            case this.btnClose:
                gv.engine.end();
                break;
        }
    }
});

