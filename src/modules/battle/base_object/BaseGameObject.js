"use strict";
var BaseGameObject = cc.Class.extend({
    _className: "BaseGameObject",
    getClassName: function () {
        return this._className;
    },
    ctor: function (id, rootNode, team, type) {
        this.setID(id);
        this.setRootNode(rootNode);
        this.setTeam(team);
        this.setType(type);
    },
    setID: function (id) {
        this._ID = id;
    },
    getID: function () {
        return this._ID;
    },
    setRootNode: function (id) {
        this._rootNode = id;
    },
    getRootNode: function () {
        return this._rootNode;
    },
    setTeam: function (t) {
        this._team = t;
    },
    getTeam: function () {
        return this._team;
    },
    setType: function (t) {
        this._type = t;
    },
    getType: function () {
        return this._type;
    },
    setHP: function (t) {
        this._HP = t;
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
    setFlippedObj: function (eff) {
        this._isFlippedObj = eff;
        this.getRootNode().setFlippedX(eff);
        this.getRootNode().setFlippedY(eff);
    },
    isFlippedObj: function () {
        return this._isFlippedObj;
    },
    setPosition: function (p, y) {
        if(y !== undefined) {
            this._position = cc.p(p, y);
        }else{
            this._position = p;
        }
        if(this.getRootNode() != null) {
            this.getRootNode().setPosition(this._position);
        }
    },
    getPosition: function () {
        if(this.getRootNode() != null) {
            return this.getRootNode().getPosition();
        }
        return this._position;
    },
    setContentSize: function (s, height) {
        if(height !== undefined) {
            this._size = cc.size(s, height);
        }else{
            this._size = s;
        }
        if(this.getRootNode() != null) {
            this.getRootNode().setContentSize(this._size);
        }
    },
    getContentSize: function () {
        if(this.getRootNode() != null) {
            return this.getRootNode().getContentSize();
        }
        return this._size;
    },
    setScale: function (s) {
        this._scale = s;
        if(this.getRootNode() != null) {
            this.getRootNode().setScale(this._scale);
        }
    },
    getScale: function () {
        if(this.getRootNode() != null) {
            return this.getRootNode().getScale();
        }
        return this._scale;
    },
    addChild: function (child) {
        this.getRootNode().addChild(child);
    },
    // Draw
    update: function (dt) {
        //todo override me
    },
    destroy: function () {
        if(this.getRootNode() != null) {
            this.getRootNode().removeFromParent(true);
        }
    },
    getParent: function () {
        return this.getRootNode().getParent();
    },
    getWorldPosition: function () {
        return this.getParent().convertToWorldSpace(this.getPosition());
    },
    createHPDisplayProgress: function () {
        var progressBg = Utility.getInstance().createSpriteFromFileName(resImg.RESOURCES__TEXTURES__PROGRESS_BG_PNG);
        this.addChild(progressBg);
        progressBg.setPosition(this.getContentSize().width / 2, this.getContentSize().height + progressBg.getContentSize().height / 2 + 2);
        this._HPDisplayProgress = Utility.getInstance().createLoadingBar(resImg.RESOURCES__TEXTURES__PROGRESS_BULE_PNG);
        progressBg.addChild(this._HPDisplayProgress);
        this._HPDisplayProgress.setPosition(progressBg.getContentSize().width / 2, progressBg.getContentSize().height / 2);
        this._HPDisplayProgress.setPercent(100);
    },
    getHPDisplayProgress: function () {
        return this._HPDisplayProgress;
    }
});