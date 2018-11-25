"use strict";
var Obstacle = BaseGameObject.extend({
	_className: "Obstacle",
	ctor: function (id, rootNode, type) {
		//super
		this._super(id, rootNode, null, type);
		this.initObstacle();
	},
	initObstacle: function () {
		switch (this.getType()){
			case BLOCK_SOFT_OBSTACLE:
				this.setHP(Setting.OBSTACLE_HP);
				Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__BRICK___1_PNG);
				break;
			case BLOCK_HARD_OBSTACLE:
				this.setHP(0);
				Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__CONCRETE_PNG);
				break;
			case BLOCK_WATER:
				this.setHP(0);
				this._countdownUpdateWater = 0;
				Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__MAP__WATER_PNG);
				break;
			case BLOCK_GROUND:
			default :
				break;
		}
	},
	update: function (dt) {
		switch (this.getType()){
			case BLOCK_WATER:
				this._countdownUpdateWater++;
				if(this._countdownUpdateWater == 10){
					this._countdownUpdateWater = 0;
					var r = Math.random();
					var rootNode = this.getRootNode();
					if(r > 0.6){
						rootNode.setFlippedX(!rootNode.isFlippedX());
						rootNode.setFlippedY(!rootNode.isFlippedY());
					}else if(r > 0.3){
						rootNode.setFlippedX(!rootNode.isFlippedX());
					}else{
						rootNode.setFlippedY(!rootNode.isFlippedY());
					}
				}
				break;
			case BLOCK_GROUND:
			default :
				break;
		}
	},
});