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
        if (duration === undefined) {
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
        var listSoundId;
        var rIdx;
        switch (type) {
            case EXPLOSION_TANK:
                arr = this.getListResourceForExplosionTank();
                listSoundId = [SOUND_EXPLOSION_1, SOUND_EXPLOSION_2, SOUND_EXPLOSION_3, SOUND_EXPLOSION_4];
                rIdx = Utility.getInstance().randomBetweenRound(0, listSoundId.length - 1);
                gv.engine.getSoundMusicMgr().playSoundEffectById(listSoundId[rIdx]);
                break;
            case EXPLOSION_CANNON:
                arr = this.getListResourceForExplosionCannon();
                listSoundId = [SOUND_EXPLOSION_1, SOUND_EXPLOSION_2, SOUND_EXPLOSION_3, SOUND_EXPLOSION_4];
                rIdx = Utility.getInstance().randomBetweenRound(0, listSoundId.length - 1);
                gv.engine.getSoundMusicMgr().playSoundEffectById(listSoundId[rIdx]);
                break;
            case EXPLOSION_OBSTACLE:
                arr = this.getListResourceForExplosionObstacle();
                listSoundId = [SOUND_EXPLOSION_1, SOUND_EXPLOSION_2, SOUND_EXPLOSION_3, SOUND_EXPLOSION_4];
                rIdx = Utility.getInstance().randomBetweenRound(0, listSoundId.length - 1);
                gv.engine.getSoundMusicMgr().playSoundEffectById(listSoundId[rIdx]);
                break;
            case EXPLOSION_EMP:
                arr = this.getListResourceForExplosionEMP();
                gv.engine.getSoundMusicMgr().playSoundEffectById(SOUND_EMP);
                break;
            case EXPLOSION_CANNON_MUZZLE:
                arr = this.getListResourceForExplosionCannonMuzzle();
                gv.engine.getSoundMusicMgr().playSoundEffectById(SOUND_CANNONSHOT);
                break;
            case EXPLOSION_GUN_MUZZLE:
                arr = this.getListResourceForExplosionGunMuzzle();
                gv.engine.getSoundMusicMgr().playSoundEffectById(SOUND_GUNSHOT);
                break;
            case EXPLOSION_BULLET:
                arr = this.getListResourceForExplosionBullet();
                gv.engine.getSoundMusicMgr().playSoundEffectById(SOUND_BULLETIMPACT);
                break;
            case EXPLOSION_BULLET_6:
                arr = this.getListResourceForExplosionBullet6();
                listSoundId = [SOUND_EXPLOSION_1, SOUND_EXPLOSION_2, SOUND_EXPLOSION_3, SOUND_EXPLOSION_4];
                rIdx = Utility.getInstance().randomBetweenRound(0, listSoundId.length - 1);
                gv.engine.getSoundMusicMgr().playSoundEffectById(listSoundId[rIdx]);
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
    },
    /**
     * animationName || args, animationRun, parent, pos, delay, durationTo, loop, zOder, autoRemove, funCall, isDelayVisibleTime
     * */
    playEffectDragonBones: function (animationName/*or args Object*/, animationRun, parent, pos, delay, durationTo, loop, zOder, autoRemove, funCall, isDelayVisibleTime) {
        if (animationName["animationName"] !== undefined) {
            //animationName is args object
            return this.playEffectDragonBonesByObjectArgument(animationName);
        } else {
            var args = {};
            args["animationName"] = animationName;
            args["animationRun"] = animationRun;
            args["parent"] = parent;
            args["pos"] = pos;
            args["delay"] = delay;
            args["durationTo"] = durationTo;
            args["loop"] = loop;
            args["zOder"] = zOder;
            args["autoRemove"] = autoRemove;
            args["funCall"] = funCall;
            args["isDelayVisibleTime"] = isDelayVisibleTime;
            return this.playEffectDragonBonesByObjectArgument(args);
        }
    },
    playEffectDragonBonesByObjectArgument: function (args) {
        var animationName, animationRun, parent, pos, delay, durationTo, loop, zOder, autoRemove, funCall, isDelayVisibleTime;
        animationName = args["animationName"];
        animationRun = args["animationRun"];
        parent = args["parent"];
        pos = args["pos"];
        delay = args["delay"];
        durationTo = args["durationTo"];
        loop = args["loop"];
        zOder = args["zOder"];
        autoRemove = args["autoRemove"];
        funCall = args["funCall"];
        isDelayVisibleTime = args["isDelayVisibleTime"];
        if (isDelayVisibleTime === undefined) {
            isDelayVisibleTime = false;
        }
        try {
            var effect = Utility.getInstance().createAnimationDragonBones(animationName);
            if (effect == null) {
                LogUtils.getInstance().log("fail effect " + animationName);
                return null;
            }
            if (pos === undefined) {
                pos = cc.p(gv.WIN_SIZE.width / 2, gv.WIN_SIZE.height / 2);
            }
            effect.setPosition(pos.x, pos.y);
            if (zOder === undefined) {
                zOder = 100;
            }
            if (parent === undefined) {
                parent = gv.engine.getLayerMgr().getLayerById(LAYER_ID.EFFECT);
            }
            parent.addChild(effect, zOder);
            if (isDelayVisibleTime) {
                effect.visible = false;
                setTimeout(function () {
                    if (effect) {
                        try {
                            if (!effect.removed) {
                                effect.visible = true;
                            }
                        } catch (exp) {
                            cc.error("can not set visible is true for effect");
                        }
                    }
                }, 5);
            }
            if (animationRun === undefined) {
                animationRun = "run";
            }
            if (delay === undefined) {
                delay = -1;
            }
            if (durationTo === undefined) {
                durationTo = -1;
            }
            if (loop === undefined) {
                loop = 1;
            }
            effect.gotoAndPlay(animationRun, delay, durationTo, loop);
            if (funCall !== undefined && funCall !== null) {
                effect._funCall = funCall;
            }
            effect._autoRemove = autoRemove;
            if (autoRemove === undefined) {
                effect._autoRemove = true;
            }
            effect.setCompleteListener(this.onFinishEffect);
            return effect;
        } catch (err) {
            Utility.getInstance().executeFunction(funCall);
            return null;
        }
    },
    onFinishEffect: function (effect) {
        LogUtils.getInstance().log("End Effect");
        if (effect._funCall !== undefined) {
            var cbFunc = effect._funCall;
            if (cbFunc != null) {
                Utility.getInstance().executeFunction(cbFunc);
            }
        }
        if (effect._autoRemove) {
            //LogUtils.getInstance().log(["oidm", effect._autoRemove]);
            effect.removeFromParent(true);
            effect.removed = true;
        }
    },
    showEffectSmoke: function (worldPos) {
        var parent = gv.engine.getLayerMgr().getLayerById(LAYER_ID.EFFECT);
        var zOrder = 1;
        var startSize = 6.0;
        var node = new cc.Node();
        parent.addChild(node, zOrder);
        var particleBlack = new cc.ParticleSmoke();
        var particleFrag = new cc.ParticleSmoke();
        var particleWhite = new cc.ParticleSmoke();
        node.addChild(particleBlack);
        node.addChild(particleFrag);
        node.addChild(particleWhite);
        var setupParticle = function (particle, ratioSize, worldPos, path) {
            var sSize = startSize * ratioSize;
            particle.setEmitterMode(cc.ParticleSystem.MODE_GRAVITY);
            particle.setRadialAccel(5);
            particle.setRadialAccelVar(2);
            particle.setSpeed(20);
            particle.setSpeedVar(1);
            particle.setLife(2);
            particle.setLifeVar(1);
            particle.setStartSize(sSize);
            particle.setStartSizeVar(sSize >> 1);
            particle.setTexture(cc.textureCache.addImage(path));
            particle.setPosition(worldPos);
        };
        setupParticle(particleBlack, 1, worldPos, resImg.RESOURCES__TEXTURES__PARTICLE__BLACKSMOKE_PNG);
        setupParticle(particleFrag, 3, worldPos, resImg.RESOURCES__TEXTURES__PARTICLE__FRAG_PNG);
        setupParticle(particleWhite, 2, worldPos, resImg.RESOURCES__TEXTURES__PARTICLE__WHITESMOKE_PNG);
        node.setScale = function (s) {
            particleBlack.setScale(s);
            particleFrag.setScale(s);
            particleWhite.setScale(s);
        };
        return node;
    },
    showEffectCountDown: function (number, lastSpriteDisplay, callback) {
        var parent = gv.engine.getLayerMgr().getLayerById(LAYER_ID.EFFECT);
        var centerPos = cc.p(gv.WIN_SIZE.width / 2, gv.WIN_SIZE.height / 2);
        var desScale = 3;
        var startScale = 10 * desScale;
        if (lastSpriteDisplay != null) {
            parent.addChild(lastSpriteDisplay);
            lastSpriteDisplay.setPosition(centerPos);
            lastSpriteDisplay.setVisible(false);
            lastSpriteDisplay.setOpacity(0);
        }
        var seq = [];
        var action = cc.sequence(
            cc.spawn(
                cc.sequence(
                    cc.fadeIn(0.1),
                    cc.delayTime(0.4)
                ),
                cc.scaleTo(0.5, desScale).easing(cc.easeElasticOut(0.7))
            ),
            cc.delayTime(0.3),
            cc.spawn(
                cc.moveBy(0.2, 0, 10 * startScale),
                cc.scaleTo(0.2, startScale / 2),
                cc.sequence(
                    cc.fadeOut(0.1),
                    cc.delayTime(0.1)
                )
            ),
            cc.removeSelf(true)
        );
        action.retain();
        for (var i = number; i > 0; --i) {
            var sprNumber = new CustomSpriteNumber(i, NUMBER_STYLE.style3);
            parent.addChild(sprNumber);
            sprNumber.setPosition(centerPos);
            sprNumber.setCascadeOpacityEnabled(true);
            sprNumber.setOpacity(0);
            sprNumber.setVisible(false);
            seq.push(cc.callFunc(function (sprNumber) {
                sprNumber.setVisible(true);
                sprNumber.setScale(startScale);
                sprNumber.runAction(action.clone());
            }.bind(this, sprNumber)));
            seq.push(cc.delayTime(1));
        }
        if (lastSpriteDisplay != null) {
            seq.push(cc.callFunc(function () {
                lastSpriteDisplay.setVisible(true);
                lastSpriteDisplay.setScale(startScale);
                lastSpriteDisplay.runAction(action.clone());
            }.bind(this)));
            seq.push(cc.delayTime(1));
        }
        seq.push(cc.callFunc(function () {
            action.release();
            action = null;
        }));
        if (callback !== undefined) {
            seq.push(cc.callFunc(function () {
                Utility.getInstance().executeFunction(callback);
            }));
        }
        parent.runAction(cc.sequence(seq));
    }
});