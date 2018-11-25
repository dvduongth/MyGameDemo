'use strict';

var BaseGUI = cc.Layer.extend({
    _className: "BaseGUI",
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
            this._rootNode = json.node;
            this._rootAction = json.action;
            ccui.Helper.doLayout(this._rootNode);
            this.addChild(this._rootNode);
            this.syncAllChildren();
        }
        this.listListenerOnBaseGui = [];
        this.listBtnOnBaseGui = [];
    },
    initGUI: function () {
        //todo override me
    },

    setScaleMultiScreen: function (eff) {
        this._isScaleMultiScreen = eff;
    },

    onEnter: function () {
        this._super();
    },

    onExit: function () {
        this.removeAllListener();
        //todo check remove from GUIMgr
        this._super();
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
        var _this = this;
        this._touchListenerBaseOneByOne = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: _this.onTouchBegan,
            onTouchMoved: _this.onTouchMoved,
            onTouchEnded: _this.onTouchEnded,
            onTouchCancelled: _this.onTouchCancelled
        });
        cc.eventManager.addListener(this._touchListenerBaseOneByOne, this);
    },
    removeTouchListenerOneByOne: function () {
        if (this._touchListenerBaseOneByOne != null) {
            cc.eventManager.removeListener(this._touchListenerBaseOneByOne);
        }
        this._touchListenerBaseOneByOne = null;
    },

    createTouchListenerAllAtOnce: function () {
        this.removeTouchListenerAllAtOnce();
        var _this = this;
        this._touchListenerBaseAllAtOnce = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            swallowTouches: true,
            onTouchBegan: _this.onTouchBegan,
            onTouchMoved: _this.onTouchMoved,
            onTouchEnded: _this.onTouchEnded,
            onTouchCancelled: _this.onTouchCancelled
        });
        cc.eventManager.addListener(this._touchListenerBaseAllAtOnce, this);
    },
    removeTouchListenerAllAtOnce: function () {
        if (this._touchListenerBaseAllAtOnce != null) {
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
        var _this = this;
        this._keyboardListenerBase = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: _this.onKeyPressed,
            onKeyReleased: _this.onKeyReleased
        });
        cc.eventManager.addListener(this._keyboardListenerBase, this);
    },
    removeKeyBoardListener: function () {
        if (this._keyboardListenerBase != null) {
            cc.eventManager.removeListener(this._keyboardListenerBase);
        }
        this._keyboardListenerBase = null;
    },
    onKeyPressed: function (keyCode, event) {
        //todo override me
    },
    onKeyReleased: function (keyCode, event) {
        //todo override me
    },

    createAccelerationEventListener: function () {
        this.removeAccelerationEventListener();
        var _this = this;
        this._accelerationEventListenerBase = cc.EventListener.create({
            event: cc.EventListener.ACCELERATION,
            onAccelerationEvent: _this.onAccelerationEvent
        });
        cc.eventManager.addListener(this._accelerationEventListenerBase, this);
    },
    removeAccelerationEventListener: function () {
        if (this._accelerationEventListenerBase != null) {
            cc.eventManager.removeListener(this._accelerationEventListenerBase);
        }
        this._accelerationEventListenerBase = null;
    },

    onAccelerationEvent: function (acc, event) {
        //todo override me
    },

    createFocusListener: function () {
        this.removeFocusListener();
        var _this = this;
        this._focusListenerBase = cc.EventListener.create({
            event: cc.EventListener.FOCUS,
            onFocusChanged: _this.onFocusChanged
        });
        cc.eventManager.addListener(this._focusListenerBase, this);
    },
    removeFocusListener: function () {
        if (this._focusListenerBase != null) {
            cc.eventManager.removeListener(this._focusListenerBase);
        }
        this._focusListenerBase = null;
    },

    onFocusChanged: function (widgetLoseFocus, widgetGetFocus) {
        //todo override me
    },

    //todo button
    enableAllActionPressedButton: function () {
        for (var i = 0; i < this.listBtnOnBaseGui.length; i++) {
            this.enableActionPressedButton(this.listBtnOnBaseGui[i]);
        }
    },
    disableAllActionPressedButton: function () {
        for (var i = 0; i < this.listBtnOnBaseGui.length; i++) {
            this.disableActionPressedButton(this.listBtnOnBaseGui[i]);
        }
    },

    enableActionPressedButton: function (btn) {
        var children = btn.getChildren();

        //if(children.length > 0 && children[0].name.indexOf("lb" == 0)){
        for (var i = 0; i < children.length; i++) {
            if (children[i] === undefined)
                continue;
            children[i].removeFromParent(false);
            var labelPos = btn.getTitleRenderer().getPosition();
            var textPos = children[i].getPosition();
            btn.getTitleRenderer().addChild(children[i]);
            btn.offsetChildPos = {
                x: -labelPos.x,
                y: -labelPos.y
            };
            children[i].setPosition(textPos.x - labelPos.x, textPos.y - labelPos.y);
        }
    },
    disableActionPressedButton: function (btn) {
        var children = btn.getTitleRenderer().getChildren();
        //if(children.length > 0 && children[0].name.indexOf("lb" == 0)){
        for (var i = 0; i < children.length; i++) {
            if (children[i] === undefined)
                continue;
            children[i].removeFromParent(false);
            var labelPos = btn.getTitleRenderer().getPosition();
            var textPos = children[i].getPosition();
            btn.addChild(children[i]);
            children[i].setPosition(textPos.x + labelPos.x, textPos.y + labelPos.y);
        }
    },
    showGui: function (eff) {
        var that = this;
    },
    finishEffectShowGui: function () {

    },
    hideGui: function () {
        this.visible = false;
        this.isShowing = false;
        this.removeAllListenerOnBaseGui();
    },
    destroy: function () {
        this.removeFromParent();
    },
    addListListenerOnBaseGui: function (listener) {
        this.listListenerOnBaseGui.push(listener);
    },
    removeAllListenerOnBaseGui: function () {
        for (var i = 0; i < this.listListenerOnBaseGui.length; i++) {
            if (this.listListenerOnBaseGui[i])
                cc.eventManager.removeListener(this.listListenerOnBaseGui[i]);
        }
        this.listListenerOnBaseGui.splice(0, this.listListenerOnBaseGui.length);
        this.listListenerOnBaseGui = [];
    },

    syncAllChildren: function () {
        LogUtils.getInstance().log([this.getClassName(), "start syncAllChildren"]);
        this._syncChildrenInNode(this._rootNode);
        LogUtils.getInstance.log([this.getClassName(), "syncAllChildren success"]);
    },

    _syncChildrenInNode: function (node) {
        if (node == null) {
            return false;
        }
        var allChildren = node.getChildren();
        if (allChildren == null || allChildren.length == 0) {
            return false;
        }
        var nameChild;
        LogUtils.getInstance().log(["length", allChildren.length]);
        for (var i = 0; i < allChildren.length; i++) {
            nameChild = allChildren[i].getName();
            LogUtils.getInstance().log(["_syncChildrenInNode i =", i, nameChild]);
            if (nameChild in this && this[nameChild] === null) {
                this[nameChild] = allChildren[i];
                LogUtils.getInstance().log([this.getClassName(), "i =", i, "_syncChildrenInNode got it: name ", nameChild]);
                if (nameChild.indexOf("btn") != -1) {
                    this[nameChild].addTouchEventListener(this._onTouchUIEvent, this);
                    this[nameChild].setPressedActionEnabled(true);
                }
            }
            this._syncChildrenInNode(allChildren[i]);
            LogUtils.getInstance().log(["for next i =", i + 1]);
        }
        LogUtils.getInstance().log([this.getClassName(), "_syncChildrenInNode for done"]);
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

