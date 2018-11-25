'use strict';
var GuiLoading = BaseGUI.extend({
    _className: "GuiLoading",
    _numberOfSprites: 0,
    _numberOfLoadedSprites: 0,
    _numberOfPlist: 0,
    _numberOfLoadedPlist: 0,
    _numberOfSoundMusic: 0,
    _numberOfLoadedSoundMusic: 0,
    ctor: function () {
        this.ndLoadingProgress = null;
        this.lbLoadingPercent = null;
        this.ldbPercent = null;

        this._super(resJson.ZCCS__GUI__LOADING__GUILOADING);
    },
    initGUI: function () {

    },
    onEnter: function () {
        this._super();
        this.reset();
    },

    reset: function () {
        this._numberOfSprites = 0;
        this._numberOfLoadedSprites = 0;
        this._numberOfPlist = 0;
        this._numberOfLoadedPlist = 0;
        this._numberOfSoundMusic = 0;
        this._numberOfLoadedSoundMusic = 0;
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
        this._numberOfSprites = textureArr.length;
        var texCache = cc.textureCache;
        for(var i = 0; i < textureArr.length; ++i){
            texCache.addImageAsync(textureArr[i], this.loadingCallBack, this);
        }
    },

    loadingCallBack:function () {
        ++this._numberOfLoadedSprites;
        var percent = Math.floor((this._numberOfLoadedSprites / this._numberOfSprites) * 100);
        this.lbLoadingPercent.setString(percent + '%');
        this.ldbPercent.setPercent(percent);
        LogUtils.getInstance().log([this.getClassName(), "loadingCallBack percent", percent, "%"]);
        if (this._numberOfLoadedSprites == this._numberOfSprites) {
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
        this._numberOfPlist = Object.keys(plistPathObj).length;
        var arr = [];
        for(var v in plistPathObj) {
            arr.push(cc.callFunc(function (sender, path) {
                LogUtils.getInstance().log([_this.getClassName(), "loadPlistTextures path:", path]);
                cc.spriteFrameCache.addSpriteFrames(path);
                ++_this._numberOfLoadedPlist;
                var percent = Math.floor((_this._numberOfLoadedPlist / _this._numberOfPlist) * 100);
                _this.lbLoadingPercent.setString(percent + '%');
                _this.ldbPercent.setPercent(percent);
            }, null, plistPathObj[v]));
            arr.push(cc.delayTime(0.01));
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
        this._numberOfSoundMusic = Object.keys(soundMusicPathObj).length;
        var arr = [];
        for(var v in soundMusicPathObj) {
            arr.push(cc.callFunc(function (sender, path) {
                cc.audioEngine.preloadEffect(path);
                LogUtils.getInstance().log([_this.getClassName(), "loadSoundMusic path:", path]);
                ++_this._numberOfLoadedSoundMusic;
                var percent = Math.floor((_this._numberOfLoadedSoundMusic / _this._numberOfSoundMusic) * 100);
                _this.lbLoadingPercent.setString(percent + '%');
                _this.ldbPercent.setPercent(percent);
            }, null, soundMusicPathObj[v]));
            arr.push(cc.delayTime(0.05));
        }
        arr.push(cc.callFunc(function () {
            Utility.getInstance().executeFunction(callback);
        }));
        this._rootNode.runAction(cc.sequence(arr));
    }
});