'use strict';

var BaseScene = cc.Scene.extend({
    _className: "BaseScene",
    getClassName: function () {
        return this._className;
    },
    _rootNode: null,
    _rootAction: null,
    ctor: function (jsonPath) {
        this._super();
        this.setContentSize(gv.WIN_SIZE);
        if (jsonPath !== undefined) {
            var json = ccs.load(jsonPath, "res/");
            this.setRootNode(json.node);
            this._rootAction = json.action;
            this._rootNode.setContentSize(gv.WIN_SIZE);
            ccui.Helper.doLayout(this._rootNode);
            this.addChild(this._rootNode);
            this.syncAllChildren();
        }
        if(gv.engine == null){
            LogUtils.getInstance().error("engine is null");
            return true;
        }
        if(gv.engine.getLayerMgr() == null){
            LogUtils.getInstance().error("layerMgr is null");
            return true;
        }
        gv.engine.getLayerMgr().createLayers(this);
    },
    setRootNode: function (r) {
        this._rootNode = r;
    },
    getRootNode: function () {
        return this._rootNode;
    },

    initScene: function () {

    },

    onEnter: function () {
        this._super();
        this.schedule(this.update, Setting.TIME_LOOP_FRAME_RATE);
    },
    update: function (dt) {
        //todo override me
    },
    getLayer: function (layerId) {
        return gv.engine.getLayerMgr().getLayer(this, layerId);
    },

    clearScene: function () {
        LogUtils.getInstance().log([this.getClassName(), "clearScene"]);
        this.unschedule(this.update);
        this.removeAllListener();
    },
    //todo listener
    removeAllListener: function () {
        this.removeTouchListenerOneByOne();
        this.removeTouchListenerAllAtOnce();
        this.removeKeyBoardListener();
        this.removeAccelerationEventListener();
        this.removeFocusListener();
    },

    createTouchListenerOneByOne: function () {
        this.removeTouchListenerOneByOne();
        LogUtils.getInstance().log(this.getClassName() + " createTouchListenerOneByOne");
        try {
            var _this = this;
            this._touchListenerBaseOneByOne = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: _this.onTouchBegan.bind(_this),
                onTouchMoved: _this.onTouchMoved.bind(_this),
                onTouchEnded: _this.onTouchEnded.bind(_this),
                onTouchCancelled: _this.onTouchCancelled.bind(_this)
            });
            cc.eventManager.addListener(this._touchListenerBaseOneByOne, this.getLayer(LAYER_ID.CURSOR));
        } catch (e) {
            LogUtils.getInstance().error([this.getClassName(), "createTouchListenerOneByOne not supported touches"]);
        }
    },
    removeTouchListenerOneByOne: function () {
        if (this._touchListenerBaseOneByOne != null) {
            LogUtils.getInstance().log(this.getClassName() + " removeTouchListenerOneByOne");
            cc.eventManager.removeListener(this._touchListenerBaseOneByOne);
        }
        this._touchListenerBaseOneByOne = null;
    },

    createTouchListenerAllAtOnce: function () {
        this.removeTouchListenerAllAtOnce();
        LogUtils.getInstance().log(this.getClassName() + " createTouchListenerAllAtOnce");
        try {
            var _this = this;
            this._touchListenerBaseAllAtOnce = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ALL_AT_ONCE,
                swallowTouches: false,
                onTouchBegan: _this.onTouchBegan.bind(_this),
                onTouchMoved: _this.onTouchMoved.bind(_this),
                onTouchEnded: _this.onTouchEnded.bind(_this),
                onTouchCancelled: _this.onTouchCancelled.bind(_this)
            });
            cc.eventManager.addListener(this._touchListenerBaseAllAtOnce, this.getLayer(LAYER_ID.CURSOR));
        } catch (e) {
            LogUtils.getInstance().error([this.getClassName(), "createTouchListenerAllAtOnce not supported touches"]);
        }
    },
    removeTouchListenerAllAtOnce: function () {
        if (this._touchListenerBaseAllAtOnce != null) {
            LogUtils.getInstance().log(this.getClassName() + " removeTouchListenerAllAtOnce");
            cc.eventManager.removeListener(this._touchListenerBaseAllAtOnce);
        }
        this._touchListenerBaseAllAtOnce = null;
    },
    onTouchBegan: function (touch, event) {
        //todo override me
    },

    onTouchMoved: function (touch, event) {
        //todo override me
    },

    onTouchEnded: function (touch, event) {
        //todo override me
    },

    onTouchCancelled: function (touch, event) {
        //todo override me
    },
    createKeyBoardListener: function () {
        this.removeKeyBoardListener();
        LogUtils.getInstance().log(this.getClassName() + " createKeyBoardListener");
        if ('keyboard' in cc.sys.capabilities) {
            var _this = this;
            this._keyboardListenerBase = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: _this.onKeyPressed.bind(_this),
                onKeyReleased: _this.onKeyReleased.bind(_this)
            });
            cc.eventManager.addListener(this._keyboardListenerBase, this);
        } else {
            LogUtils.getInstance().error([this.getClassName(), "createKeyBoardListener not supported keyboard"]);
        }
    },
    removeKeyBoardListener: function () {
        if (this._keyboardListenerBase != null) {
            LogUtils.getInstance().log(this.getClassName() + " removeKeyBoardListener");
            cc.eventManager.removeListener(this._keyboardListenerBase);
        }
        this._keyboardListenerBase = null;
    },
    // this callback is only available on JSB + OS X
    // Not supported on cocos2d-html5
    onKeyFlagsChanged: function (key) {
        LogUtils.getInstance().log("Key flags changed:" + key);
    },
    onKeyPressed: function (keyCode, event) {
        //todo override me
    },
    onKeyReleased: function (keyCode, event) {
        //todo override me
    },

    createAccelerationEventListener: function () {
        this.removeAccelerationEventListener();
        LogUtils.getInstance().log(this.getClassName() + " createAccelerationEventListener");
        if ('accelerometer' in cc.sys.capabilities) {
            var _this = this;
            var origin = cc.director.getVisibleOrigin();
            var size = cc.director.getVisibleSize();
            var sprite = Utility.getInstance().createSpriteFromFileName(resImg.RESOURCES__TEXTURES__BASE__TEAM___1__MAINBASE_PNG);
            sprite.setPosition(origin.x + size.width / 2, origin.y + size.height / 2);
            this.addChild(sprite);
            var _fix_pos = function (pos, min, max) {
                var ret = pos;
                if (pos < min)
                    ret = min;
                else if (pos > max)
                    ret = max;
                return ret;
            };
            // call is called 30 times per second
            cc.inputManager.setAccelerometerInterval(1 / 30);
            cc.inputManager.setAccelerometerEnabled(true);
            this._accelerationEventListenerBase = cc.EventListener.create({
                event: cc.EventListener.ACCELERATION,
                onAccelerationEvent: _this.onAccelerationEvent.bind(_this),
                callback: function (acc, event) {
                    self._logIndex++;
                    if (self._logIndex > 20) {
                        LogUtils.getInstance().log('Accel x: ' + acc.x + ' y:' + acc.y + ' z:' + acc.z + ' time:' + acc.timestamp);
                        self._logIndex = 0;
                    }

                    var target = event.getCurrentTarget();
                    var ballSize = target.getContentSize();
                    var ptNow = target.getPosition();

                    //cc.log("acc: x = " + acc.x + ", y = " + acc.y);
                    target.x = _fix_pos(ptNow.x + acc.x * 9.81,
                        (cc.visibleRect.left.x + ballSize.width / 2.0), (cc.visibleRect.right.x - ballSize.width / 2.0));
                    target.y = _fix_pos(ptNow.y + acc.y * 9.81,
                        (cc.visibleRect.bottom.y + ballSize.height / 2.0), (cc.visibleRect.top.y - ballSize.height / 2.0));
                }
            });
            cc.eventManager.addListener(this._accelerationEventListenerBase, sprite);
        } else {
            LogUtils.getInstance().error([this.getClassName(), "createAccelerationEventListener not supported accelerometer"]);
        }
    },
    removeAccelerationEventListener: function () {
        if (this._accelerationEventListenerBase != null) {
            LogUtils.getInstance().log(this.getClassName() + " removeAccelerationEventListener");
            cc.inputManager.setAccelerometerEnabled(false);
            cc.eventManager.removeListener(this._accelerationEventListenerBase);
        }
        this._accelerationEventListenerBase = null;
    },

    onAccelerationEvent: function (acc, event) {
        //todo override me
    },

    createFocusListener: function () {
        this.removeFocusListener();
        LogUtils.getInstance().log(this.getClassName() + " createFocusListener");
        var _this = this;
        this._focusListenerBase = cc.EventListener.create({
            event: cc.EventListener.FOCUS,
            onFocusChanged: _this.onFocusChanged.bind(_this)
        });
        cc.eventManager.addListener(this._focusListenerBase, this.getLayer(LAYER_ID.CURSOR));
    },
    removeFocusListener: function () {
        if (this._focusListenerBase != null) {
            LogUtils.getInstance().log(this.getClassName() + " removeFocusListener");
            cc.eventManager.removeListener(this._focusListenerBase);
        }
        this._focusListenerBase = null;
    },

    onFocusChanged: function (widgetLoseFocus, widgetGetFocus) {
        //todo override me
    },

    syncAllChildren: function () {
        LogUtils.getInstance().log([this.getClassName(), "start syncAllChildren"]);
        this._syncChildrenInNode(this._rootNode);
        LogUtils.getInstance().log([this.getClassName(), "syncAllChildren success"]);
    },

    _syncChildrenInNode: function (node) {
        if (node == null) {
            return false;
        }
        var allChildren = node.getChildren();
        if (allChildren == null || allChildren.length === 0) {
            return false;
        }
        var nameChild;
        //LogUtils.getInstance().log(["length",allChildren.length]);
        for (var i = 0; i < allChildren.length; i++) {
            nameChild = allChildren[i].getName();
            //LogUtils.getInstance().log(["_syncChildrenInNode",nameChild]);
            if (nameChild in this && this[nameChild] === null) {
                this[nameChild] = allChildren[i];
                LogUtils.getInstance().log([this.getClassName(), "got it: name ", nameChild]);
                if (nameChild.indexOf("btn") != -1) {
                    this[nameChild].addTouchEventListener(this._onTouchUIEvent, this);
                    this[nameChild].setPressedActionEnabled(true);
                }
            }
            this._syncChildrenInNode(allChildren[i]);
        }
        return true;
    },

    _onTouchUIEvent: function (sender, type) {
        switch (type) {
            case ccui.Widget.TOUCH_BEGAN:
                this.onTouchUIBeganEvent(sender);
                break;
            case ccui.Widget.TOUCH_MOVED:
                this.onTouchUIMovedEvent(sender);
                break;
            case ccui.Widget.TOUCH_ENDED:
                this.onTouchUIEndEvent(sender);
                break;
            case ccui.Widget.TOUCH_CANCELED:
                this.onTouchUICancelEvent(sender);
                break;
        }
    },

    onTouchUIBeganEvent: function (sender) {
        //todo override me
    },

    onTouchUIMovedEvent: function (sender) {
        //todo override me
    },

    onTouchUIEndEvent: function (sender) {
        //todo override me
    },

    onTouchUICancelEvent: function (sender) {
        //todo override me
    }
});