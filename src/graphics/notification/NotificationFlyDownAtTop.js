"use strict";

var NotificationFlyDownAtTop = cc.Class.extend({
    _init: false,
    _imgBg: null,
    _lbMsg: null,
    _ndMsg: null,
    _speedShow: 0,
    _color: null,
    ctor: function () {

    },
    init: function(){
        this._init = true;

        this._imgBg = new cc.Scale9Sprite("res/lobby/bg_notification.png", cc.rect(0, 0, 624, 42), cc.rect(0, 0, 624, 42));
        this._imgBg.setCascadeOpacityEnabled(true);
        this._imgBg.setPosition(cc.director.getVisibleSize().width / 2, cc.director.getVisibleSize().height - 43);
        this._imgBg.retain();
        gv.layerMgr.getLayerByIndex(LayerId.LAYER_CURSOR).addChild(this._imgBg);

        this._lbMsg = new HtmlText(res.FONT_GAME_BOLD_ITALIC, 21);
        this._lbMsg.setMode(HtmlTextMode.WRAP_WIDTH, this._imgBg.getContentSize());
        this._lbMsg.setPosition(this._imgBg.width >> 1, 4 + this._imgBg.height >> 1);
        this._lbMsg.retain();

        this._imgBg.addChild(this._lbMsg);

        this._ndMsg = new cc.Node();
        this._ndMsg.setPosition(this._imgBg.width >> 1, 4 + this._imgBg.height >> 1);
        this._ndMsg.retain();

        this._imgBg.addChild(this._ndMsg);

        this.setSpeedShow(0.5);
    },

    setSpeedShow: function(s){
        this._speedShow = s;
    },

    /**
     *
     * @private
     */
    _done: function(){
        this._imgBg.setVisible(false);
    },

    /**
     *
     * @param showTime
     * @private
     */
    _run: function(showTime){
        // update position
        this._imgBg.stopAllActions();

        var visibleSize = cc.director.getVisibleSize();
        this._imgBg.y = visibleSize.height + (this._imgBg.height >> 1);
        this._imgBg.setVisible(true);

        // create action
        var moveIn = cc.moveTo(this._speedShow, this._imgBg.x, visibleSize.height - (this._imgBg.height >> 1));
        var delay = cc.delayTime(showTime);
        var moveOut = cc.moveTo(this._speedShow, this._imgBg.x, visibleSize.height + (this._imgBg.height >> 1));

        this._imgBg.runAction(cc.sequence(moveIn, delay, moveOut, cc.callFunc(this._done, this)));
    },

    /**
     * show a message text
     * @param text
     * @param duration
     */
    showTextMessage: function(text, duration){
        if(!this._init){
            this.init();
        }

        if(duration == undefined){
            duration = 3;
        }

        // update msg
        this._lbMsg.setString(text.replace("\n", ""));
        this._ndMsg.setVisible(false);
        this._run(duration);
    },

    /**
     * show a message with node content
     * @param node
     * @param duration
     */
    showContentNode: function(node, duration) {
        if(!this._init){
            this.init();
        }

        if(duration == undefined){
            duration = 3;
        }

        this._lbMsg.setString("");
        this._ndMsg.setVisible(true);
        this._ndMsg.removeAllChildren();
        this._ndMsg.addChild(node);
        this._run(duration);
    },

    hide: function(){
        if(this._imgBg){
            this._imgBg.setVisible(false);
        }
    },

    cleanUp: function () {
        // stop current notification
        if(this._lbMsg){
            this._lbMsg.stopAllActions();
            this._lbMsg.removeFromParentAndCleanup();
        }

        if(this._imgBg){
            this._imgBg.stopAllActions();
            this._imgBg.removeFromParentAndCleanup();
        }
    },
});

NotificationFlyDownAtTop.getInstance = function () {
    if (!this._instance) {
        this._instance = new NotificationFlyDownAtTop();
    }
    return this._instance;
};
