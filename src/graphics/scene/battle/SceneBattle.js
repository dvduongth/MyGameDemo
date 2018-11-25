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
        this.slotTank_3_Team_1 = null;
        this.imgTank_0_Team_1 = null;
        this.imgTank_1_Team_1 = null;
        this.imgTank_2_Team_1 = null;
        this.imgTank_3_Team_1 = null;

        this._super(resJson.ZCCS__SCENE__BATTLE__SCENEBATTLE);
    },
    initScene: function () {
        LogUtils.getInstance().log([this.getClassName(), "initScene success"]);
        Utility.getInstance().updateSpriteWithFileName(this.imgTank_0_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1A_PNG);
        Utility.getInstance().updateSpriteWithFileName(this.imgTank_1_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1B_PNG);
        Utility.getInstance().updateSpriteWithFileName(this.imgTank_2_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1C_PNG);
        Utility.getInstance().updateSpriteWithFileName(this.imgTank_3_Team_1, resImg.RESOURCES__TEXTURES__TANK__TEAM___1__1D_PNG);
        this.createTouchListenerOneByOneTank();
    },
    clearScene: function () {
        this.removeTouchListenerOneByOneTank();
        this._super();
    },

    createTouchListenerOneByOneTank: function () {
        this.removeTouchListenerOneByOneTank();
        var _this = this;
        this._touchListenerBaseOneByOneTank = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: _this.onTouchBeganTank.bind(_this),
            onTouchMoved: _this.onTouchMovedTank.bind(_this),
            onTouchEnded: _this.onTouchEndedTank.bind(_this),
            onTouchCancelled: _this.onTouchCancelledTank.bind(_this)
        });
        cc.eventManager.addListener(this._touchListenerBaseOneByOneTank, this.imgTank_0_Team_1);
    },
    removeTouchListenerOneByOneTank: function () {
        if (this._touchListenerBaseOneByOneTank != null) {
            cc.eventManager.removeListener(this._touchListenerBaseOneByOneTank);
        }
        this._touchListenerBaseOneByOneTank = null;
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
            LogUtils.getInstance().log([this.getClassName(), "touch not correct"]);
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
        if(cc.rectContainsPoint(rect, nPos)){
            target.setScale(0.3);
        }else{
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
        if(cc.rectContainsPoint(rect, nPos)){
            gv.engine.getBattleMgr().throwTank(this.sprMapBackground, nPos);
        }
        target.setPosition(parent.getContentSize().width / 2, parent.getContentSize().height / 2);
        target.setScale(1);
    },

    onTouchCancelledTank: function (touch, event) {
        //todo here
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

