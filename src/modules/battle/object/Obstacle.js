"use strict";
var Obstacle = BaseGameObject.extend({
    _className: "Obstacle",
    ctor: function (id, rootNode, type) {
        //super
        this._super(id, rootNode, null, type);
        this.initObstacle();
    },
    initObstacle: function () {
        switch (this.getType()) {
            case BLOCK_SOFT_OBSTACLE:
                this.setHP(Setting.OBSTACLE_HP);
                this.getRootNode().setOpacity(255);
                Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__BRICK___1_PNG);
                break;
            case BLOCK_HARD_OBSTACLE:
                this.getRootNode().setOpacity(255);
                Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__CONCRETE_PNG);
                break;
            case BLOCK_WATER:
                this.getRootNode().setOpacity(Math.round(255 * MAP_WATER_ALPHA));
                this._countdownUpdateWater = 0;
                Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__WATER_PNG);
                break;
            case BLOCK_GROUND:
            default :
                break;
        }
    },
    update: function (dt) {
        switch (this.getType()) {
            case BLOCK_WATER:
                this._countdownUpdateWater++;
                if (this._countdownUpdateWater == 10) {
                    this._countdownUpdateWater = 0;
                    var r = Math.random();
                    var rootNode = this.getRootNode();
                    if (r > 0.6) {
                        rootNode.setFlippedX(!rootNode.isFlippedX());
                        rootNode.setFlippedY(!rootNode.isFlippedY());
                    } else if (r > 0.3) {
                        rootNode.setFlippedX(!rootNode.isFlippedX());
                    } else {
                        rootNode.setFlippedY(!rootNode.isFlippedY());
                    }
                }
                break;
            case BLOCK_GROUND:
            default :
                break;
        }
    },
    hitBullet: function (damage) {
        if (this.getType() == BLOCK_SOFT_OBSTACLE) {
            this._super(damage);
            if (this.getHP() > 0) {
                if (this.getHP() < 30) {
                    Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__BRICK___4_PNG);
                } else if (this.getHP() < 60) {
                    Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__BRICK___3_PNG);
                } else if (this.getHP() < 90) {
                    Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__BRICK___2_PNG);
                }
            }
        }
    },
    isBarrier: function () {
        if (this.getType() == BLOCK_SOFT_OBSTACLE) {
            return true;
        }
        if (this.getType() == BLOCK_HARD_OBSTACLE) {
            return true;
        }
        return false;
    },
    destroy: function () {
        var explosion = gv.engine.getEffectMgr().showExplosion(this.getWorldPosition(), EXPLOSION_OBSTACLE);
        explosion.setCompleteCallback(function () {
            explosion.removeFromParent(true);
        });
        Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__BRICK___5_PNG);
        gv.engine.getBattleMgr().removeObstacle(this.getID());
    }
});