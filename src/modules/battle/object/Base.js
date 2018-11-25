"use strict";
var Base = BaseGameObject.extend({
    _className: "Base",
    ctor: function (id, rootNode, team, type) {
        //super
        this._super(id, rootNode, team, type);
        this.initBase();
    },
    initBase: function () {
        switch (this.getType()){
            case BASE_MAIN:
                this.setHP(Setting.BASE_MAIN_HP);
                switch (this.getTeam()){
                    case TEAM_1:
                        Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__BASE__TEAM___1__MAINBASE_PNG);
                        break;
                    case TEAM_2:
                        Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__BASE__TEAM___2__MAINBASE_PNG);
                        break;
                }
                break;
            case BASE_SIDE:
                this.setHP(Setting.BASE_SIDE_HP);
                switch (this.getTeam()){
                    case TEAM_1:
                        Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__BASE__TEAM___1__SIDEBASE_PNG);
                        break;
                    case TEAM_2:
                        Utility.getInstance().updateSpriteWithFileName(this.getRootNode(), resImg.RESOURCES__TEXTURES__BASE__TEAM___2__SIDEBASE_PNG);
                        break;
                }
                break;
        }
    }
});