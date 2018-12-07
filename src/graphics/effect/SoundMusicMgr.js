/**
 * SOUND MUSIC MANAGER
 */
'use strict';
var SoundMusicMgr = cc.Class.extend({
    _className: "SoundMusicMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {

        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    /**
     * @return {Number|null} the audio id
     * */
    playSoundEffect: function (soundPath, isLoop) {
        return -1;//todo test
        //LogUtils.getInstance().log("playSoundEffect: " + soundPath);
        if (soundPath == undefined) {
            LogUtils.getInstance().error(soundPath + "undefined!");
        }
        isLoop = typeof isLoop !== 'undefined' ? isLoop : false;
        return cc.audioEngine.playEffect(soundPath, isLoop);
    },
    stopSoundEffect: function (soundEffect) {
        if (soundEffect != null) {
            cc.audioEngine.stopEffect(soundEffect);
        }
    },
    stopAllEffects: function () {
        cc.audioEngine.stopAllEffects()
    },
    playMusic: function (musicPath, isLoop) {
        isLoop = typeof  isLoop !== 'undefined' ? isLoop : true;
        cc.audioEngine.playMusic(musicPath, isLoop);
    },
    stopMusic: function () {
        cc.audioEngine.stopMusic();
    },
    playMusicLobby: function () {
        //this.stopMusic();
        //this.playMusic(resSoundMusic.SOUNDS__MUSIC__MUSIC_LOBBY);
    },
    playMusicBattle: function () {
        //this.stopMusic();
        //this.playMusic(resSoundMusic.SOUNDS__MUSIC__MUSIC_MAIN_GAME);
    },
    preloadEffect: function (soundPath) {
        cc.audioEngine.preloadEffect(soundPath);
    },
    PlaySoundById: function (id) {
        switch (id) {
            case SOUND_AIRSTRIKE:
                return this.playSoundEffect(resSoundMusic.SOUNDS__SOUND__AIRSTRIKE);
            case SOUND_EMP:
                return this.playSoundEffect(resSoundMusic.SOUNDS__SOUND__EMP);
            case SOUND_BULLETIMPACT:
                return this.playSoundEffect(resSoundMusic.SOUNDS__SOUND__BULLETIMPACT);
            case SOUND_CANNONSHOT:
                return this.playSoundEffect(resSoundMusic.SOUNDS__SOUND__CANNONSHOT);
            case SOUND_GUNSHOT:
                return this.playSoundEffect(resSoundMusic.SOUNDS__SOUND__GUNSHOT);
            case SOUND_EXPLOSION_1:
                return this.playSoundEffect(resSoundMusic.SOUNDS__SOUND__EXPLOSION_1);
            case SOUND_EXPLOSION_2:
                return this.playSoundEffect(resSoundMusic.SOUNDS__SOUND__EXPLOSION_2);
            case SOUND_EXPLOSION_3:
                return this.playSoundEffect(resSoundMusic.SOUNDS__SOUND__EXPLOSION_3);
            case SOUND_EXPLOSION_4:
                return this.playSoundEffect(resSoundMusic.SOUNDS__SOUND__EXPLOSION_4);
            default :
                break;
        }
    }
});