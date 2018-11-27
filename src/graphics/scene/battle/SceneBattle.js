var SceneBattle = BaseScene.extend({
    _className: 'SceneBattle',
    ctor: function () {
        //todo ccs element
        this.btnBackToLobby = null;
        this.btnClose = null;
        this.sprMapBackground = null;
        this.slotTank_0_Team_1 = null;
        this.slotTank_1_Team_1 = null;
        this.slotTank_2_Team_1 = null;
        this.imgTank_0_Team_1 = null;
        this.imgTank_1_Team_1 = null;
        this.imgTank_2_Team_1 = null;
        this.imgTank_3_Team_1 = null;

        this._super(resJson.ZCCS__SCENE__BATTLE__SCENEBATTLE);
    },
    initScene: function () {
        this.setMapDisplayPickTank({});
        LogUtils.getInstance().log([this.getClassName(), "initScene success"]);
        this.createTouchListenerOneByOneTank();
        this.setMapKeyFindObject({});
        this.initBase();
        this.initObstacle();
        this.findAndInitGameObject();
        this.initDisplayPickTankSlot();
        this.createKeyBoardListener();
    },
    initDisplayPickTankSlot: function () {
        switch (gv.engine.getBattleMgr().getPlayerMgr().getMyTeam()){
            case TEAM_1:
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_0_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1A_PNG);
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_1_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__2A_PNG);
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_2_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__3A_PNG);
                break;
            case TEAM_2:
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_0_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___2__1A_PNG);
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_1_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___2__2A_PNG);
                Utility.getInstance().updateSpriteWithFileName(this.imgTank_2_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___2__3A_PNG);
                break;
        }
    },
    getListEnableTankType: function () {
        return [TANK_LIGHT, TANK_MEDIUM, TANK_HEAVY];
    },
    setMapDisplayPickTank: function (m) {
        this._mapDisplayPickTank = m;
    },
    getMapDisplayPickTank: function () {
        return this._mapDisplayPickTank;
    },
    clearScene: function () {
        this.removeTouchListenerOneByOneTank();
        this.removeKeyBoardListener();
        this._super();
    },
    updateDisplayPickTankSlot: function () {
        var maxNumTank = Setting.NUMBER_OF_TANK;
        var numberPicked = gv.engine.getBattleMgr().getBattleDataModel().getNumberPickedTank();
        if(numberPicked >= maxNumTank) {
            this.removeTouchListenerOneByOneTank();
            this.imgTank_0_Team_1.setVisible(false);
            this.imgTank_1_Team_1.setVisible(false);
            this.imgTank_2_Team_1.setVisible(false);
        }else{
            this.imgTank_0_Team_1.setVisible(true);
            this.imgTank_1_Team_1.setVisible(true);
            this.imgTank_2_Team_1.setVisible(true);

        }
    },
    initBase: function () {
        LogUtils.getInstance().log([this.getClassName(), "initBase"]);
        this.getMapKeyFindObject()["MainBase_0"] = function (child) {
            gv.engine.getBattleMgr().updateBase(child, TEAM_1, BASE_MAIN);
        };
        this.getMapKeyFindObject()["MainBase_1"] = function (child) {
            gv.engine.getBattleMgr().updateBase(child, TEAM_2, BASE_MAIN);
        };
        this.getMapKeyFindObject()["SideBase_0"] = function (child) {
            gv.engine.getBattleMgr().updateBase(child, TEAM_1, BASE_SIDE);
        };
        this.getMapKeyFindObject()["SideBase_1"] = function (child) {
            gv.engine.getBattleMgr().updateBase(child, TEAM_2, BASE_SIDE);
        };
    },
    initObstacle: function () {
        LogUtils.getInstance().log([this.getClassName(), "Obstacle"]);
        this.getMapKeyFindObject()["ObstacleSoft"] = function (child) {
            gv.engine.getBattleMgr().updateObstacle(child, BLOCK_SOFT_OBSTACLE);
        };
        this.getMapKeyFindObject()["ObstacleHard"] = function (child) {
            gv.engine.getBattleMgr().updateObstacle(child, BLOCK_HARD_OBSTACLE);
        };
        this.getMapKeyFindObject()["Water"] = function (child) {
            gv.engine.getBattleMgr().updateObstacle(child, BLOCK_WATER);
        };
    },
    update: function (dt) {
        gv.engine.getBattleMgr().update(dt);
    },
    setMapKeyFindObject: function (m) {
        this._mapKeyFindObject = m;
    },
    getMapKeyFindObject: function () {
        return this._mapKeyFindObject;
    },
    findAndInitGameObject: function () {
        var _this = this;
        function findObj (node) {
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
                if(nameChild in _this.getMapKeyFindObject() && _this.getMapKeyFindObject()[nameChild] != null){
                    _this.getMapKeyFindObject()[nameChild](child);
                }
                findObj(child);
            }
            return true;
        }
        findObj(this.getRootNode());
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
        cc.eventManager.addListener(this._touchListenerBaseOneByOneTank_0, this.imgTank_0_Team_1);
        cc.eventManager.addListener(this._touchListenerBaseOneByOneTank_1, this.imgTank_1_Team_1);
        cc.eventManager.addListener(this._touchListenerBaseOneByOneTank_2, this.imgTank_2_Team_1);
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
        var nPos = this.sprMapBackground.convertToNodeSpace(worldPos);

        var rect = cc.rect(0, 0, this.sprMapBackground.getContentSize().width, this.sprMapBackground.getContentSize().height);
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
        var nPos = this.sprMapBackground.convertToNodeSpace(worldPos);

        var rect = cc.rect(0, 0, this.sprMapBackground.getContentSize().width, this.sprMapBackground.getContentSize().height);
        if (cc.rectContainsPoint(rect, nPos)) {
            var type;
            switch (target) {
                case this.imgTank_0_Team_1:
                    type = TANK_LIGHT;
                    break;
                case this.imgTank_1_Team_1:
                    type = TANK_MEDIUM;
                    break;
                case this.imgTank_2_Team_1:
                    type = TANK_HEAVY;
                    break;
                default :
                    type = TANK_LIGHT;
                    break;
            }
            gv.engine.getBattleMgr().throwTank(this.sprMapBackground, nPos, gv.engine.getBattleMgr().getPlayerMgr().getMyTeam(), type);
            this.updateDisplayPickTankSlot();
        }
        target.setPosition(parent.getContentSize().width / 2, parent.getContentSize().height / 2);
        target.setScale(1);
    },

    onTouchCancelledTank: function (touch, event) {
        LogUtils.getInstance().log([this.getClassName(), "touch tank cancelled"]);
        var target = event.getCurrentTarget();
        var parent = target.getParent();
        target.setPosition(parent.getContentSize().width / 2, parent.getContentSize().height / 2);
        target.setScale(1);
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
        var tank = gv.engine.getBattleMgr().getCurrentSelectedTank();
        if(!tank) {
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
        if(!tank) {
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

