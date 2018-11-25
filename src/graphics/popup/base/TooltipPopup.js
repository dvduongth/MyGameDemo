'use strict';
/**
 * TooltipMgr
 */

var TooltipPopup = (function () {
    var instance;
    var background_url = resImg.RESOURCES__TEXTURES__UI__BGTOOLTIP_PNG;
    /**
     * @private
     * */
    function init() {
        var _tooltipPool = {};
        var _padding = 0;
        var _margin_top = 10;
        var _margin_bottom = 15;
        var _margin_left = 15;
        var _margin_right = 15;
        var _minSize = cc.size(62, 78);//62,78
        var _maxSize = cc.size(1136, 640);
        var _tooltipIndex = 0;
        var _content = null;
        //create container
        var _nodeContainer = new cc.Node();
        _nodeContainer.visible = false;
        _nodeContainer.setCascadeOpacityEnabled(true);
        _nodeContainer.retain();
        //create background
        var _imgBg = new cc.Scale9Sprite(background_url, cc.rect(0, 0, _minSize.width, _minSize.height), cc.rect(29, 38, 3, 3));
        _imgBg.setCascadeOpacityEnabled(true);
        _imgBg.retain();
        //add background
        _nodeContainer.addChild(_imgBg);
        /**
         * @private function
         * */
        /**
         * update parent of node container before showing
         * @private
         */
        function _updateParent() {
            var layer = gv.layerMgr.getLayerByIndex(LayerId.LAYER_LOADING);
            if (layer) {
                if (_nodeContainer.parent != layer) {
                    _nodeContainer.removeFromParent(false);
                    layer.addChild(_nodeContainer, 9999);
                }
            }
        }

        /**
         * update bg tooltip size after attach content
         * @private
         */
        function _updateSize() {
            if(_content && _content.getContentSize !== undefined) {
                var contentSize = _content.getContentSize();
                if(contentSize) {
                    _imgBg.width = Math.max(contentSize.width + _margin_left + _margin_right, _minSize.width);
                    _imgBg.height = Math.max(contentSize.height + _margin_top + _margin_bottom, _minSize.height);
                    contentSize = null;
                }
            }
        }

        /**
         * set content to center of bg tooltip
         * @private
         */
        function _updateComponentsPosition() {
            _content.attr({
                anchorX: 0.5,//0
                anchorY: 0.5,//1
                x: _imgBg.width >> 1,//_margin_left,
                y: _imgBg.height >> 1//_imgBg.height - _margin_top
            });
            //_content.setPosition(_imgBg.width / 2, _imgBg.height / 2);
        }

        /**
         * calculate position that tooltip will show, around content
         * @param worldPos
         * @param target
         * @private
         */
        function _calculatePositionShowing(worldPos, target) {
            //offset check out of screen for auto move
            var bgSize;
            var margin_vertical = -20;
            var margin_horizontal = -20;
            var targetScaleX = target.getScaleX() || 1;
            var targetScaleY = target.getScaleY() || 1;
            var targetSize = target.getContentSize();
            targetSize.width *= targetScaleX;
            targetSize.height *= targetScaleY;

            targetSize.width += margin_horizontal;
            targetSize.height += margin_vertical;

            var offset_top = 20;
            var offset_down = 20;
            var offset_left = 20;
            var offset_right = 20;
            var imgBg = _content["skipBackground"] ? _content : _imgBg;
            bgSize = imgBg.getContentSize();
            var imgAnchorPoint = cc.p(0.5, 0.5);
            var imgPos = cc.p(worldPos.x, worldPos.y);
            //cc.log("before _calculatePositionShowing imgPos", JSON.stringify(imgPos));
            //cc.log("before _calculatePositionShowing imgAnchorPoint", JSON.stringify(imgAnchorPoint));
            //todo condition variables
            var checkOverVertical = function (anchorPoint, isTop) {
                if(isTop) {
                    return (worldPos.y + (targetSize.height >> 1) + bgSize.height * (1 - anchorPoint.y)) > (gv.WIN_SIZE.height + offset_top);
                }else{
                    return (worldPos.y - (targetSize.height >> 1) - bgSize.height * anchorPoint.y) < offset_down;
                }
            };
            var checkOverHorizontal = function (anchorPoint, isRight) {
                if(isRight) {
                    return (worldPos.x + (targetSize.width >> 1) + bgSize.width * (1 - anchorPoint.x)) > (gv.WIN_SIZE.width + offset_right);
                }else{
                    return (worldPos.x - (targetSize.width >> 1) - bgSize.width * anchorPoint.x) < offset_left;
                }
            };
            //todo auto move to top
            //cc.log("daniel auto move top",targetSize.width, targetSize.height);
            imgAnchorPoint.x = 0.5;
            imgAnchorPoint.y = 0;
            imgPos.x = worldPos.x;
            imgPos.y = worldPos.y + (targetSize.height >> 1);
            //todo init check
            var isTopOver = checkOverVertical(imgAnchorPoint,true);
            var isDownOver;
            //check top
            if(isTopOver) {
                //move to down
                //cc.log("daniel move down isTopOver",targetSize.height >> 1);
                imgAnchorPoint.y = 1;
                imgPos.y = worldPos.y - (targetSize.height >> 1);
            }
            //todo init check
            isDownOver = checkOverVertical(imgAnchorPoint);
            //check bottom
            if(isDownOver) {
                //move to top
                //cc.log("daniel move top isDownOver",targetSize.height >> 1);
                imgAnchorPoint.y = 0;
                imgPos.y = worldPos.y + (targetSize.height >> 1);
            }
            if(isTopOver && isDownOver) {
                //todo auto move to left or right
                var isAutoMoveLeft =  worldPos.x >= (gv.WIN_SIZE.width * 0.5);
                imgAnchorPoint.y = 0.5;
                if(isAutoMoveLeft) {
                    //move to left
                    //cc.log("daniel auto move left isTopOver && isDownOver isAutoMoveLeft",targetSize.width >> 1);
                    imgAnchorPoint.x = 1;
                    imgPos.x = worldPos.x - (targetSize.width >> 1);
                    //imgPos.x = worldPos.x - (targetSize.width * 1.5);
                    imgPos.y = worldPos.y;
                }else{
                    //move to right
                    //cc.log("daniel move right isTopOver && isDownOver",targetSize.width >> 1);
                    imgAnchorPoint.x = 0;
                    imgPos.x = worldPos.x + (targetSize.width >> 1);
                    //imgPos.x = worldPos.x + (targetSize.width * 0.7);
                }
            }
            //todo init check
            var isLeftOver = checkOverHorizontal(imgAnchorPoint);
            var isRightOver;
            //check left
            if(isLeftOver) {
                //move to right
                //cc.log("daniel move right isLeftOver",targetSize.width >> 1);
                imgAnchorPoint.x = 0;
                imgPos.x = worldPos.x + (targetSize.width >> 1);
                //imgPos.x = worldPos.x + (targetSize.width * 0.7);
            }
            //todo init check
            isRightOver = checkOverHorizontal(imgAnchorPoint, true);
            //check right
            if(isRightOver) {
                //move to left
                //cc.log("daniel move left isRightOver",targetSize.width >> 1);
                imgAnchorPoint.x = 1;
                imgPos.x = worldPos.x - (targetSize.width >> 1);
                //imgPos.x = worldPos.x - (targetSize.width * 1.5);
            }
            //todo update attributes
            //cc.log("after _calculatePositionShowing imgPos", JSON.stringify(imgPos));
            //cc.log("after _calculatePositionShowing imgAnchorPoint", JSON.stringify(imgAnchorPoint));
            imgBg.setAnchorPoint(imgAnchorPoint);
            imgBg.setPosition(imgPos);
            _checkOutOfScreen();
        }

        function _checkOutOfScreen(){
            var imgBg = _content["skipBackground"] ? _content : _imgBg;
            //todo keep _imgBg in screen
            var scaleX = imgBg.getScaleX();
            var scaleY = imgBg.getScaleY();
            var anchorImg = imgBg.getAnchorPoint();
            var contentSize = imgBg.getContentSize();
            var position = imgBg.getPosition();
            var isTopOver = (position.y + (1 - anchorImg.y) * contentSize.height * scaleY) > gv.WIN_SIZE.height;
            var isDownOver = (position.y - anchorImg.y * contentSize.height * scaleY) < 0;
            var isLeftOver = (position.x - anchorImg.x * contentSize.width * scaleX) < 0;
            var isRightOver = (position.x + (1 - anchorImg.x) * contentSize.width * scaleX) > gv.WIN_SIZE.width;
            //todo vertical
            if(isTopOver) {
                //cc.log("_checkOutOfScreen isTopOver");
                imgBg.y = gv.WIN_SIZE.height - (1 - anchorImg.y) * contentSize.height * scaleY;
            }else if(isDownOver) {
                //cc.log("_checkOutOfScreen isDownOver");
                imgBg.y = anchorImg.y * contentSize.height * scaleY;
            }
            //todo horizontal
            if(isRightOver) {
                //cc.log("_checkOutOfScreen isRightOver");
                imgBg.x = gv.WIN_SIZE.width - (1 - anchorImg.x) * contentSize.width * scaleX;
            }else if(isLeftOver) {
                //cc.log("_checkOutOfScreen isLeftOver");
                imgBg.x = anchorImg.x * contentSize.width * scaleX;
            }
        }

        /**
         * @param {Object} args
         * */
        function _getLabel(args) {
            args = args || {};
            //var size = args["size"] || cc.SizeZero();
            var fontName = args["fontName"] || res.FONT_GAME;
            var fontSize = args["fontSize"] || 20;
            var maxSize = args["maxSize"] || _maxSize;
            var color = args["color"] || Utility.getColorByName("tooltip");
            //var alignHorizontal = args["alignHorizontal"] || RichTextAlignment.CENTER;
            //var alignVertical = args["alignVertical"] || RichTextAlignment.MIDDLE;
            var alignHorizontal = args["alignHorizontal"] || HtmlTextAlign.CENTER;
            var alignVertical = args["alignVertical"] || HtmlTextAlign.CENTER;
            //if(!_tooltipPool["lbHtmlText"]){
            //
            //    //_tooltipPool["lbHtmlText"].retain();
            //}
            //_tooltipPool["lbHtmlText"].setMode(HtmlTextMode.WRAP_WIDTH, maxSize);
            //_tooltipPool["lbHtmlText"].setDefaultFont(fontName, fontSize);
            //_tooltipPool["lbHtmlText"].setHorizontalAlign(alignHorizontal);
            //_tooltipPool["lbHtmlText"].setVerticalAlign(alignVertical);
            //
            //_tooltipPool["lbHtmlText"].removeFromParent(false);

            var label;
            //label = new CustomRichText(size);
            //cc.log("fontName", fontName, "fontSize", fontSize);
            label = new HtmlText(fontName, fontSize, alignHorizontal, alignVertical);
            label.setMode(HtmlTextMode.WRAP_WIDTH, maxSize);
            return label;

            //label.setDefaultFont(fontName);
            //label.setDefaultColor(color);
            //label.setDefaultSize(fontSize);
            //label.setDefaultAlignHorizontal(alignHorizontal);
            //label.setDefaultAlignVertical(alignVertical);
            //label.setAnchorPoint(0.5, 0.5);
            //label["size"] = size;
            //label.getContentSize = label.getRealContentSize;
            //label.width = size.width;
            //label.height = size.height;
            //_tooltipPool["lbHtmlText"] = label;
            //
            //return _tooltipPool["lbHtmlText"];
        }
        function _getLabelByListString(args){
            args = args || {};
            //todo arguments
            var stringArr = args["stringArr"] || args || [""];
            var titleColorHex = args["titleColorHex"] || cc.colorToHex(Utility.getColorByName("tooltip_title"));
            var contentColor = args["contentColor"] || Utility.getColorByName("tooltip");
            var titleFont = args["titleFont"] || res.FONT_GAME_BOLD;
            var contentFont = args["contentFont"] || res.FONT_GAME;
            var fontSize = args["fontSize"] || 20;
            var offsetHeight = args["offsetHeight"] || 20;
            var maxSize = args["maxSize"] || _maxSize;
            var alignHorizontal = args["alignHorizontal"];
            var alignVertical = args["alignVertical"];
            //todo process arguments
            //var lbSize;
            var txtTitle = "";
            var txt = "";
            contentColor = cc.colorToHex(contentColor);
            for (var i = 0; i < stringArr.length; ++i) {
                if (stringArr[i]["isTitle"]) {
                    //txtTitle = "<font = "+ titleFont + ">" + "<color = "+ titleColorHex + ">" + stringArr[i]["text"] + "</color>"+ "</font>";
                    txtTitle = "<font style="+ titleFont + " color="+ titleColorHex + ">" + stringArr[i]["text"] + "<\/font>";
                } else {
                    //txt += stringArr[i];
                    txt += "<font color=" + contentColor + ">" + stringArr[i] + "<\/font>";
                }
            }
            var contentString = txtTitle + "\n" + txt;
            //var strForCalculate = contentString + "";
            //var startIdx = -1;
            //var endIdx = -1;
            //var newContent = "";
            //do{
            //    //todo remove font
            //    startIdx = strForCalculate.indexOf("<font");
            //    endIdx = strForCalculate.indexOf("</font>");
            //    //remove content
            //    if(startIdx != -1 && endIdx != -1) {
            //        if(startIdx > 0) {
            //            newContent = strForCalculate.slice(0,startIdx - 1);
            //        }
            //        newContent += strForCalculate.slice(endIdx + 1,strForCalculate.length);
            //        strForCalculate = newContent;
            //    }
            //    //todo remove size
            //    startIdx = strForCalculate.indexOf("<size");
            //    endIdx = strForCalculate.indexOf("</size>");
            //    //remove content
            //    if(startIdx != -1 && endIdx != -1) {
            //        if(startIdx > 0) {
            //            newContent = strForCalculate.slice(0,startIdx - 1);
            //        }
            //        newContent += strForCalculate.slice(endIdx + 1,strForCalculate.length);
            //        strForCalculate = newContent;
            //    }
            //
            //    //todo remove color
            //    startIdx = strForCalculate.indexOf("<color");
            //    endIdx = strForCalculate.indexOf("</color>");
            //    //remove content
            //    if(startIdx != -1 && endIdx != -1) {
            //        if(startIdx > 0) {
            //            newContent = strForCalculate.slice(0,startIdx - 1);
            //        }
            //        newContent += strForCalculate.slice(endIdx + 1,strForCalculate.length);
            //        strForCalculate = newContent;
            //    }
            //} while(startIdx != -1 && endIdx != -1);

            //todo calculate text size
            //lbSize = Utility.getDynamicContentSizeText(0, 0,strForCalculate ,contentFont, fontSize);
            //if(lbSize.width > maxSize.width){
            //    lbSize.width = maxSize.width;
            //    lbSize.height = offsetHeight + Utility.getDynamicContentSizeText(lbSize.width, 0, strForCalculate, contentFont, fontSize).height;
            //}
            //todo create label
            args = {};
            //args["size"] = lbSize;
            args["fontName"] = contentFont;
            args["fontSize"] = fontSize;
            args["maxSize"] = maxSize;
            //args["color"] = contentColor;
            args["alignHorizontal"] = alignHorizontal;
            args["alignVertical"] = alignVertical;
            var label = _getLabel(args);
            label.setString(contentString);
            //todo return label
            return label;
        }
        function _show(content, target) {
            //cc.log("content size %d, %d", content.getContentSize().width, content.getContentSize().height);

            if (target && target instanceof cc.Node) {
                _nodeContainer.setVisible(true);
                _content && _content.removeFromParent(false);
                _content = content;
                //var targetScaleX = target.getScaleX();
                //var targetScaleY = target.getScaleY();
                //var targetSize = target.getContentSize();
                //targetSize.width *= targetScaleX;
                //targetSize.height *= targetScaleY;
                var targetAnchorPoint = target.getAnchorPoint();

                // re-position to center of target
                var dx = (0.5 - targetAnchorPoint.x) * target.getContentSize().width;
                var dy = (0.5 - targetAnchorPoint.y) * target.getContentSize().height;
                var centerTargetPos = cc.pAdd(target.getPosition(), cc.p(dx, dy));
                var parent = target.getParent();
                var worldPos = parent != null ? parent.convertToWorldSpace(centerTargetPos) : centerTargetPos;
                _imgBg.removeAllChildren(false);
                if(!_content["skipBackground"]) {
                    _imgBg.visible = true;
                    _imgBg.addChild(_content);
                    _updateSize();
                    _updateComponentsPosition();
                }else{
                    _imgBg.visible = false;
                    _nodeContainer.addChild(_content);
                }
                _updateParent();
                _calculatePositionShowing(worldPos, target);
            }
        }
        function _isShowing() {
            //return (!!_nodeContainer) && _nodeContainer.visible && _nodeContainer.getOpacity() > 0;
            return (!!_nodeContainer) && _nodeContainer.visible;
        }
        function _hide() {
            if (_isShowing()) {
                // invisible and resize bg
                _nodeContainer.visible = false;
                _imgBg.width = _minSize.width;
                _imgBg.height = _minSize.height;
            }
            // cleanUp all components
        }
        /**
         * @param stringArr {addTooltipText}
         * stringArr is same textList of function addTooltipText
         * @param target
         * */
        function _showWithContent(target, stringArr) {
            if (!target) return;
            var content;
            if (stringArr && stringArr.length == null && stringArr instanceof cc.Node) {
                //todo show node
                content = stringArr;
            } else {
                //todo show text
                content = new cc.Node();

                var titleColorHex = Utility.getColorByName("tooltip_title");
                titleColorHex = cc.colorToHex(titleColorHex);
                var titleFont = res.FONT_GAME_BOLD;
                var contentFont = res.FONT_GAME;
                //get text
                var args = {};
                args["stringArr"] = stringArr;
                args["titleColorHex"] = titleColorHex;
                args["titleFont"] = titleFont;
                args["contentFont"] = contentFont;
                args["fontSize"] = 24;
                args["offsetHeight"] = 20;
                var label = _getLabelByListString(args);
                //show label
                content.addChild(label);
                //update size
                var curSize = label.getContentSize();
                content.setContentSize(curSize);
                label.attr({
                    anchorX: 0.5,
                    anchorY: 0.5,
                    x: curSize.width >> 1,
                    y: curSize.height >> 1
                });
            }
            //todo show
            _show(content, target);
        }

        /**
         * @public
         * */
        return {
            /**
             * set offset from content to border of bg
             * @param p
             */
            setPadding: function (p) {
                _padding = p;
            },
            setMargin: function (left, right, top, bottom) {
                if (left !== undefined) {
                    _margin_left = left;
                }
                if (right !== undefined) {
                    _margin_right = right;
                }
                if (top !== undefined) {
                    _margin_top = top;
                }
                if (bottom !== undefined) {
                    _margin_bottom = bottom;
                }

            },
            /**
             * @param {Object} args
             *
             * */
            getLabelByListString: _getLabelByListString,
            /**
             * show tooltip with content at target
             * @param content
             * @param target
             */
            show: _show,
            "isShowing": _isShowing,
            /**
             * hide tooltip, clean content,
             * resize bg to small size
             */
            "hide": _hide,
            /**
             * show tooltip text at target
             * @param nodeContent
             * nodeContent is object of cc.Node or Array
             * if nodeContent is instance of Array
             * eg: nodeContent = [
             *                   {"isTitle": true, "text": "text object title here"},
             *                   "string here"
             *                   ]
             * @param target
             */
            showWithContent: _showWithContent,
            /**
             * attach tooltip text with target
             * add listener touch for target,
             * show tooltip at target when press
             * @param textList
             * eg: textList = new cc.Node
             * eg: textList = "text here" or textList = ["text here", "text here"] or textList = [{isTitle: true, text: "text here"}, "text here"]
             * @param target
             * @param isSwallowTouches
             */
            addTooltipText: function (target, textList, isSwallowTouches) {
                if (target && target instanceof cc.Node) {
                    // set index for tooltip
                    target.setUserData({tooltipIndex: _tooltipIndex});

                    if (!_tooltipPool[_tooltipIndex]) {
                        // add tooltip to pool
                        if (textList && textList.length === undefined && textList instanceof cc.Node) {
                            textList.retain();
                        }else if(!(textList instanceof Array)) {
                            textList = [textList];
                        }
                        _tooltipPool[_tooltipIndex] = {textList: textList, target: target};
                    }

                    var listener = cc.EventListener.create({
                        event: cc.EventListener.TOUCH_ONE_BY_ONE,
                        swallowTouches: !!isSwallowTouches,
                        onTouchBegan: function (touch, event) {
                            // get tooltip index from data
                            var target = event.getCurrentTarget();
                            var data = target.getUserData();
                            var tooltipIndex = data.tooltipIndex;
                            // get content tooltip by index
                            if (_tooltipPool[tooltipIndex]) {
                                // convert target position to world position in device
                                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                                var s = target.getContentSize();
                                //cc.log("target.getContentSize() = " + s.width +", " + s.height);
                                var rect = cc.rect(0, 0, s.width, s.height);
                                //cc.log("target.isVisible() = " + target.isVisible());
                                //cc.log("cc.rectContainsPoint(rect, locationInNode) = " + cc.rectContainsPoint(rect, locationInNode));
                                if (target.isVisible() && cc.rectContainsPoint(rect, locationInNode)) {
                                    var tooltipObj = _tooltipPool[tooltipIndex];
                                    // show content tooltip
                                    //cc.log("show Tooltip");
                                    _showWithContent(tooltipObj.target, tooltipObj.textList);
                                    return true;
                                }
                            }
                            //todo always check hide tooltip
                            return true;
                        },
                        onTouchEnded: function (touch, event) {
                            // hide tooltip
                            _hide();
                        },
                        onTouchCancelled: function (touch, event) {
                            // hide tooltip
                            _hide();
                        }
                    });
                    // add listener for target
                    cc.eventManager.addListener(listener, target);
                    // increase index counter
                    ++_tooltipIndex;
                    return listener;
                }
                return false;
            },
            /**
             * clean old content after hide
             * @private
             */
            _cleanContent: function () {
                if (_content) {
                    var allChildren = _content.getChildren();

                    if (allChildren && allChildren.length > 0) {
                        for (var i = 0; i < allChildren.length; ++i) {
                            allChildren[i].removeFromParent();
                        }

                        allChildren.splice(0, allChildren.length);
                        allChildren = null;
                    }

                    _content.removeFromParent();
                    _content = null;
                }
            },
            /**
             * clean all tooltip in pool
             */
            cleanPool: function () {
                for (var index in _tooltipPool) {
                    for (var key in _tooltipPool[index]) {
                        _tooltipPool[index][key] = null;
                    }
                    _tooltipPool[index] = null;
                }

                _tooltipPool = {};
            },

            /**
             * clean up all
             */
            cleanUp: function () {
                _cleanContent();
                _imgBg.removeFromParent();
                _nodeContainer.removeFromParent();
                _tooltipPool = null;
                _minSize = null;
                _imgBg = null;
                _nodeContainer = null;
            }
        }
    }

    return {
        getInstance: function () {
            if(!instance) {
                instance = init();
            }
            return instance;
        }
    }
})();
