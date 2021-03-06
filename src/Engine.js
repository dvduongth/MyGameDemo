'use strict';

var Engine = cc.Class.extend({
    _className: "Engine",
    getClassName: function(){
        return this._className;
    },
    ctor: function(){
        //todo something default here
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    initEngine: function () {
        //init mgr
        this.setLayerMgr(new LayerMgr());
        this.setSceneMgr(new BaseSceneMgr());
        this.getSceneMgr().setSceneFactory(new SceneFactory());
        this.getLayerMgr().setGUIFactory(new GUIFactory());
        this.setEffectMgr(new EffectMgr());
        this.setSoundMusicMgr(new SoundMusicMgr());
        this.setLoginMgr(new LoginMgr());
        this.setLobbyMgr(new LobbyMgr());
        this.setBattleMgr(new BattleMgr());
        this.setTutorialMgr(new TutorialMgr());

        //todo default
        this.viewSceneLoading();
    },
    setSceneMgr: function(mgr){
        this._sceneMgr = mgr;
    },
    getSceneMgr: function(){
        return this._sceneMgr;
    },
    setLayerMgr: function(mgr){
        this._layerMgr = mgr;
    },
    getLayerMgr: function(){
        return this._layerMgr;
    },
    setEffectMgr: function(mgr){
        this._effectMgr = mgr;
    },
    getEffectMgr: function(){
        return this._effectMgr;
    },
    setSoundMusicMgr: function(mgr){
        this._soundMusicMgr = mgr;
    },
    getSoundMusicMgr: function(){
        return this._soundMusicMgr;
    },
    setLoginMgr: function(mgr){
        this._loginMgr = mgr;
    },
    getLoginMgr: function(){
        return this._loginMgr;
    },
    setBattleMgr: function(mgr){
        this._battleMgr = mgr;
    },
    getBattleMgr: function(){
        return this._battleMgr;
    },
    setLobbyMgr: function(mgr){
        this._lobbyMgr = mgr;
    },
    getLobbyMgr: function(){
        return this._lobbyMgr;
    },
    setTutorialMgr: function(mgr){
        this._tutorialMgr = mgr;
    },
    getTutorialMgr: function(){
        return this._tutorialMgr;
    },
    viewSceneLoading: function () {
        this.getSceneMgr().viewSceneById(SCENE_ID.LOADING);
    },
    viewSceneLogin: function () {
        this.getSceneMgr().viewSceneById(SCENE_ID.LOGIN, true);
        this.getSoundMusicMgr().playMusicLobby();
    },
    viewSceneLobby: function () {
        this.getSceneMgr().viewSceneById(SCENE_ID.LOBBY);
        this.getSoundMusicMgr().playMusicLobby();
    },
    viewSceneBattle: function () {
        this.getSceneMgr().viewSceneById(SCENE_ID.BATTLE);
        this.getSoundMusicMgr().playMusicBattle();
    },
    isCurrentSceneBattle: function () {
        return this.getSceneMgr().isCurrentSceneById(SCENE_ID.BATTLE);
    },
    getSceneBattleIfExist: function(){
        return this.getSceneMgr().getSceneByIdIfExist(SCENE_ID.BATTLE);
    },
    end: function () {
        LogUtils.getInstance().log([this.getClassName(), "end! BYE BYE !!!"]);
        cc.director.end();
    }
});