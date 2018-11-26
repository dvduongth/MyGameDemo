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
    createAnimation: function (listFileName, isLoop) {
        if (!listFileName || listFileName.length == 0) {
            throw LogUtils.getInstance().error([this.getClassName(), "createAnimation with invalid param listFileName"]);
        }
        var ccNode = Utility.getInstance().createSpriteFromFileName(listFileName[0]);
        ccNode.setCompleteCallback = function (callback) {
            ccNode._completeCallback = callback;
        };
        ccNode.getCompleteCallback = function () {
            return ccNode._completeCallback;
        };

        var animation = new cc.Animation();
        var len = listFileName.length;
        for (var i = 0; i < len; ++i) {
            var frameName = listFileName[i];
            animation.addSpriteFrameWithFile(frameName);
        }
        animation.setDelayPerUnit(1 / 30);
        if (isLoop) {
            animation.setRestoreOriginalFrame(true);
        } else {
            animation.setRestoreOriginalFrame(false);
        }
        var action = cc.animate(animation);
        if (isLoop) {
            ccNode.runAction(cc.sequence(action, action.reverse()).repeatForever());
        } else {
            ccNode.runAction(cc.sequence(action, cc.callFunc(function () {
                if (ccNode.getCompleteCallback() != null) {
                    Utility.getInstance().executeFunction(ccNode.getCompleteCallback());
                }
            })));
        }
        return ccNode;
    },
    showExplosion: function (worldPos, type) {
        var arr = [
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_0_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_1_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_2_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_3_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_4_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_5_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_6_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_7_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_8_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_9_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_10_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_11_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_12_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_13_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_14_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_15_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_16_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_17_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_18_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_19_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_20_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_21_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_22_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_23_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_24_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_25_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_26_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_27_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_28_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_29_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_3_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_30_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_31_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_32_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_33_PNG,
            resImg.RESOURCES__TEXTURES__EXPLOSION__EXPLOSION_1__EX_34_PNG
        ];
        switch (type) {
            case EXPLOSION_TANK:
                break;
            case EXPLOSION_CANNON:
                break;
            case EXPLOSION_OBSTACLE:
                break;
            case EXPLOSION_EMP:
                break;
            case EXPLOSION_CANNON_MUZZLE:
                break;
            case EXPLOSION_GUN_MUZZLE:
                break;
            case EXPLOSION_BULLET:
                break;
            default :
                break;
        }
        var explosion = this.createAnimation(arr, false);
        explosion.setPosition(worldPos);
        gv.engine.getLayerMgr().getLayerById(LAYER_ID.EFFECT).addChild(explosion);
        return explosion;
    }

});