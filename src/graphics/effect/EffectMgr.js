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
    createAnimation: function (listFileName, isLoop, duration) {
        if(duration === undefined) {
            duration = 1;
        }
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
        animation.setDelayPerUnit(duration / len);
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
    showExplosion: function (worldPos, type, duration) {
        var arr = [];
        switch (type) {
            case EXPLOSION_TANK:
                arr = this.getListResourceForExplosionTank();
                break;
            case EXPLOSION_CANNON:
                arr = this.getListResourceForExplosionCannon();
                break;
            case EXPLOSION_OBSTACLE:
                arr = this.getListResourceForExplosionObstacle();
                break;
            case EXPLOSION_EMP:
                arr = this.getListResourceForExplosionEMP();
                break;
            case EXPLOSION_CANNON_MUZZLE:
                arr = this.getListResourceForExplosionCannonMuzzle();
                break;
            case EXPLOSION_GUN_MUZZLE:
                arr = this.getListResourceForExplosionGunMuzzle();
                break;
            case EXPLOSION_BULLET:
                arr = this.getListResourceForExplosionBullet();
                break;
            case EXPLOSION_BULLET_6:
                arr = this.getListResourceForExplosionBullet6();
                break;
            default :
                break;
        }
        var explosion = this.createAnimation(arr, false, duration);
        explosion.setPosition(worldPos);
        gv.engine.getLayerMgr().getLayerById(LAYER_ID.EFFECT).addChild(explosion);
        return explosion;
    },
    getListResourceForExplosionTank: function () {
        var arr = [];
        for (var i = 1; i <= 35; ++i) {
            var id = i < 10 ? "0" + i : i;
            arr.push(resImg["RESOURCES__TEXTURES__EXPLOSION__EX1__EX_" + id + "_PNG"]);
        }
        return arr;
    },
    getListResourceForExplosionCannon: function () {
        var arr = [];
        for (var i = 1; i <= 45; ++i) {
            var id = i < 10 ? "0" + i : i;
            arr.push(resImg["RESOURCES__TEXTURES__EXPLOSION__EX2__EX_" + id + "_PNG"]);
        }
        return arr;
    },
    getListResourceForExplosionObstacle: function () {
        var arr = [];
        for (var i = 1; i <= 16; ++i) {
            var id = i < 10 ? "0" + i : i;
            arr.push(resImg["RESOURCES__TEXTURES__EXPLOSION__EX3__EX_" + id + "_PNG"]);
        }
        return arr;
    },
    getListResourceForExplosionEMP: function () {
        var arr = [];
        for (var i = 1; i <= 39; ++i) {
            var id = i < 10 ? "0" + i : i;
            arr.push(resImg["RESOURCES__TEXTURES__EXPLOSION__EX4__EX_" + id + "_PNG"]);
        }
        return arr;
    },
    getListResourceForExplosionCannonMuzzle: function () {
        var arr = [];
        for (var i = 1; i <= 32; ++i) {
            var id = i < 10 ? "0" + i : i;
            arr.push(resImg["RESOURCES__TEXTURES__EXPLOSION__EX7__EX_" + id + "_PNG"]);
        }
        return arr;
    },
    getListResourceForExplosionGunMuzzle: function () {
        var arr = [];
        for (var i = 1; i <= 24; ++i) {
            var id = i < 10 ? "0" + i : i;
            arr.push(resImg["RESOURCES__TEXTURES__EXPLOSION__EX8__EX_" + id + "_PNG"]);
        }
        return arr;
    },
    getListResourceForExplosionBullet: function () {
        var arr = [];
        for (var i = 1; i <= 32; ++i) {
            var id = i < 10 ? "0" + i : i;
            arr.push(resImg["RESOURCES__TEXTURES__EXPLOSION__EX5__EX_" + id + "_PNG"]);
        }
        return arr;
    },
    getListResourceForExplosionBullet6: function () {
        var arr = [];
        for (var i = 1; i <= 32; ++i) {
            var id = i < 10 ? "0" + i : i;
            arr.push(resImg["RESOURCES__TEXTURES__EXPLOSION__EX6__EX_" + id + "_PNG"]);
        }
        return arr;
    }
});