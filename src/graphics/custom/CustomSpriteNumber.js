'use strict';

var CustomSpriteNumber;
CustomSpriteNumber = cc.Node.extend({
    _className: "CustomSpriteNumber",
    getClassName: function () {
        return this._className;
    },
    ctor: function (number, style) {
        this._super();
        this.setListSprite([]);
        this.setNumber(number);
        this.setStyle(style);
    },
    onEnter: function () {
        this._super();
        this.updateDisplayNumber();
    },
    setListSprite: function (l) {
        this._listSprite = [];
    },
    getListSprite: function () {
        return this._listSprite;
    },
    setStyle: function (style) {
        this._style = style;
    },
    getStyle: function () {
        return this._style;
    },

    setNumber: function (number) {
        if (number === undefined) {
            LogUtils.getInstance().error([this.getClassName(), "setNumber number undefined"]);
        }
        this._number = number;

    },
    getNumber: function () {
        return this._number;
    },
    setNumberContentSize: function (s) {
        this._numberContentSize = s;
    },
    getNumberContentSize: function () {
        return this._numberContentSize;
    },
    updateDisplayNumber: function () {
        var str = this.getNumber().toString();
        var size = cc.size(0, 0);
        var listSprite = this.getListSprite();
        listSprite.forEach(function (spr) {
            spr.removeFromParent(true);
        });
        listSprite.splice(0);
        var i = 0;
        var len = str.length;
        var spr;
        for (i = 0; i < len; ++i) {
            //var url = resImg.NUMBER__STYLE1__0_PNG;
            var fileName = resImg["NUMBER__STYLE" + this.getStyle() + "__" + str[i] + "_PNG"];
            spr = Utility.getInstance().createSpriteFromFileName(fileName);
            this.addChild(spr);
            size.width += spr.getContentSize().width;
            size.height = Math.max(size.height, spr.getContentSize().height);
            listSprite.push(spr);
        }
        this.setNumberContentSize(size);
        //update position
        if(len > 1) {
            var margin = 0;
            var startX = -(size.width + margin * (len - 1)) / 2;
            for (i = 0; i < len; ++i) {
                spr = listSprite[i];
                startX += spr.getContentSize().width / 2;
                spr.setPositionX(startX);
                startX += spr.getContentSize().width / 2 + margin;
            }
        }
    },
    getContentSize: function () {
        return this.getNumberContentSize();
    }
});
