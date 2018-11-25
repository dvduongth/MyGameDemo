var PowerUp = cc.Sprite.extend({
	_className: "PowerUp",
	getClassName: function () {
		return this._className;
	},
	ctor: function (id, type) {
		this.setID(id);
		this.setType(type);
		var path;
		switch (type) {
			case POWERUP_AIRSTRIKE:
				path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRSTRIKE_PNG);
				break;
			case POWERUP_EMP:
				path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__EMP_PNG);
				break;
			default :
				path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRSTRIKE_PNG);
				break;
		}
		this._super(path);
		this.initPowerUp();
	},
	setID: function (id) {
		this._ID = id;
	},
	getID: function () {
		return this._ID;
	},
	setType: function (t) {
		this._type = t;
	},
	getType: function () {
		return this._type;
	},
	initPowerUp: function () {

	}
});