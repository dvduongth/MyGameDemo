'use strict';
var GuiLoading = BaseGUI.extend({
    _className: "GuiLoading",
    ctor: function () {
        //todo ccs variables
        this.ndLoadingProgress = null;
        this.lbLoadingPercent = null;
        this.ldbPercent = null;
        this._super(resJson.ZCCS__GUI__LOADING__GUILOADING);
    },
    initGUI: function () {
        LogUtils.getInstance().log([this.getClassName(), "initGUI"]);
        this.reset();
    },
    setNumberOfSprites: function (value) {
        this._numberOfSprites = value;
        LogUtils.getInstance().log([this.getClassName(), "setNumberOfSprites value", value]);
    },
    getNumberOfSprites: function () {
        return this._numberOfSprites;
    },
    setNumberOfLoadedSprites: function (value) {
        this._numberOfLoadedSprites = value;
        LogUtils.getInstance().log([this.getClassName(), "setNumberOfLoadedSprites value", value]);
    },
    getNumberOfLoadedSprites: function () {
        return this._numberOfLoadedSprites;
    },
    setNumberOfPlist: function (value) {
        this._numberOfPlist = value;
        LogUtils.getInstance().log([this.getClassName(), "setNumberOfPlist value", value]);
    },
    getNumberOfPlist: function () {
        return this._numberOfPlist;
    },
    setNumberOfLoadedPlist: function (value) {
        this._numberOfLoadedPlist = value;
        LogUtils.getInstance().log([this.getClassName(), "setNumberOfLoadedPlist value", value]);
    },
    getNumberOfLoadedPlist: function () {
        return this._numberOfLoadedPlist;
    },
    setNumberOfSoundMusic: function (value) {
        this._numberOfSoundMusic = value;
        LogUtils.getInstance().log([this.getClassName(), "setNumberOfSoundMusic value", value]);
    },
    getNumberOfSoundMusic: function () {
        return this._numberOfSoundMusic;
    },
    setNumberOfLoadedSoundMusic: function (value) {
        this._numberOfLoadedSoundMusic = value;
        LogUtils.getInstance().log([this.getClassName(), "setNumberOfLoadedSoundMusic value", value]);
    },
    getNumberOfLoadedSoundMusic: function () {
        return this._numberOfLoadedSoundMusic;
    },
    onEnter: function () {
        LogUtils.getInstance().log([this.getClassName(), "onEnter"]);
        this._super();
    },

    reset: function () {
        LogUtils.getInstance().log([this.getClassName(), "reset"]);
        this.setNumberOfSprites(0);
        this.setNumberOfLoadedSprites(0);
        this.setNumberOfPlist(0);
        this.setNumberOfLoadedPlist(0);
        this.setNumberOfSoundMusic(0);
        this.setNumberOfLoadedSoundMusic(0);
        this.ndLoadingProgress.setVisible(false);
    },

    setLoadingTexturesDoneCallback: function (callback) {
        this._loadingTexturesCb = callback;
        LogUtils.getInstance().log([this.getClassName(), "setLoadingTexturesDoneCallback", callback != null ? "success" : "null"]);
    },
    getLoadingTexturesDoneCallback: function () {
        return this._loadingTexturesCb;
    },
    /**
     *load texture array by String
     * @param {Array} textureArr
     * @param callback
     */
    loadTextures: function(textureArr, callback){
        LogUtils.getInstance().log([this.getClassName(), "call loadTextures", callback != null ? " with callback" : "callback null"]);
        this.lbLoadingPercent.setString("START LOAD TEXTURES");
        this.setLoadingTexturesDoneCallback(callback);
        this.ndLoadingProgress.setVisible(true);
        this.setNumberOfSprites(textureArr.length);
        var texCache = cc.textureCache;
        for(var i = 0; i < this.getNumberOfSprites(); ++i){
            texCache.addImageAsync(textureArr[i], this.loadingCallBack, this);
        }
    },

    loadingCallBack:function () {
        this.setNumberOfLoadedSprites(this.getNumberOfLoadedSprites() + 1);
        var percent = Math.floor((this.getNumberOfLoadedSprites() / this.getNumberOfSprites()) * 100);
        this.lbLoadingPercent.setString(percent + '%');
        this.ldbPercent.setPercent(percent);
        //LogUtils.getInstance().log([this.getClassName(), "loadingCallBack percent", percent, "%"]);
        if (this.getNumberOfLoadedSprites() == this.getNumberOfSprites()) {
            this.loadTexturesDone();
        }
    },

    setLoadingDoneCallback: function (callback) {
        this._loadingCb = callback;
        LogUtils.getInstance().log([this.getClassName(), "setLoadingDoneCallback", callback != null ? "with callback" : "callback null"]);
    },
    getLoadingDoneCallback: function () {
        return this._loadingCb;
    },
    /**
     * auto call this function when all texture loaded
     * may be change scene or whatever
     */
    loadTexturesDone: function(){
        LogUtils.getInstance().log([this.getClassName(), "loadTexturesDone ----> loading done"]);
        this.lbLoadingPercent.setString("LOAD TEXTURES DONE");
        Utility.getInstance().executeFunction(this.getLoadingTexturesDoneCallback());
        this.setLoadingTexturesDoneCallback(null);
    },

    loadPlistTextures: function (plistPathObj, callback) {
        LogUtils.getInstance().log([this.getClassName(), "loadPlistTextures START LOAD PLIST TEXTURES"]);
        var _this = this;
        this.lbLoadingPercent.setString("START LOAD PLIST TEXTURES");
        this.ndLoadingProgress.setVisible(true);
        this.setNumberOfPlist(Object.keys(plistPathObj).length);
        var arr = [];
        for(var v in plistPathObj) {
            arr.push(cc.callFunc(function (sender, path) {
                //LogUtils.getInstance().log([_this.getClassName(), "loadPlistTextures path:", path]);
                cc.spriteFrameCache.addSpriteFrames(path);
                _this.setNumberOfLoadedPlist(_this.getNumberOfLoadedPlist() + 1);
                var percent = Math.floor((_this.getNumberOfLoadedPlist() / _this.getNumberOfPlist()) * 100);
                _this.lbLoadingPercent.setString(percent + '%');
                _this.ldbPercent.setPercent(percent);
            }, null, plistPathObj[v]));
            arr.push(cc.delayTime(Setting.TIME_LOOP_RENDER));
        }
        arr.push(cc.callFunc(function () {
            Utility.getInstance().executeFunction(callback);
        }));
        this._rootNode.runAction(cc.sequence(arr));
    },

    loadSoundMusic: function (soundMusicPathObj, callback) {
        LogUtils.getInstance().log([this.getClassName(), "loadSoundMusic START LOAD SOUND MUSIC"]);
        this.lbLoadingPercent.setString("START LOAD SOUND MUSIC");
        var _this = this;
        this.ndLoadingProgress.setVisible(true);
        this.setNumberOfSoundMusic(Object.keys(soundMusicPathObj).length);
        var arr = [];
        for(var v in soundMusicPathObj) {
            arr.push(cc.callFunc(function (sender, path) {
                cc.audioEngine.preloadEffect(path);
                //LogUtils.getInstance().log([_this.getClassName(), "loadSoundMusic path:", path]);
                _this.setNumberOfLoadedSoundMusic(_this.getNumberOfLoadedSoundMusic() + 1);
                var percent = Math.floor((_this.getNumberOfLoadedSoundMusic() / _this.getNumberOfSoundMusic()) * 100);
                _this.lbLoadingPercent.setString(percent + '%');
                _this.ldbPercent.setPercent(percent);
            }, null, soundMusicPathObj[v]));
            arr.push(cc.delayTime(Setting.TIME_LOOP_RENDER));
        }
        arr.push(cc.callFunc(function () {
            Utility.getInstance().executeFunction(callback);
        }));
        this._rootNode.runAction(cc.sequence(arr));
    }
});