"use strict";
/**
 * custom table view
 * */
var CustomTableView = cc.Layer.extend({
    _className: "CustomTableView",
    /**
     * constructor with custom parameter
     * @param {Object} args
     *  {int} colNum ColNum is number of col for each row of matrix
     *  {float} contentSizeWidth
     *  {float} contentSizeHeight
     *  {cc.SCROLLVIEW_DIRECTION_NONE | cc.SCROLLVIEW_DIRECTION_VERTICAL | cc.SCROLLVIEW_DIRECTION_HORIZONTAL | cc.SCROLLVIEW_DIRECTION_BOTH} direction
     *  {float} marginLeft
     *  {float} marginRight
     *  {float} marginTop
     *  {float} marginBottom
     */
    ctor: function (args) {
        args = args || {};
        var colNum = args["colNum"];
        var contentSizeWidth = args["contentSizeWidth"];
        var contentSizeHeight = args["contentSizeHeight"];
        var direction = args["direction"];
        var marginLeft = args["marginLeft"];
        var marginRight = args["marginRight"];
        var marginTop = args["marginTop"];
        var marginBottom = args["marginBottom"];

        this._tableView = null;
        this._elementNum = 0;
        this._elementList = [];
        //set default values if isNeed
        //init colNum value
        this._colNum = colNum !== undefined ? colNum : 1;
        //init contentSizeWidth value
        this._contentSizeWidth = (contentSizeWidth === undefined) ? gv.WIN_SIZE.width : contentSizeWidth;
        //init contentSizeHeight value
        this._contentSizeHeight = (contentSizeHeight === undefined) ? gv.WIN_SIZE.height : contentSizeHeight;
        //init direction value
        this._directionValue = (direction === undefined) ? cc.SCROLLVIEW_DIRECTION_VERTICAL : direction;
        //init margin
        this._marginLeft = (marginLeft === undefined) ? 0 : marginLeft;
        this._marginRight = (marginRight === undefined) ? 0 : marginRight;
        this._marginTop = (marginTop === undefined) ? 0 : marginTop;
        this._marginBottom = (marginBottom === undefined) ? 0 : marginBottom;

        this.setOtherDefaultValues();

        this._super();

        this.initValues();

        //this._super(this,cc.size(this._contentSizeWidth, this._contentSizeHeight));
        //
        //this.setDirection(this._directionValue);
        //if (this._directionValue == cc.SCROLLVIEW_DIRECTION_VERTICAL) {
        //    this.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        //}
    },

    initValues: function () {
        this.setContentSize(this._contentSizeWidth, this._contentSizeHeight);

        this._tableView = new cc.TableView(this, cc.size(this._contentSizeWidth, this._contentSizeHeight));
        this._tableView.setDirection(this._directionValue);
        this._tableView.setDelegate(this);
        if (this._directionValue == cc.SCROLLVIEW_DIRECTION_VERTICAL)
            this._tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.addChild(this._tableView);

        return true;
    },

    onEnter: function () {
        this._super();
        this.createListener();
    },

    onExit: function () {
        this._super();
        this.clearListener();
    },

    createListener: function () {
        var self = this;
        this.tableViewListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                //var target = event.getCurrentTarget();
                var target = self;
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                self.guiElementTouched = false;
                if(cc.rectContainsPoint(rect,locationInNode)){
                    //todo find element target
                    var numCell = self.numberOfCellsInTableView();
                    for(var c = 0; c < numCell; ++c) {
                        var cell = self.getCellAtIndex(c);
                        if(cell) {
                            for (var j = 1; j <= self.getNumberCollum(); ++j) {
                                var guiElement = cell.getChildByTag(j);
                                if(guiElement) {
                                    target = guiElement;
                                    locationInNode = target.convertToNodeSpace(touch.getLocation());
                                    s = target.getContentSize();
                                    rect = cc.rect(0, 0, s.width, s.height);
                                    if(cc.rectContainsPoint(rect,locationInNode) && guiElement.visible){
                                        self.guiElementTouched = guiElement;
                                        self.guiElementTouched["rowIdx"] = c;
                                        self.guiElementTouched["colIdx"] = j - 1;
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                    return true;
                }
                return false;
            },
            onTouchMoved: function () {

            },
            onTouchEnded: function (touch, event) {

            }
        });
        cc.eventManager.addListener(this.tableViewListener, this);
    },

    clearListener: function () {
        if(this.tableViewListener) {
            cc.eventManager.removeListener(this.tableViewListener);
            this.tableViewListener = null;
        }
    },

    setContentSize: function (width, height) {
        this._super(width, height);

        if (this._tableView) {
            this._tableView.setViewSize(cc.size(width, height));
            this._contentSizeWidth = width;
            this._contentSizeHeight = height;
            this.reloadData(true);
        }
    },
    setOtherDefaultValues: function () {
        this._cellNum = Math.ceil(this.getNumberOfElement() / this._colNum);

        //this.anchorX = 0.0;
        //this.anchorY = 0.0;

        this._elementWidth = Math.floor((this._contentSizeWidth - this._marginLeft) / this._colNum - this._marginRight);
        var ele = this.elementGuiForCell();
        if(ele) {
            var scale = ele.getScaleX() || 1;
            this._elementHeight = scale * ele.getContentSize().height * this._elementWidth / ele.getContentSize().width;
        }else{
            this._elementHeight = +this._elementWidth;
        }

        if(!this._cellWidth){
            this._cellWidth = this._elementWidth ? this._elementWidth * this._colNum + this._marginLeft+ this._marginRight : this._cellHeight;
        }
        if(!this._cellHeight) {
            this._cellHeight = this._elementHeight ? this._elementHeight + this._marginTop + this._marginBottom : this._cellHeight;
        }
    },

    setDataTableViewList: function (listItem_) {
        if (listItem_) {
            if (this._elementList.length > 0) this._elementList.splice(0);
            this._elementList = [];

            this._elementNum = listItem_.length.valueOf();
            cc.log("Custom TableView setDataTableViewList this._elementNum", this._elementNum, "listItem_.length", listItem_.length);
            //append item into list view
            for (var i = 0; i < this._elementNum; ++i) {
                this._elementList.push(listItem_[i]);
            }
            cc.log("Custom TableView setDataTableViewList this._elementList.length", this._elementList.length);
        }
        //this.reloadData();
        this._tableView.reloadData();
    },

    setTouchEnabled: function (eff) {
        this._tableView.setTouchEnabled(eff);
    },
    setSwallowTouches: function (eff) {
    },
    setBounceEnabled: function (eff) {
        this._tableView.setBounceable(eff);
        //this.setBounceable(eff);
    },
    setContentOffset: function(contentOffset, isAnimate){
        this._tableView.setContentOffset(contentOffset, isAnimate);
    },

    resetView: function () {
        this.reloadData();
    },
    reloadData: function (isKeepOffset, isScrollToEndView, isAnimate) {
        //get old offset
        var contentOffset = this.getContentOffset();
        //reload view
        //this._super();
        this._tableView.reloadData();
        //check new offset

        if (isScrollToEndView) {
            if (this._directionValue == cc.SCROLLVIEW_DIRECTION_VERTICAL) {
                var newX = this._contentSizeWidth - this.getContentSizeOfTableView().width;
                contentOffset.x = (this._contentSizeWidth + 15) < this.getContentSizeOfTableView().width ? newX : 0;
                isAnimate && contentOffset.x != 0 && this.setContentOffset(cc.p(contentOffset.x + 100, contentOffset.y), false);
                this.setContentOffset(contentOffset, isAnimate);
            } else {
                var newX = this._contentSizeWidth - this.getContentSizeOfTableView().width;
                contentOffset.x = (this._contentSizeWidth + 15) < this.getContentSizeOfTableView().width ? newX : contentOffset.x;
                isAnimate && contentOffset.x != 0 && this.setContentOffset(cc.p(contentOffset.x - 100, contentOffset.y), false);
                this.setContentOffset(contentOffset, isAnimate);
            }
        } else {
            if (this._directionValue == cc.SCROLLVIEW_DIRECTION_VERTICAL) {
                if (this.getNumberRow() * this._cellHeight < this._contentSizeHeight) {
                    isKeepOffset = false;
                    return false;
                }
            } else {
                if (this.getNumberRow() * this._cellHeight < this._contentSizeWidth) {
                    isKeepOffset = false;
                    return false;
                }
            }
            if (isKeepOffset) {
                if (this._directionValue == cc.SCROLLVIEW_DIRECTION_VERTICAL) {
                    var newY = -(this.getContentSizeOfTableView().height - this._contentSizeHeight);
                    contentOffset.y = Math.abs(newY) < Math.abs(contentOffset.y) ? newY : contentOffset.y;
                    //set offset again
                    if (isAnimate) {
                        this.setContentOffset(cc.p(contentOffset.x, contentOffset.y + 223), false);
                        /*}else{
                         this.setContentOffset(cc.p(contentOffset.x - 100, contentOffset.y), false);
                         }*/
                    }
                } else {
                    var newX = -(this.getContentSizeOfTableView().width - this._contentSizeWidth);
                    contentOffset.x = Math.abs(newX) < Math.abs(contentOffset.x) ? newX : contentOffset.x;
                    //set offset again
                    if (isAnimate) {
                        this.setContentOffset(cc.p(contentOffset.x - 100, contentOffset.y), false);
                    }
                }
                this.setContentOffset(contentOffset, isAnimate);
            }
        }
    },

    scrollToBottom: function (isAnimate) {
        if (this.getNumberRow() * this._cellHeight < this._contentSizeHeight) {
            return false;
        }
        var contentOffset = this.getContentOffset();
        contentOffset.y = 0;
        this.setContentOffset(contentOffset, isAnimate);
    },

    setClassName: function (name_) {
        this._className = name_;
    },

    //scrollViewDidScroll: function (view) {
    //},
    //scrollViewDidZoom: function (view) {
    //},
    getGuiElementTouchedInfo: function () {
        if(!this.guiElementTouched) {
            this.guiElementTouched = false;
            return {
                "target": this.guiElementTouched,
                "rowIdx": -1,
                "colIdx": -1
            };
        }else{
            return {
                "target": this.guiElementTouched,
                "rowIdx": this.guiElementTouched["rowIdx"],
                "colIdx": this.guiElementTouched["colIdx"]
            };
        }
    },

    tableCellTouched: function (table, cell) {
        var idx_ = cell.getIdx();
        var guiElementTouchedInfo = this.getGuiElementTouchedInfo();
        if(guiElementTouchedInfo["target"]) {
            this.elementTouched(guiElementTouchedInfo["target"], idx_, guiElementTouchedInfo["colIdx"]);
        }
    },
    elementTouched: function (element, rowIdx, colIdx) {
        //todo override here
        cc.log("touched custom table view", rowIdx, colIdx);
    },

    tableCellSizeForIndex: function (table, idx) {
        //todo override me with object of cc.size
        return cc.size(this._cellWidth, this._cellHeight);
    },

    tableCellAtIndex: function (table, idx) {
        //todo override me and return an object of type cc.TableViewCell

        //default for cc.SCROLLVIEW_DIRECTION_VERTICAL only
        var indexCell = idx.toFixed(0);
        var cell = table.dequeueCell();
        if (!cell) {
            cell = new cc.TableViewCell();
            var itemWidth = Math.floor(this._contentSizeWidth / this._colNum) - (this._marginLeft + this._marginRight);
            var itemHeight;

            for (var appendIndex = 0; appendIndex < this._colNum; ++appendIndex) {
                //add element gui
                var customElement = this.elementGuiForCell();
                if(customElement) {
                    if(!customElement.getContentSize().width || !customElement.getContentSize().height){
                        //for node
                        customElement.setContentSize(1,1);
                    }

                    if (!itemHeight) {
                        itemHeight = customElement.getContentSize().height * itemWidth / customElement.getContentSize().width;
                    }

                    customElement.setContentSize(itemWidth, itemHeight);
                    customElement.setScale((itemWidth / customElement.getContentSize().width) * (customElement.getScaleX() || 1), (itemHeight / customElement.getContentSize().height) * (customElement.getScaleY() || 1));

                    var modValue = appendIndex % this._colNum;
                    customElement.attr({
                        anchorX: 0,
                        anchorY: 0,
                        x: (this._marginLeft + itemWidth + this._marginRight) * modValue + this._marginLeft,
                        y: +this._marginBottom
                    });
                    customElement.tag = appendIndex + 1;
                    cell.addChild(customElement);
                }

                //add slot icon
                var slotImage_ = this.slotElementGuiForCell();
                if(slotImage_ && customElement) {
                    slotImage_.attr({
                        anchorX: customElement.anchorX,
                        anchorY: customElement.anchorY,
                        x: customElement.x,
                        y: customElement.y,
                        width: customElement.getScaleX() * customElement.getContentSize().width,
                        height: customElement.getScaleY() *  customElement.getContentSize().height
                    });
                    slotImage_.tag = appendIndex + 123;
                    cell.addChild(slotImage_);
                }
            }
            this._elementWidth = itemWidth;
            this._elementHeight = itemHeight;
            if(!this._cellWidth) {
                this._cellWidth = this._contentSizeWidth;
            }
            if(!this._cellHeight) {
                this._cellHeight = itemHeight ? itemHeight + this._marginTop + this._marginBottom : this._cellHeight;
            }
            cell.setContentSize(this._cellWidth, this._cellHeight);
        }

        //update element info
        var indexElement = indexCell * this._colNum;//the first element of cell
        this._elementNum = this.getNumberOfElement();
        for (var i = 0; (i < this._colNum) && indexElement < this._elementNum; ++i, ++indexElement) {
            var itemInfo = this._elementList[indexElement];
            var item = cell.getChildByTag(i + 1);
            //xu ly hien thi o day
            this.elementInfoAtIndex(item, itemInfo, indexElement);
        }

        //todo hide empty element, show slot
        if (idx == (this._cellNum - 1)) {//last cell
            var numEmptySlot = this._cellNum * this._colNum - this.getNumberOfElement();
            //reset view element for cell
            for (var k = 1; k <= this._colNum; ++k) {
                var ele = cell.getChildByTag(k);
                if(ele){
                    ele.visible = true;
                    if(ele.resetView) {
                        ele.resetView();
                    }
                }
            }
            //hide empty element
            for (var indexEmptySlot = this.getNumberOfElement() % this._colNum; numEmptySlot > 0; --numEmptySlot) {
                indexEmptySlot++;
                var emptyEle = cell.getChildByTag(indexEmptySlot);
                if(emptyEle){
                    emptyEle.visible = false;
                }
            }
        } else {
            for (var j = 1; j <= this._colNum; ++j) {
                var fullEle = cell.getChildByTag(j);
                if(fullEle) {
                    fullEle.visible = true;
                }
            }
        }
        return cell;
    },

    elementGuiForCell: function () {
        //todo override
        var layerColor = new cc.LayerColor(Utility.getColorByName("green"), this._contentSizeWidth / this._colNum, this._cellHeight);
        layerColor.setOpacity(200);
        return layerColor;
    },

    slotElementGuiForCell: function () {
        //todo override
        var layerColor = new cc.LayerColor(Utility.getColorByName("gray"), this._contentSizeWidth / this._colNum, this._cellHeight);
        layerColor.setOpacity(100);
        return layerColor;
    },

    elementInfoAtIndex: function (elementGui, info, index) {
        //todo override
        if(elementGui) {
            elementGui.setColor(cc.color(Math.random() * 255, Math.random() * 255, Math.random() * 255));
            if(!elementGui["labelIndex"]){
                elementGui["labelIndex"] = Utility.getLabel("" + index);
                elementGui.addChild(elementGui["labelIndex"]);
                elementGui["labelIndex"].attr({
                    anchorX: 0.5,
                    anchorY: 0.5,
                    x: 0.5 * elementGui.getContentSize().width,
                    y: 0.5 * elementGui.getContentSize().height
                });
            }
            elementGui["labelIndex"].setString(StringUtil.toMoneyString(index + 1));

            var MAX_LEN = (Math.floor(this.getNumberOfElement()/1000) + 1) * 3;
            MAX_LEN = Math.min(MAX_LEN, 5);
            var curFontSize = elementGui.getContentSize().width / MAX_LEN;
            curFontSize = Math.min(curFontSize, this._cellHeight);
            elementGui["labelIndex"].setFontSize(curFontSize);
        }
    },


    getCellAtIndex: function (idx) {
        return this._tableView.cellAtIndex(idx);
    },

    insertCellForIndex: function (idx) {
        this._tableView.insertCellAtIndex(idx);
        //this.insertCellAtIndex(idx);
    },

    removeCellForIndex: function (idx) {
        this._tableView.removeCellAtIndex(idx);
        //this.removeCellAtIndex(idx);
    },

    updateCellForIndex: function (idx) {
        this._tableView.updateCellAtIndex(idx);
        //this.updateCellAtIndex(idx);
    },

    numberOfCellsInTableView: function (table) {
        this._cellNum = Math.ceil(this.getNumberOfElement() / this._colNum);
        return this._cellNum;
    },
    appendCustomElement: function (customElement) {
        if (customElement == null) {
            return;
        }
        this._elementList.push(customElement);
    },
    updateCellFromIndex: function (idx) {
        if (!idx || idx < 0 || idx > this._cellNum) return;
        for (var i = idx; i < this._cellNum; ++i) this.updateCellForIndex(i);
    },
    getClassName: function () {
        return this._className;
    },
    getList: function () {
        return this._elementList;
    },
    getNumberOfElement: function () {
        return this._elementList.length;
    },
    getNumberRow: function () {
        return this._cellNum;
    },
    getNumberCollum: function () {
        return this._colNum;
    },

    insertCustomElement: function (customElement, index_) {
        if (customElement == null) return;
        if (index_ > this._elementList.length) index_ = this._elementList.length;
        this._elementList.splice(index_, 0, customElement);
        //var indexCellUpdate = Math.ceil(index_ / this._colNum);
    },
    getElementGuiById: function (id) {
        return this.getElementGuiByProperty("_id", id);
    },
    getElementGuiByProperty: function (property, value, skipScroll) {
        var indexOfList = this.getIndexOfElementByProperty(property, value);
        if(indexOfList >= 0) {
            var indexCell = Math.floor(indexOfList / this._colNum);
            var indexElement = (indexOfList % this._colNum + 1);
            var cell = this.getCellAtIndex(indexCell);
            if(!skipScroll && !cell) {
                //cell at index indexCell not yet create
                this.scrollToCellAtIndex(indexCell);
                cell = this.getCellAtIndex(indexCell);
                if(!cell) {
                    return null;
                }else{
                    return cell.getChildByTag(indexElement);
                }
            }else{
                if(!cell) {
                    return null;
                }else{
                    return cell.getChildByTag(indexElement);
                }
            }
        }
        return null;
    },
    getElementGuiByIndex: function (index, skipScroll) {
        if(index >= 0) {
            var indexCell = Math.floor(index / this._colNum);
            var indexElement = (index % this._colNum + 1);
            var cell = this.getCellAtIndex(indexCell);
            if(!skipScroll && !cell) {
                //cell at index indexCell not yet create
                this.scrollToCellAtIndex(indexCell);
                cell = this.getCellAtIndex(indexCell);
                if(!cell) {
                    return null;
                }else{
                    return cell.getChildByTag(indexElement);
                }
            }else{
                if(!cell) {
                    return null;
                }else{
                    return cell.getChildByTag(indexElement);
                }
            }
        }
        return null;
    },
    getElementById: function (id_) {
        if (id_ === null || id_ === undefined)
            return null;
        var len_ = this._elementList.length;
        for (var index_ = 0; index_ < len_; ++index_) {
            if (this._elementList[index_]) {
                if (this._elementList[index_]._id === id_) {
                    return this._elementList[index_];
                }
            }
        }
        return null;
    },
    /**
     * @param {String} property_
     * @param {Object} value
     * */
    getElementByProperty: function (property_, value) {
        if (property_ === null || property_ === undefined)
            return null;
        if (value === null || value === undefined)
            return null;
        var len_ = this._elementList.length;
        for (var index_ = 0; index_ < len_; ++index_) {
            if (this._elementList[index_]) {
                if (this._elementList[index_][property_] === value) {
                    return this._elementList[index_];
                }
            }
        }
        return null;
    },
    /**
     * @param {String} property_
     * @param {Object} value
     * */
    getIndexOfElementByProperty: function (property_, value) {
        if (property_ === null || property_ === undefined)
            return -1;
        if (value === null || value === undefined)
            return -1;
        var len_ = this._elementList.length;
        for (var index_ = 0; index_ < len_; ++index_) {
            if (this._elementList[index_]) {
                if (this._elementList[index_][property_] === value) {
                    return index_;
                }
            }
        }
        return -1;
    },
    getIndexOfElementById: function (id_) {
        if (id_ === null || id_ === undefined)
            return -1;
        var len_ = this._elementList.length;
        for (var index_ = 0; index_ < len_; ++index_) {
            if (this._elementList[index_]) {
                if (this._elementList[index_]._id === id_) {
                    return index_;
                }
            }
        }
        return -1;
    },
    getContentOffset: function () {
        return this._tableView.getContentOffset();
    },
    getContentSizeOfTableView: function () {
        return this._tableView.getContentSize();
        //return this.getContentSize();
    },

    removeElementForId: function (id_) {
        if (id_ === null || id_ === undefined) return -1;
        var index_ = this.getIndexOfElementById(id_);
        if (index_ >= 0) {
            this._elementList.splice(index_, 1);
        }
        return index_;
    },
    /**
     * @param {String} property_
     * @param {Object} value
     * */
    removeElementByProperty: function (property_, value) {
        if (value === null || value === undefined) return -1;
        var index_ = this.getIndexOfElementByProperty(property_, value);
        if (index_ >= 0) {
            this._elementList.splice(index_, 1);
        }
        return index_;
    },

    removeAllCustomElement: function () {
        this._elementList.splice(0);
        this.reloadData();
    },
    updateElementInfoForId: function (id_, info_) {
        if (id_ === null || info_ === null || id_ === undefined || info_ === undefined) return;
        var index_ = this.getIndexOfElementById(id_);
        if (index_ >= 0) {
            this._elementList[index_] = info_;
        }
    },
    /**
     * @param {String} property_
     * @param {Object} value
     * @param {Object} info_
     * */
    updateElementInfoByProperty: function (property_, value, info_) {
        if (value === null || info_ === null || value === undefined || info_ === undefined) return;
        var index_ = this.getIndexOfElementByProperty(property_, value);
        if (index_ >= 0) {
            this._elementList[index_] = info_;
        }
    },
    focusTouchElementById: function (id) {
        this.focusTouchElementByProperty("_id", id);
    },
    focusTouchElementByProperty: function (property, value) {
        var elementGui = this.getElementGuiByProperty(property, value);
        if(elementGui) {
            var parent = this.getParent();
            if(parent) {
                var wPos1 = parent.convertToWorldSpace(this.getPosition());
                var wPos2;
                var anchorY = 0;
                if(elementGui.getWorldPosition) {
                    wPos2 = elementGui.getWorldPosition();
                    anchorY = 0.5;
                }else{
                    wPos2 = elementGui.getParent().convertToWorldSpace(elementGui.getPosition());
                }
                var option = 20;
                var curH = this._contentSizeHeight;
                var elementSize = elementGui.getContentSize();
                var minY = wPos2.y - anchorY * elementSize.height;
                var maxY = wPos2.y + (1 - anchorY) * elementSize.height;
                var delta = minY - wPos1.y;
                var curContentOffset = this.getContentOffset();
                if(delta + option < 0) {
                    //move up
                    curContentOffset.y += Math.abs(delta);
                    this.setContentOffset(curContentOffset, false);
                }else{
                    delta = wPos1.y + curH - maxY;
                    if(delta + option < 0) {
                        //move down
                        curContentOffset.y -= Math.abs(delta);
                        this.setContentOffset(curContentOffset, false);
                    }
                }
            }
        }
    },
    scrollToCellAtIndex: function (idx, isAnimation) {
        if(idx >= 0) {
            var deltaY = this._cellHeight * idx;
            var totalHeight = this._cellHeight * this.getNumberRow();
            var curContentOffset = this.getContentOffset();
            curContentOffset.y = -totalHeight + deltaY + this._cellHeight * 0.5;
            this.setContentOffset(curContentOffset, isAnimation);
        }
    }
});