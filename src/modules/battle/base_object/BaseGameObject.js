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
        this.setListTileLogicPointIndex([]);
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
        //todo children used
        this._HPMax = t;
    },
    getHPMax: function () {
        //todo children used
        return this._HPMax;
    },
    setFlippedObj: function (eff) {
        //todo children used
        this._isFlippedObj = eff;
        this.getRootNode().setFlippedX(eff);
        this.getRootNode().setFlippedY(eff);
    },
    isFlippedObj: function () {
        //todo children used
        return this._isFlippedObj;
    },
    setVisible: function (eff) {
        this.getRootNode().setVisible(eff);
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
    setAnchorPoint: function (p, y) {
        if(y !== undefined) {
            this._anchorPoint = cc.p(p, y);
        }else{
            this._anchorPoint = p;
        }
        if(this.getRootNode() != null) {
            this.getRootNode().setAnchorPoint(this._anchorPoint);
        }
    },
    getAnchorPoint: function () {
        if(this.getRootNode() != null) {
            return this.getRootNode().getAnchorPoint();
        }
        return this._anchorPoint;
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
    setLocalZOrder: function (z) {
        this.getRootNode().setLocalZOrder(z);
    },
    // Draw
    update: function (dt) {
        //todo override me
    },
    destroy: function () {

    },
    getParent: function () {
        return this.getRootNode().getParent();
    },
    getWorldPosition: function () {
        return this.getParent().convertToWorldSpace(this.getPosition());
    },
    convertToNodeSpace: function (worldPos) {
        return this.getRootNode().convertToNodeSpace(worldPos);
    },
    createHPDisplayProgress: function () {
        //todo children used
        var progressBg = Utility.getInstance().createSpriteFromFileName(resImg.RESOURCES__TEXTURES__PROGRESS_RED_PNG);
        this.addChild(progressBg);
        progressBg.setPosition(this.getContentSize().width / 2, this.getContentSize().height + 2);
        this._HPDisplayProgress = Utility.getInstance().createLoadingBar(resImg.RESOURCES__TEXTURES__PROGRESS_BULE_PNG);
        progressBg.addChild(this._HPDisplayProgress);
        this._HPDisplayProgress.setPosition(progressBg.getContentSize().width / 2, progressBg.getContentSize().height / 2);
        this._HPDisplayProgress.setPercent(100);
        return progressBg;
    },
    getHPDisplayProgress: function () {
        //todo children used
        return this._HPDisplayProgress;
    },
    isAlive: function () {
        return this.getHP() > 0;
    },
    hitBullet: function (damage) {
        this.setHP(Math.max(this.getHP() - damage, 0));
        if(!this.isAlive()){
            //todo die
            this.destroy();
        }
    },
    hitAirStrike: function (damage) {
        this.hitBullet(damage);
    },
    setGameObjectString: function (l) {
        this._gameObjectString = l;
    },
    getGameObjectString: function () {
        return this._gameObjectString;
    },
    setGameObjectSizeNumberPoint: function (l) {
        this._gameObjectSizeNumberPoint = l;
    },
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
            if(tileLogic != null) {
                tileLogic.removeGameObjectIDOnTile(id);
            }
        });
        this.setListTileLogicPointIndex([]);
    }
});