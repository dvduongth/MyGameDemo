var Strike = cc.Sprite.extend({
	_className: "Strike",
	getClassName: function () {
		return this._className;
	},
	ctor: function (id, team) {
		this.setID(id);
		this.setTeam(team);
		var path;
		switch (team) {
			case TEAM_1:
				path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRPLANE___1_PNG);
				break;
			case TEAM_2:
				path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRPLANE___2_PNG);
				break;
			default :
				path = Utility.getInstance().getSpriteFileName(resImg.RESOURCES__TEXTURES__POWERUP__AIRPLANE___1_PNG);
				break;
		}
		this._super(path);
		this.initStrike();
	},
	setID: function (id) {
		this._ID = id;
	},
	getID: function () {
		return this._ID;
	},
	setTeam: function (t) {
		this._team = t;
	},
	getTeam: function () {
		return this._team;
	},
	initStrike: function () {
		var AIRPLANE_OFFSET = -50;
		var AIRPLANE_SPRITE_SIZE = 250;
		var AIRPLANE_SMOKE_OFFSET_X_1 = 35;
		var AIRPLANE_SMOKE_OFFSET_Y_1 = 95;
		var AIRPLANE_SMOKE_OFFSET_X_2 = 105;
		var AIRPLANE_SMOKE_OFFSET_Y_2 = 95;
	}
});