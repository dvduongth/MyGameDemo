"use strict";

var RichTextAlignment = {
    LEFT: 0,
    RIGHT: 1,
    CENTER: 2,
    JUSTIFIED: 3,
    TOP: 4,
    MIDDLE: 5,
    BOTTOM: 6
};

/**
 * example:
 * var ARENA_DESCRIPTION_1 = "<color = #F4A43C><size = 23><shadow = -2;-2>1. Phần thưởng Vua<image = @path_00@></image> đấu \ntrường</shadow></size></color>
 * \n- <stroke = 3;#B9F856>Phần thưởng<image = @path_0@>0.7</image> khi tổng\n kết <image = @path@>0.3</image> event</stroke> :";
 var rt = CustomRichText.create(ARENA_DESCRIPTION_1.replace("@path_00@", "res/lobby/g_icon.png")
 .replace("@path_0@", "res/lobby/g_icon.png")
 .replace("@path@", "skill_icon_101.png"));
 * */
var CustomRichTextExtend = ccui.RichText.extend({
    _className: "CustomRichTextExtend",
    ctor: function (size) {
        this._super();
        this._curId = 0;

        this._formatTextDirty = false;
        this._richElements = [];
        this._elementRenders = [];
        this._leftSpaceWidth = 0;
        this._verticalSpace = 0;
        this._textHorizontalAlignment = cc.TEXT_ALIGNMENT_LEFT;
        this._textVerticalAlignment = cc.VERTICAL_TEXT_ALIGNMENT_TOP;

        this._font = res.FONT_GAME_BOLD;
        this._size = 20;
        this._color = cc.color.WHITE;

        if (size !== undefined) {
            size = (size.width !== undefined && size.height !== undefined) ? size : cc.size(size, 0);
        } else {
            size = cc.size(gv.WIN_SIZE.width, 0);
        }
        this.setContentSize(size);
        this._contentSizeRichText = size;

        this.setCascadeOpacityEnabled(true);

        this.ignoreContentAdaptWithSize(false);

        if (!cc.sys.isNative) {
            this.setLineBreakOnSpace(true);
        }

        this.setName("CustomRichTextExtend");
    },

    getClassName: function () {
        return this._className;
    },

    getFontName: function () {
        return this._font;
    },

    getFontSize: function () {
        return this._size;
    },

    setTextContentSize: function (size) {
        this.setContentSize(size);
    },

    setDefaultFont: function (font) {
        this._font = font;
    },

    setDefaultSize: function (size) {
        this._size = size;
    },

    setDefaultColor: function (color) {
        this._color = color;
    },

    setDefaultAlignHorizontal: function (val) {
        if (cc.sys.isNative) {
            this.setAlignmentHorizontal(val);
        } else {
            if (val == RichTextAlignment.RIGHT) val = cc.TEXT_ALIGNMENT_RIGHT;
            else if (val == RichTextAlignment.CENTER) val = cc.TEXT_ALIGNMENT_CENTER;
            else if (val == RichTextAlignment.LEFT) val = cc.TEXT_ALIGNMENT_LEFT;
            this.setTextHorizontalAlignment(val);
        }
    },

    setDefaultAlignVertical: function (val) {
        if (cc.sys.isNative) {
            this.setAlignmentVertical(val);
        } else {
            if (val == RichTextAlignment.BOTTOM) val = cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM;
            else if (val == RichTextAlignment.MIDDLE) val = cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
            else if (val == RichTextAlignment.TOP) val = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
            this.setTextVerticalAlignment(val);
        }
    },

    createLabel: function (text, fontName, fontSize, color, opacity, stroke, shadow) {
        var label = new ccui.Text(text + '', fontName, fontSize);
        label.setColor(cc.color(color));
        label.setOpacity(opacity);
        label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        if (stroke) {
            label.enableOutline(stroke.strokeColor, stroke.strokeSize);
        }
        if (shadow) {
            label.enableShadow(shadow.shadowColor, shadow.shadowOffset, shadow.shadowSize);
        }

        return label;
    },

    appendText: function (text, font, size, color, opacity) {
        if (!text) return;
        var el = new ccui.RichElementText(
            this.getAutoId(),
            (color !== undefined) ? cc.color(color) : this._color,
            (opacity !== undefined) ? opacity : 255,
            text,
            (font !== undefined) ? font : this._font,
            (size !== undefined) ? parseInt(size) : this._size
        );
        this.pushBackElement(el);
    },

    appendTextWithFontDefinition: function (text, fontName, fontSize, fontColor, opacity, stroke, shadow) {
        if (!text) return;
        fontName = (fontName !== undefined) ? fontName : this._font;
        fontSize = (fontSize !== undefined) ? parseInt(fontSize) : this._size;
        fontColor = (fontColor !== undefined) ? cc.color(fontColor) : this._color;
        opacity = (opacity !== undefined) ? opacity : 255;
        var enableStroke = false;
        var enableShadow = false;
        var strokeSize = 1;
        var strokeColor = fontColor;
        var shadowOffsetX = 0;
        var shadowOffsetY = -2;
        var shadowColor = cc.color.BLACK;
        var shadowOffset = cc.size(shadowOffsetX, shadowOffsetY);
        var shadowSize = 1;
        if (stroke != null) {
            var arrStroke = stroke.split(";");
            if (arrStroke.length > 0) {
                enableStroke = true;
                strokeSize = arrStroke[0] != null ? arrStroke[0] : 1;
                strokeColor = arrStroke[1] != null ? cc.color(arrStroke[1]) : cc.color.BLACK;
            }
        }

        if (shadow != null) {
            var arrShadow = shadow.split(";");
            if (arrShadow.length > 0) {
                enableShadow = true;
                shadowOffsetX = arrShadow[0] != null ? arrShadow[0] : 0;
                shadowOffsetY = arrShadow[1] != null ? arrShadow[1] : -2;
                shadowColor = arrShadow[2] != null ? cc.color(arrShadow[2]) : cc.color.BLACK;
                shadowSize = arrShadow[3] != null ? arrShadow[3] : 1;
                shadowOffset = cc.size(shadowOffsetX, shadowOffsetY);
            }
        }
        if (enableStroke || enableShadow) {
            var strokeObj = enableStroke ? {strokeColor: strokeColor, strokeSize: strokeSize} : false;
            var shadowObj = enableShadow ? {
                shadowColor: shadowColor,
                shadowOffset: shadowOffset,
                shadowSize: shadowSize
            } : false;
            var breakLine = "\n";
            if (text.indexOf(breakLine) >= 0) {
                var splitArr = [];
                var tmpStr = text;
                //TODO LOOP WHILE
                while (true) {
                    if (tmpStr == "") {
                        break;
                    }
                    var index1 = tmpStr.indexOf(breakLine);//start search from 0 to end
                    if (index1 == 0) {
                        splitArr.push(breakLine);//start with breakLine
                        //todo find other
                        index1 = tmpStr.indexOf(breakLine, 1);//start search from 1 to end
                    }
                    if (index1 < 0) {
                        splitArr.push(tmpStr);
                        break;//todo not exist breakLine then break loop
                    }

                    var contentText = tmpStr.substr(0, index1);
                    if (contentText != "") {
                        splitArr.push(contentText);
                        splitArr.push(breakLine);
                    }
                    tmpStr = tmpStr.substr(index1 + 1);
                }
                //cc.log(this.getClassName(), "appendTextWithFontDefinition splitArr", splitArr.join(","));
                for (var i = 0; i < splitArr.length; ++i) {
                    if (splitArr[i] == breakLine) {
                        this.appendText(breakLine, fontName, fontSize, fontColor, opacity);
                    } else {
                        this.appendTextStrokeShadow(splitArr[i], fontName, fontSize, fontColor, opacity, strokeObj, shadowObj);
                    }
                }
            } else {
                this.appendTextStrokeShadow(text, fontName, fontSize, fontColor, opacity, strokeObj, shadowObj);
            }
        } else {
            this.appendText(text, fontName, fontSize, fontColor, opacity);
        }
    },

    appendTextStrokeShadow: function (text, fontName, fontSize, fontColor, opacity, stroke, shadow) {
        this.appendNode(this.createLabel(text, fontName, fontSize, fontColor, opacity, stroke, shadow));
    },

    appendNode: function (node, color, opacity) {
        if (!node) return;
        //tag, color, opacity, customNode
        var el = new ccui.RichElementCustomNode(
            this.getAutoId(),
            (color !== undefined) ? cc.color(color) : this._color,
            (opacity !== undefined) ? opacity : 255,
            node
        );
        this.pushBackElement(el);
    },

    appendImage: function (filePath, color, opacity) {
        if (!filePath) return;
        if (filePath.indexOf("#") == 0) {
            return this.appendNode(new cc.Sprite(filePath), color, opacity);
        } else if (cc.spriteFrameCache.getSpriteFrame(filePath)) {
            return this.appendNode(new cc.Sprite("#" + filePath), color, opacity);
        }

        //tag, color, opacity, filePath
        var el = new ccui.RichElementImage(
            this.getAutoId(),
            (color !== undefined) ? cc.color(color) : this._color,
            (opacity !== undefined) ? opacity : 255,
            filePath
        );
        this.pushBackElement(el);
    },
    appendImageWithScale: function (filePath, color, opacity, scale) {
        if (!filePath) {
            cc.error(this.getClassName(), "appendImageWithScale with filePath undefined", filePath);
            return false;
        }
        if (filePath.indexOf("#") == 0) {
            filePath = filePath.substr(1);
        }
        var batchNode;
        var tempSprite;
        var sprite;
        var originalSize;
        var originalRect;
        if (cc.spriteFrameCache.getSpriteFrame(filePath)) {
            tempSprite = new cc.Sprite("#" + filePath);
            originalSize = tempSprite.getContentSize();
            //originalRect = cc.rect(5, originalSize.height / 2 - 9, originalSize.width, originalSize.height);
            //batchNode = new cc.SpriteBatchNode(tempSprite.getTexture());
            sprite = new cc.Scale9Sprite(filePath);
            //sprite.updateWithBatchNode(batchNode, originalRect, false, cc.rect(0, 0, originalSize.width, originalSize.height));
        } else {
            tempSprite = new cc.Sprite(filePath);
            originalSize = tempSprite.getContentSize();
            originalRect = cc.rect(0, 0, originalSize.width, originalSize.height);
            batchNode = new cc.SpriteBatchNode(tempSprite.getTexture());
            sprite = new cc.Scale9Sprite();
            sprite.updateWithBatchNode(batchNode, originalRect, false, cc.rect(0, 0, originalSize.width, originalSize.height));
        }
        //update new size
        sprite.setContentSize(cc.size(originalSize.width * scale, originalSize.height * scale));
        this.appendNode(sprite, color, opacity);
    },

    clearText: function () {
        for (var i = 0; i < this._curId; ++i) {
            this.removeElement(0);
        }
        this._curId = 0;
    },

    getAutoId: function () {
        return ++this._curId;
    },
    /**
     * add symbol ">" or "<" by "@_greater@" and "@_lower@"
     * tag format: <tagName = value>content</tagName>
     * tagName: font, size, color, opacity, image
     * with image, format is <image = filePath></image> or <image = filePath>scaleValue</image> with scaleValue is float 0 -> 1
     * with shadow, format is <shadow = x;y;shadowColorValue;sizeNumber>content</shadow>
     * with stroke, format is <stroke = size;colorValue>content</stroke>
     * */
    setString: function (text) {
        this.clearText();

        var splitArr = [];

        var tmpStr = text;
        //TODO LOOP WHILE
        while (true) {
            var index1 = tmpStr.indexOf("<");//start search from 0 to end
            if (index1 == 0) {
                //todo find second < with format: "<tagName ....>...<"
                index1 = tmpStr.indexOf("<", 1);//start search from 1 to end
            }
            if (index1 < 0) {
                splitArr.push(tmpStr);
                break;//todo not exist < then break loop
            }

            splitArr.push(tmpStr.substr(0, index1));
            tmpStr = tmpStr.substr(index1);
        }

        var tmp1 = [];
        //TODO LOOP FOR
        for (var i = 0; i < splitArr.length; ++i) {
            var tmpIdx = splitArr[i].indexOf(">");
            if (tmpIdx < 0) {
                tmp1.push(splitArr[i]);
                continue;
            }
            tmp1.push(splitArr[i].substr(0, tmpIdx + 1));
            if (tmpIdx + 1 < splitArr[i].length) {
                tmp1.push(splitArr[i].substr(tmpIdx + 1));
            }
        }

        var isInitElement = false;
        var obj;
        var numTag = 0;
        var textForAppend;
        var textForCalculate = "";
        var maxFontSize = this.getFontSize();
        var isImgTag = false;
        //todo LOOP FOR
        for (var i = 0; i < tmp1.length; ++i) {
            if (!isInitElement) {
                numTag = 0;
                obj = {};
                isInitElement = true;
            }
            //check content is text
            if (tmp1[i].indexOf("</") < 0 && tmp1[i].indexOf("<") < 0) {
                if (isImgTag) {
                    obj['scale'] = tmp1[i];
                } else {
                    obj["text"] = tmp1[i];
                }
                //check draw without tag
                if (numTag == 0) {
                    // begin or end of text -> use default format
                    if (obj["text"] !== null && obj["text"] !== undefined) {
                        textForAppend = obj["text"].replace(/@_greater@/g, ">").replace(/@_lower@/g, "<");
                        textForCalculate += textForAppend;
                        this.appendText(textForAppend);
                    }
                    isInitElement = false;//require create new element
                }
                continue;//TODO skip bellow
            }
            //check start format
            if (tmp1[i].indexOf("</") < 0 && tmp1[i].indexOf("<") >= 0) {
                // have override format
                numTag++;
                var oneTag = tmp1[i];
                //todo format is <tagName = value>
                var fSpaceIdx = oneTag.indexOf(" ");
                var equalIdx = oneTag.indexOf("=");
                var sSpaceIdx = oneTag.lastIndexOf(" ");
                var endTagIdx = oneTag.indexOf(">");
                var isExistFirstSpace = (fSpaceIdx >= 0) && (fSpaceIdx == (equalIdx - 1));
                var isExistLastSpace = (sSpaceIdx >= 0) && (sSpaceIdx == (equalIdx + 1));
                var tagName, tagValue;
                if (!isExistFirstSpace || !isExistLastSpace) {
                    if (isExistFirstSpace) {
                        //todo format is <tagName =value>
                        tagName = oneTag.substr(1, fSpaceIdx - 1);
                        tagValue = oneTag.substr(equalIdx + 1, endTagIdx - equalIdx - 1);
                    } else if (isExistLastSpace) {
                        //todo format is <tagName= value>
                        tagName = oneTag.substr(1, equalIdx - 1);
                        tagValue = oneTag.substr(sSpaceIdx + 1, endTagIdx - sSpaceIdx - 1);
                    } else {
                        //todo format is <tagName=value>
                        tagName = oneTag.substr(1, equalIdx - 1);
                        tagValue = oneTag.substr(equalIdx + 1, endTagIdx - equalIdx - 1);
                    }
                } else {
                    //todo format is <tagName = value>
                    tagName = oneTag.substr(1, fSpaceIdx - 1);
                    tagValue = oneTag.substr(sSpaceIdx + 1, endTagIdx - sSpaceIdx - 1);
                }
                obj[tagName] = tagValue;
                isImgTag = tagName == "image";
                //check tag image and draw immediately
                if (isImgTag) {
                    if (obj["text"] !== null && obj["text"] !== undefined) {
                        textForAppend = obj["text"].replace(/@_greater@/g, ">").replace(/@_lower@/g, "<");
                        textForCalculate += textForAppend;
                        maxFontSize = Math.max(maxFontSize, obj["size"] != null ? obj["size"] : 0);
                        if (obj["stroke"] != null || obj["shadow"] != null) {
                            this.appendTextWithFontDefinition(textForAppend, obj["font"], obj["size"], obj["color"], obj["opacity"], obj["stroke"], obj["shadow"]);
                        } else {
                            this.appendText(textForAppend, obj["font"], obj["size"], obj["color"], obj["opacity"]);
                        }
                        obj["text"] = null;
                    }
                }
                if (tagValue.indexOf(" ") >= 0) {
                    cc.error("CustomRichText error setString with tag <" + tagName + "> has contained space symbol value = <" + tagValue + ">");
                }
                continue;//TODO skip bellow
            }
            //check end of format
            if (tmp1[i].indexOf("</") >= 0) {
                // end of format
                //todo </tagName>
                numTag--;
                if (obj["image"] != null) {
                    //draw text before
                    if (obj["scale"] !== null && obj["scale"] !== undefined) {
                        //filePath, color, opacity, scale
                        this.appendImageWithScale(obj["image"], obj["color"], obj["opacity"], obj["scale"]);
                        obj["scale"] = null;
                    } else {
                        //filePath, color, opacity
                        this.appendImage(obj["image"], obj["color"], obj["opacity"]);
                    }
                    textForCalculate += " image ";
                    obj["image"] = null;
                    isImgTag = false;
                    continue;//TODO skip bellow
                }
                //check last tag
                if (numTag <= 0) {
                    if (obj["text"] !== null && obj["text"] !== undefined) {
                        textForAppend = obj["text"].replace(/@_greater@/g, ">").replace(/@_lower@/g, "<");
                        textForCalculate += textForAppend;
                        maxFontSize = Math.max(maxFontSize, obj["size"] != null ? obj["size"] : 0);
                        if (obj["stroke"] != null || obj["shadow"] != null) {
                            this.appendTextWithFontDefinition(textForAppend, obj["font"], obj["size"], obj["color"], obj["opacity"], obj["stroke"], obj["shadow"]);
                        } else {
                            this.appendText(textForAppend, obj["font"], obj["size"], obj["color"], obj["opacity"]);
                        }
                        obj["text"] = null;
                    }
                    isInitElement = false;//require create new element
                }
            }
        }//======== END LOOP
        //todo calculate height
        if (this._contentSizeRichText.height <= 0) {
            var height = CustomRichTextExtend.getHeightDynamicFromText(this._contentSizeRichText.width, textForCalculate, this.getFontName(), maxFontSize);
            this.setContentSize(cc.size(this._contentSizeRichText.width, height));
        }
    }
});
CustomRichTextExtend.getDynamicContentSizeText = function (width, height, text, fontName, fontSize) {
    if (fontName === undefined) {
        fontName = res.FONT_GAME_BOLD;
    }
    if (fontSize === undefined) {
        fontSize = 20;
    }

    if (!this.preDynamicText) {
        this.preDynamicText = new ccui.Text("", fontName, fontSize);
        this.preDynamicText.retain();
        this.preDynamicText.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.preDynamicText.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
    }
    this.preDynamicText.setTextAreaSize(cc.size(width, height));
    this.preDynamicText.setString(text);
    return this.preDynamicText.getContentSize();
};
CustomRichTextExtend.getHeightDynamicFromText = function (width, text, fontName, fontSize) {
    return CustomRichTextExtend.getDynamicContentSizeText(width, 0, text, fontName, fontSize).height;
};
CustomRichTextExtend.create = function (text, size, defFont, defSize, defColor, defAlignHorizontal, defAlignVertical) {
    defAlignHorizontal = defAlignHorizontal !== undefined ? defAlignHorizontal : RichTextAlignment.CENTER;
    defAlignVertical = defAlignVertical !== undefined ? defAlignVertical : RichTextAlignment.MIDDLE;
    text = text !== undefined ? text : "";
    defSize = defSize !== undefined ? defSize : 20;
    defColor = defColor !== undefined ? defColor : cc.color.WHITE;
    defFont = defFont !== undefined ? defFont : res.FONT_GAME_BOLD;
    size = size !== undefined ? size : cc.size(cc.winSize.width, 0);

    if (cc.sys.isNative) {
        var label = new CustomRichTextExtend(size);
        label.setDefaultFont(defFont);
        label.setDefaultColor(defColor);
        label.setDefaultSize(defSize);
        label.setDefaultAlignHorizontal(defAlignHorizontal);
        label.setDefaultAlignVertical(defAlignVertical);
        label.setString(text);
    }
    else {
        label = new ccui.Text(text, defFont, defSize);
        label.setTextAreaSize(size);

        switch (defAlignHorizontal) {
            case RichTextAlignment.CENTER:
                label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                break;
            case RichTextAlignment.LEFT:
                label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
                break;
            case RichTextAlignment.RIGHT:
                label.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_RIGHT);
                break;
        }

        switch (defAlignVertical) {
            case RichTextAlignment.MIDDLE:
                label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
                break;
            case RichTextAlignment.TOP:
                label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
                break;
            case RichTextAlignment.BOTTOM:
                label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM);
                break;
        }
    }

    return label;
};