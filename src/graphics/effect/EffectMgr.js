/**
 * EFFECT MANAGER
 */
'use strict';

var EffectMgr = cc.Class.extend({
    _className: "EffectMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {

        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    createAnimation: function (listFileName, isLoop, callback) {
        if (!listFileName || listFileName.length == 0) {
            throw LogUtils.getInstance().error([this.getClassName(), "createAnimation with invalid param listFileName"]);
        }
        var ccNode = Utility.getInstance().createSpriteFromFileName(listFileName[0]);
        var animation = new cc.Animation();
        var len = listFileName.length;
        for (var i = 0; i < len; ++i) {
            var frameName = listFileName[i];
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(1 / 6);
        if (isLoop) {
            animation.setRestoreOriginalFrame(true);
        } else {
            animation.setRestoreOriginalFrame(false);
        }
        var action = cc.animate(animation);
        if (isLoop) {
            ccNode.runAction(cc.sequence(action, action.reverse()).repeatForever());
        } else {
            if (callback != null) {
                ccNode.runAction(cc.sequence(action, cc.callFunc(function () {
                    Utility.getInstance().executeFunction(callback);
                })));
            } else {
                ccNode.runAction(action);
            }
        }
        return ccNode;
    },
    showExplosion: function (worldPos) {
        var arr = [
            resImg.RESOURCES__TEXTURES__EXPLOSION__1_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__2_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__3_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__4_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__5_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__7_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__6_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__8_PNG
        ];
        var explosion = this.createAnimation(arr);
        explosion.setPosition(worldPos);
        gv.engine.getLayerMgr().getLayerById(LAYER_ID.EFFECT).addChild(explosion);
    }

});