'use strict';

var Utility = (function () {
    var instance;

    /**
     * @private
     * */
    function init() {
        function getName() {
            return "Utility";
        }

        instance = {};
        // Invoke a method (with arguments) on every item in a collection.
        instance.executeFunction = function (cbFunc) {
            if (!cbFunc) {
                return false;
            }
            var isFunc = _.isFunction(cbFunc);
            if (isFunc) {
                return cbFunc.apply(null, []);
            }

            var isHasFucName = cbFunc.hasOwnProperty('funcName');
            var isHasCaller = cbFunc.hasOwnProperty('caller');
            var isHasArgs = cbFunc.hasOwnProperty('args');
            if (isHasCaller && isHasFucName && isHasArgs) {
                return cbFunc['funcName'].apply(cbFunc['caller'], cbFunc['args']);
            }
            return false;
        };

        instance.getColorByName = function (name) {
            if (!cc.isString(name)) return cc.color.WHITE;
            name = name.toLowerCase();
            var color;
            switch (name) {
                case 'violet':
                    color = cc.color(238, 130, 238);
                    break;
                case 'brown':
                    color = cc.color(139, 69, 19);
                    break;
                case 'salmon': // red
                    color = cc.color(250, 128, 114);
                    break;
                case 'olive': // green
                    color = cc.color(128, 128, 0);
                    break;
                case 'teal': // blue
                    color = cc.color(0, 128, 128);
                    break;
                case 'cyan': // blue
                    color = cc.color(152, 255, 255);
                    break;
                case 'gray': // gray
                case 'grey': // gray
                    color = cc.color(128, 128, 128);
                    break;
                case 'bisque': // light
                    color = cc.color(255, 228, 196);
                    break;
                case 'light_pink': // light pink
                    color = cc.color(235, 190, 247);
                    break;
                case 'dirt_milk':
                    color = cc.color(249, 243, 131);
                    break;
                case 'content_completed':
                    color = cc.color(183, 85, 0);
                    break;
                case 'content_processing':
                    color = cc.color(129, 67, 0);
                    break;
                case 'text_green':
                    color = cc.color(97, 222, 3);
                    break;
                case 'lock':
                    color = cc.color(190, 197, 253);
                    break;
                case 'unlock':
                    color = cc.color(246, 237, 169);
                    break;
                case 'count_down_slot':
                    color = cc.color(250, 201, 71);
                    break;
                case 'tooltip':
                    color = cc.color(248, 237, 184);
                    break;
                case 'tooltip_title':
                    color = cc.color(234, 120, 122);
                    break;
                case 'stroke':
                    color = cc.color(39, 17, 10);
                    break;
                default :
                    color = cc.color.WHITE;
                    break;
            }
            return color;
        };

        instance.getSpriteFileName = function (fileName) {
            if (fileName == null) {
                return "";
            }
            if (cc.spriteFrameCache.getSpriteFrame(fileName)) {
                return "#" + fileName;
            } else {
                return fileName;
            }
        };

        instance.createSpriteFromFileName = function (fileName) {
            if ((typeof fileName == "undefined") || (fileName == "")) {
                return new cc.Sprite();
            } else {
                return new cc.Sprite(instance.getSpriteFileName(fileName));
            }
        };

        instance.updateSpriteWithFileName = function (spr, fileName) {
            if (spr == null) {
                LogUtils.getInstance().error([getName(), "updateSpriteWithFileName with sprite null fileName", fileName]);
                return false;
            }
            if (fileName == null) {
                LogUtils.getInstance().error([getName(), "updateSpriteWithFileName with fileName null", fileName]);
                return false;
            }

            if (cc.spriteFrameCache.getSpriteFrame(fileName)) {
                //todo cached
                if (spr.loadTexture) {
                    spr.loadTexture(fileName, ccui.Widget.PLIST_TEXTURE);
                } else {
                    spr.setSpriteFrame(fileName);
                }
            } else {
                //todo from local
                if (spr.setSpriteFrame) {
                    spr.setTexture(fileName);
                } else {
                    if (spr.loadTexture) {
                        spr.loadTexture(fileName);
                    } else {
                        LogUtils.getInstance().error([getName(), "updateSpriteWithFileName fileName", fileName]);
                        return false;
                    }
                }
            }
        };

        instance.calculateTimeMove = function (startPoint, endPoint, ratio) {
            startPoint = startPoint || cc.p(0, 0);
            endPoint = endPoint || cc.p(1, 1);
            ratio = ratio || 1;
            var s = Math.sqrt(Math.pow(endPoint.x - startPoint.x, 2) + Math.pow(endPoint.y - startPoint.y, 2));
            //var v = 40;
            var g = 9.8;
            var deltaX = Math.abs(endPoint.x - startPoint.x);
            var deltaY = Math.abs(endPoint.y - startPoint.y);
            var h = Math.max(deltaX, deltaY);
            h = h < 1 ? 1 : h;
            var v = Math.sqrt(2 * g * h);
            return (s / v) * ratio;
        };

        /**
         * @param args
         * args is can be an object or string text
         * if args is an object then
         * attributes of args is contain:
         * {
         * parent,
         * text,
         * position,
         * fontName,
         * fontSize,
         * color,
         * moveOffset,
         * isSkipRetain,
         * actionTime
         * }
         * */
        instance.showTextOnScene = function (args) {
            var parent = args["parent"];
            var text = args["text"];
            var position = args["position"];
            var fontName = args["fontName"];
            var fontSize = args["fontSize"];
            var color = args["color"];
            var moveOffset = args["moveOffset"];
            var isSkipRetain = args["isSkipRetain"];
            var actionTime = args["actionTime"];
            var localZOder = args["localZOder"] || 0;

            if (!parent) {
                parent = gv.engine.getLayerMgr().getLayerById(LAYER_ID.EFFECT);
            }

            if (text === undefined) {
                text = args === undefined ? "" : args;
            }
            if (position === undefined) {
                position = cc.p(gv.WIN_SIZE.width >> 1, gv.WIN_SIZE.height >> 1);
            }

            if (fontName === undefined) {
                fontName = resFont.FONT_GAME_BOLD;
            }
            if (fontSize === undefined) {
                fontSize = 48;
            }
            if (color === undefined) {
                color = cc.WHITE;
            }
            moveOffset = moveOffset || {x: 0, y: 50};
            if (!actionTime) {
                actionTime = instance.calculateTimeMove(cc.p(0, 0), moveOffset);
            }
            isSkipRetain = isSkipRetain !== undefined ? isSkipRetain : false;
            if (!this._lbText || isSkipRetain) {
                if (this._lbText && this._lbText._isActiveRetain) {
                    try {
                        this._lbText.release();
                    } catch (e) {
                        throw LogUtils.getInstance().error([getName(), "showTextOnScene error release label text", e]);
                    }
                    this._lbText = null;
                }
                var textArgs = {};
                textArgs["text"] = text;
                textArgs["fontName"] = fontName;
                textArgs["fontSize"] = fontSize;
                textArgs["shadowColor"] = instance.getColorByName("gray");
                textArgs["strokeColor"] = instance.getColorByName("stroke");
                textArgs["horizontalAlignment"] = cc.TEXT_ALIGNMENT_CENTER;
                textArgs["verticalAlignment"] = cc.VERTICAL_TEXT_ALIGNMENT_CENTER;
                this._lbText = instance.getLabel(textArgs);
                if (!isSkipRetain) {
                    try {
                        this._lbText.retain();
                        this._lbText._isActiveRetain = true;
                    } catch (e) {
                        throw LogUtils.getInstance().error([getName(), "showTextOnScene error retain label text", e]);
                    }
                }
            } else {
                this._lbText.stopAllActions();
                if (this._lbText._isActiveRetain) {
                    this._lbText.removeFromParent(false);
                }
                this._lbText.setString(text);
            }
            //update view state
            this._lbText.setColor(color);
            this._lbText.setFontName(fontName);
            this._lbText.setFontSize(fontSize);
            //parent add child
            LogUtils.getInstance().log([getName(), "showTextOnScene text: ", text]);
            parent.addChild(this._lbText, localZOder);

            moveOffset.x = moveOffset.x !== undefined ? moveOffset.x : moveOffset.width;
            moveOffset.y = moveOffset.y !== undefined ? moveOffset.y : moveOffset.height;
            this._lbText.setCascadeOpacityEnabled(true);
            this._lbText.setOpacity(0);
            this._lbText.setPosition(position);
            this._lbText.runAction(cc.spawn(
                cc.sequence(
                    cc.moveBy(actionTime * 0.5, moveOffset.x, moveOffset.y * 0.5),
                    cc.spawn(
                        cc.fadeOut(actionTime * 0.5),
                        cc.moveBy(actionTime * 0.5, moveOffset.x, moveOffset.y * 0.5)
                    ),
                    cc.callFunc(function (sender) {
                        sender.removeFromParent(isSkipRetain);
                    })
                ),
                cc.fadeIn(0.1 * actionTime)
            ));
        };
        /**
         * @param args
         * eg: args contain attributes
         * fontName
         * fontSize
         * color
         * isHasStroke
         * text
         * shadowColor
         * strokeColor
         * strokeSize
         * horizontalAlignment
         * verticalAlignment
         * fixedSize
         * */
        instance.getLabel = function (args) {
            if (!args) {
                args = {};
            }
            var fontName = args["fontName"];
            var fontSize = args["fontSize"];
            var color = args["color"];
            var isHasShadow = args["isHasShadow"];
            var isHasStroke = args["isHasStroke"];
            var text = args["text"];
            var shadowColor = args["shadowColor"];
            var shadowSize = args["shadowSize"];
            var shadowOffset = args["shadowOffset"];
            var strokeColor = args["strokeColor"];
            var strokeSize = args["strokeSize"];
            var horizontalAlignment = args["horizontalAlignment"];
            var verticalAlignment = args["verticalAlignment"];
            var fixedSize = args["fixedSize"];
            if (!text && !fontName) {
                //todo args is string text
                text = args;
            }
            if (!fontName) {
                fontName = resFont.FONT_GAME_BOLD;
            }
            if (!fontSize) {
                fontSize = 20;
            }
            if (!color) {
                color = cc.WHITE;
            }
            if (!shadowColor) {
                shadowColor = instance.getColorByName("gray");
            }
            if (!strokeColor) {
                strokeColor = instance.getColorByName("stroke");
            }
            if (!shadowOffset) {
                shadowOffset = {width: 0, height: -1};
            }
            isHasShadow = isHasShadow === undefined ? true : isHasShadow;
            isHasStroke = isHasStroke === undefined ? true : isHasStroke;
            text = text === undefined ? "_" : text;
            shadowSize = shadowSize === undefined ? 1 : shadowSize;
            strokeSize = strokeSize === undefined ? 1 : strokeSize;
            var label = new ccui.Text(text + '', fontName, fontSize);
            label.color = color;
            label.setTextHorizontalAlignment(horizontalAlignment !== undefined ? horizontalAlignment : cc.TEXT_ALIGNMENT_LEFT);
            label.setTextVerticalAlignment(verticalAlignment !== undefined ? verticalAlignment : cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            if (isHasShadow) {
                label.enableShadow(shadowColor, shadowOffset, shadowSize);
            }
            if (isHasStroke) {
                label.enableOutline(strokeColor, strokeSize);
            }
            if (!!fixedSize) {
                if (fixedSize.width !== undefined && fixedSize.height !== undefined) {
                    label.setTextAreaSize(fixedSize);
                } else {
                    if (!_.isNaN(fixedSize)) {
                        label.setTextAreaSize(cc.size(fixedSize, 0));
                    }
                }
            }
            return label;
        };
        instance.getDynamicContentSizeText = function (width, height, text, fontName, fontSize) {
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
        instance.getHeightDynamicFromText = function (width, text, fontName, fontSize) {
            return instance.getDynamicContentSizeText(width, 0, text, fontName, fontSize).height;
        };
        instance.isCollisionOverLapObjectNode = function (node1, node2) {
            var offset = cc.p(-5, -5);
            var size1 = node1.getContentSize();
            var size2 = node2.getContentSize();
            var anchor = cc.p(0.5, 0.5);
            var position1 = node1.getParent().convertToWorldSpace(node1.getPosition());
            var position2 = node2.getParent().convertToWorldSpace(node2.getPosition());
            //check exist overlap horizontal
            var isOverlapHorizontal = ((offset.x + position1.x + size1.width * anchor.x) >= (position2.x - size2.width * anchor.x)) && ((offset.x + position2.x + size2.width * anchor.x) >= (position1.x - size1.width * anchor.x));
            if (!isOverlapHorizontal) {
                return false;
            }
            //check exist overlap vertical
            var isOverlapVertical = ((offset.y + position1.y + size1.height * anchor.y) >= (position2.y - size2.height * anchor.y)) && ((offset.y + position2.y + size2.height * anchor.y) >= (position1.y - size1.height * anchor.y));
            if (!isOverlapVertical) {
                return false;
            }
            return true;
        };
        instance.isCollisionOverLapRect = function (rect1, rect2) {
            var offset = cc.p(-5, -5);
            //check exist overlap horizontal
            var isOverlapHorizontal = ((offset.x + rect1.x + rect1.width) >= rect2.x) && ((offset.x + rect2.x + rect2.width) >= rect1.x);
            if (!isOverlapHorizontal) {
                return false;
            }
            //check exist overlap vertical
            var isOverlapVertical = ((offset.y + rect1.y + rect1.height) >= rect2.y) && ((offset.y + rect2.y + rect2.height) >= rect1.y);
            if (!isOverlapVertical) {
                return false;
            }
            return true;
        };

        instance.createLoadingBar = function (fileName) {
            var loadingBar = new ccui.LoadingBar();
            loadingBar.setName("LoadingBar");
            instance.updateSpriteWithFileName(loadingBar, fileName);
            loadingBar.setDirection(ccui.LoadingBar.TYPE_RIGHT);
            loadingBar.setPercent(0);
            return loadingBar;
        };
        /**
         * Animation
         * */
        instance.ResourceLoaded = {};
        instance.createAnimationDragonBones = function (key, folderPath) {
            instance.loadAnimationResource(key, folderPath);
            return db.DBCCFactory.getInstance().buildArmatureNode(key);
        };
        instance.loadAnimationResource = function (key, folderPath) {
            folderPath = folderPath !== undefined ? folderPath : "res/plist/" + key;
            if (instance.ResourceLoaded[key] === undefined) {
                LogUtils.getInstance().log("Load Effect: " + key);
                instance.ResourceLoaded[key] = true;
                db.DBCCFactory.getInstance().loadTextureAtlas(folderPath + "/texture.plist", key);
                db.DBCCFactory.getInstance().loadDragonBonesData(folderPath + "/skeleton.xml", key);
            }
        };
        instance.unloadAllAnimationData = function (object) {
            if (object.listAnimationLoaded == undefined) {
                return false;
            }

            for (var keyStored in object.listAnimationLoaded) {
                db.DBCCFactory.getInstance().removeTextureAtlas(keyStored + "", false);
            }
            object.listAnimationLoaded = {};
        };
        instance.callFunctionWithDelay = function (time, cbFunc) {
            gv.engine.getSceneMgr().getCurrentScene().runAction(cc.sequence(
                cc.delayTime(time),
                cc.callFunc(function () {
                    instance.executeFunction(cbFunc);
                })
            ));
        };
        instance.randomBetween = function(min, max){
            return (Math.random() * (max - min)) + min;
        };
        instance.randomBetweenRound = function(min, max){
            return Math.round(instance.randomBetween(min, max));
        };
        instance.numberToShortcutString = function (num, numtoFixed) {
            num = num != 0 ? num : 0;
            numtoFixed = numtoFixed >= 0 ? numtoFixed : 3;
            var obj;
            var curValue = 1;
            var phanThapPhanStartIdx = 0;
            if (!num) {
                return num + "";
            }
            //xet dau
            var strDau = num >= 0 ? "" : "-";
            num = Math.abs(num);
            var strNum = num + "";
            var lookupPow = [
                {key: "B", value: 9},
                {key: "M", value: 6},
                {key: "K", value: 3}
            ];//10^pow
            var str = "0";
            var stack = [];
            for (var i = 0, len = lookupPow.length; i < len; ++i) {
                obj = lookupPow[i];
                curValue = Math.pow(10, obj.value);
                while (num >= curValue) {
                    num = Math.floor(num / curValue);
                    stack.push(obj.key);
                    phanThapPhanStartIdx = num > 0 ? (num + "").length : 0;
                }
            }
            //handle stack
            if (stack.length > 0) {
                var strKey = "";
                while (stack.length > 0) {
                    strKey += stack.pop();
                }
                //handle phanThapPhan
                var strThapPhan = "";
                if (numtoFixed > 0) {
                    //convert phanThapPhan to string
                    var buff = strNum.substring(phanThapPhanStartIdx, phanThapPhanStartIdx + numtoFixed);
                    while (buff.length > 0 && buff[buff.length - 1] == '0') {
                        buff = buff.slice(0, buff.length - 1);
                    }
                    if (buff.length > 0) {
                        strThapPhan = "." + buff;
                    }
                }
                //todo result
                str = strDau + num + strThapPhan + strKey;
            } else {
                //todo result
                str = strDau + num + "";
            }
            return str;
        };
        instance.numberToStringGlobal = function (number) {
            if (!number) {
                number = "0";
            }
            var str = number.toString();
            var dotIndex = str.indexOf(".");
            if (dotIndex == -1) dotIndex = str.length;
            var integerPart = str.substring(0, dotIndex);
            var decimalPart = (dotIndex + 1 < str.length) ? str.substring(dotIndex + 1, str.length) : "";
            var count = 0;
            for (var i = integerPart.length - 1; i >= 1; i--) {
                if (integerPart[i] == ',') continue;
                count++;
                if ((count == 3) && (parseInt(integerPart[i - 1]).toString() !== "NaN")) {
                    integerPart = str.slice(0, i) + "," + integerPart.slice(i);
                    count = 0;
                }
            }
            if (decimalPart == "")
                return integerPart;
            else
                return (integerPart + "." + decimalPart);
        };

        /**
         * @return
         * @public
         */
        return instance;
    }

    /**
     * @public
     * */
    return {
        getInstance: function () {
            if (!instance) {
                instance = init();
            }
            return instance;
        }
    }
})();
