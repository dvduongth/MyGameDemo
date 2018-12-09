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
    },
    spawn: function (type, x, y) {
        return false;//todo test edit after
        if (!instance.m_living) {
            instance.m_x = x;
            instance.m_y = y;
            instance.m_type = type;
            instance.m_countDown = Setting.POWERUP_DELAY[type];
            instance.m_living = true;
        }
    },
    update: function (dt) {
        return false;//todo test edit after
        if (instance.m_living) {
            if (instance.m_countDown > 0) {
                instance.m_countDown--;
            }
            else {
                // Strike here
                instance.m_living = false;

                if (instance.m_type == Enum.POWERUP_AIRSTRIKE) {
                    for (var i = 0; i < game.m_tanks[Enum.TEAM_1].length; i++) {
                        var tempTank = game.m_tanks[Enum.TEAM_1][i];
                        if (tempTank.m_HP > 0) {
                            if ((instance.m_x - tempTank.m_x) * (instance.m_x - tempTank.m_x) + (instance.m_y - tempTank.m_y) * (instance.m_y - tempTank.m_y) <= Setting.AIRSTRIKE_AOE * Setting.AIRSTRIKE_AOE) {
                                tempTank.Hit(Setting.AIRSTRIKE_DAMAGE);
                            }
                        }
                    }
                    for (var i = 0; i < game.m_tanks[Enum.TEAM_2].length; i++) {
                        var tempTank = game.m_tanks[Enum.TEAM_2][i];
                        if (tempTank.m_HP > 0) {
                            if ((instance.m_x - tempTank.m_x) * (instance.m_x - tempTank.m_x) + (instance.m_y - tempTank.m_y) * (instance.m_y - tempTank.m_y) <= Setting.AIRSTRIKE_AOE * Setting.AIRSTRIKE_AOE) {
                                tempTank.Hit(Setting.AIRSTRIKE_DAMAGE);
                            }
                        }
                    }

                    for (var i = 0; i < game.m_obstacles.length; i++) {
                        var tempObstacle = game.m_obstacles[i];
                        if (tempObstacle.m_HP > 0) {
                            if ((instance.m_x - tempObstacle.m_x) * (instance.m_x - tempObstacle.m_x) + (instance.m_y - tempObstacle.m_y) * (instance.m_y - tempObstacle.m_y) <= Setting.AIRSTRIKE_AOE * Setting.AIRSTRIKE_AOE) {
                                tempObstacle.Hit(Setting.AIRSTRIKE_DAMAGE);
                            }
                        }
                    }

                    for (var i = 0; i < game.m_bases[Enum.TEAM_1].length; i++) {
                        var tempBase = game.m_bases[Enum.TEAM_1][i];
                        if (tempBase.m_HP > 0) {
                            if ((instance.m_x - tempBase.m_x) * (instance.m_x - tempBase.m_x) + (instance.m_y - tempBase.m_y) * (instance.m_y - tempBase.m_y) <= (Setting.AIRSTRIKE_AOE + 1) * (Setting.AIRSTRIKE_AOE + 1)) {
                                tempBase.Hit(Setting.AIRSTRIKE_DAMAGE);
                            }
                        }
                    }
                    for (var i = 0; i < game.m_bases[Enum.TEAM_2].length; i++) {
                        var tempBase = game.m_bases[Enum.TEAM_2][i];
                        if (tempBase.m_HP > 0) {
                            if ((instance.m_x - tempBase.m_x) * (instance.m_x - tempBase.m_x) + (instance.m_y - tempBase.m_y) * (instance.m_y - tempBase.m_y) <= (Setting.AIRSTRIKE_AOE + 1) * (Setting.AIRSTRIKE_AOE + 1)) {
                                tempBase.Hit(Setting.AIRSTRIKE_DAMAGE);
                            }
                        }
                    }
                }
                else if (instance.m_type == Enum.POWERUP_EMP) {
                    for (var i = 0; i < game.m_tanks[Enum.TEAM_1].length; i++) {
                        var tempTank = game.m_tanks[Enum.TEAM_1][i];
                        if (tempTank.m_HP > 0) {
                            if ((instance.m_x - tempTank.m_x) * (instance.m_x - tempTank.m_x) + (instance.m_y - tempTank.m_y) * (instance.m_y - tempTank.m_y) <= Setting.EMP_AOE * Setting.EMP_AOE) {
                                tempTank.EMP(Setting.EMP_DURATION);
                            }
                        }
                    }
                    for (var i = 0; i < game.m_tanks[Enum.TEAM_2].length; i++) {
                        var tempTank = game.m_tanks[Enum.TEAM_2][i];
                        if (tempTank.m_HP > 0) {
                            if ((instance.m_x - tempTank.m_x) * (instance.m_x - tempTank.m_x) + (instance.m_y - tempTank.m_y) * (instance.m_y - tempTank.m_y) <= Setting.EMP_AOE * Setting.EMP_AOE) {
                                tempTank.EMP(Setting.EMP_DURATION);
                            }
                        }
                    }
                }
            }
        }
    },
});