"use strict";

var NotificationTextRun = cc.Class.extend({
    ctor: function () {
        this.clearQueueAdvertiseText();
        this.setParentShow(null);
    },
    setListTextContent: function (list) {
        if (list && list.length > 0) {
            this._listTextContent = JSON.parse(JSON.stringify(list));
        } else {
            this._listTextContent = [];
        }
    },
    getListTextContent: function () {
        return this._listTextContent;
    },
    setParentShow: function (parent) {
        //cc.log("set parent show", !!parent);
        this._parentShow = parent;
    },
    getParentShow: function () {
        //cc.log("get parent show", !!this._parentShow);
        return this._parentShow;
    },

    getPositionForLobby: function () {
        return cc.p(100, gv.WIN_SIZE.height - 120);
    },

    getPositionTopCenter: function () {
        var temp = 0;
        var gui = this.getGuiAdvertise();
        if (gui && gui.getBackground()) {
            temp = gui.getBackground().getContentSize().width >> 1;
        }
        return cc.p(gv.WIN_SIZE.width * 0.5 - temp, gv.WIN_SIZE.height - 100);
    },

    getGuiAdvertise: function () {
        var self = this;
        if (!this._guiAdvertise) {
            this._guiAdvertise = new BaseGUI();

            //create background
            var sprBg = Utility.getInstance().createSpriteFromFileName(resImg.RESOURCES__TEXTURES__UI__BG_ADVERTISE_PNG);
            this._guiAdvertise.imgBg = new ccui.Layout();
            this._guiAdvertise.imgBg.setContentSize(sprBg.getContentSize());
            this._guiAdvertise.imgBg.setPosition(this.getPositionForLobby());

            this._guiAdvertise.imgBg.setClippingEnabled(true);
            this._guiAdvertise.imgBg.addChild(sprBg);
            sprBg.attr({
                anchorX: 0,
                anchorY: 0,
                x: 0,
                y: 0
            });

            this._guiAdvertise.addChild(this._guiAdvertise.imgBg);
            this._guiAdvertise.getBackground = function () {
                return this.imgBg;
            }.bind(this._guiAdvertise);
            this._guiAdvertise.listAppear = [];
            this._guiAdvertise.registerAppear = function (txt) {
                this.listAppear.push(txt);
            }.bind(this._guiAdvertise);
            this._guiAdvertise.clearRegisterAppear = function () {
                this.listAppear.splice(0);
                this.listAppear = [];
            }.bind(this._guiAdvertise);

            this._guiAdvertise.isRegisterAppear = function (txt) {
                var idx = this.listAppear.findIndex(function (element) {
                    return element == txt;
                });
                return idx >= 0;
            }.bind(this._guiAdvertise);

            this._guiAdvertise.appearText = function (txt, appearCb, endCb) {
                if (!self.isShowingAdvertise || !this.isRegisterAppear(txt)) {
                    //cc.log('ad appear text', self.isShowingAdvertise);
                    Utility.executeCallback(this.showCb);
                    this.showCb = null;
                    return false;
                }
                //cc.log('appear text', txt);
                var lb = self.createLabelText(txt);
                this.getBackground().addChild(lb);
                var x = this.getBackground().getContentSize().width;
                var y = this.getBackground().getContentSize().height * 0.5 + 1.5;
                lb.setPosition(x, y);
                lb.runAction(self.getActionMoveLeft(lb, appearCb, endCb));
            }.bind(this._guiAdvertise);//end function appear

            var parent = this.getParentShow();
            if (!!parent && parent.addChild) {
                parent.addChild(this._guiAdvertise);
            } else {
                cc.error('is not exist parent');
            }
        }
        return this._guiAdvertise;
    },

    setGuiAdvertisePosition: function (pos, y) {
        if (pos !== undefined) {
            var p = pos.x !== undefined ? pos : cc.p(pos !== undefined ? pos : 0, y !== undefined ? y : 0);
            var gui = this.getGuiAdvertise();
            if (gui && gui.getBackground()) {
                gui.getBackground().setPosition(p);
            }
        }
    },

    getGuiAdvertisePosition: function () {
        var gui = this.getGuiAdvertise();
        if (gui && gui.getBackground()) {
            return gui.getBackground().getPosition();
        } else {
            return cc.POINT_ZERO;
        }
    },


    preProcessingText: function (data) {
        //todo check format text
        //existed color: data = <color = #value>string text here</color>
        var endColorTag = "</color>";
        if (data.indexOf(endColorTag) > 0) {
            //clear tag
            var textArr = data.split(endColorTag);
            var num = textArr.length;
            var space = ' ';
            //cc.log('num color #F9F21D', num);
            for (var i = 0; i < num; ++i) {
                //get text content
                if (textArr[i] != '') {
                    //cc.log('i = ', i, textArr[i].replace("<", "..."));
                    var tag2 = ">";
                    var arr = textArr[i].split(tag2);
                    var color = arr[0] + tag2;
                    var text = arr[1];
                    //cc.log('text', text, 'arr 0', arr[0], 'color', color + "");
                    //process
                    arr = text.split(space);
                    var len = arr.length;
                    for (var j = 0; j < len; ++j) {
                        arr[j] = color.replace(/ /g, "") + arr[j] + endColorTag;
                        //cc.log('arr j = ', j, arr[j]);
                    }
                    //merge
                    textArr[i] = arr.join(space);
                    //cc.log('text arr i', i, textArr[i]);
                } else {
                    //cc.log('textArr[i] is empty', i, textArr[i].replace("<", "..."));
                }
            }
            //merge
            data = textArr.join(space);
            //cc.log('data', data.replace(/</g, "..."));
        }
        return data;
    },
    /**
     * show a text string
     * */
    showAdvertiseWithText: function (text, endShowTextCallback, notShowCallBack) {
        if (text != undefined && text != "") {
            if (!this.isShowingAdvertise) {
                this.isShowingAdvertise = true;
                var ad = this.getGuiAdvertise();
                var result = this.preProcessingText(text);
                var arr = result.split(' ');

                var recursive = function (txtArr) {
                    if (txtArr && txtArr.length > 0) {
                        var callEndCb = txtArr.length == 1;
                        var txt = txtArr.shift();
                        ad.registerAppear(txt);
                        ad.appearText(txt, function () {
                            recursive(txtArr);
                        }, callEndCb ? endShowTextCallback : null);
                    }
                };
                if (arr.length > 0) {
                    recursive(arr);
                } else {
                    Utility.getInstance().executeFunction(notShowCallBack);
                    notShowCallBack = null;
                }
            } else {
                Utility.getInstance().executeFunction(notShowCallBack);
                notShowCallBack = null;
            }
        } else {
            Utility.getInstance().executeFunction(notShowCallBack);
            notShowCallBack = null;
        }
    },
    hideAdvertise: function (isSkipDestroy) {
        //cc.log('hideAdvertise', !!this.isShowingAdvertise, !!isSkipDestroy);
        this.isShowingAdvertise = false;
        if (this._guiAdvertise) {
            this._guiAdvertise.clearRegisterAppear();
            if (!isSkipDestroy) {
                //cc.log('destroy gui advertise');
                this._guiAdvertise.destroy(DestroyEffects.FADE_OUT_ONLY);
                this._guiAdvertise = null;
            }
        }
    },
    getLabelTextSize: function () {
        return 20;
    },
    createLabelText: function (text) {
        var myLb;
        var self = this;
        if (!this.myLabel) {
            this.myLabel = ccui.Text.extend({
                data: null,
                ctor: function (text) {
                    this._super("text", res.FONT_GAME_BOLD_ITALIC, self.getLabelTextSize());
                    this.initData(text);
                    //todo check color
                    //format is <color = #F9F21D>text</color>
                    this.updateDisplay(text);
                    var shadowColor = Utility.getColorByName("black");
                    var strokeColor = Utility.getColorByName("stroke");
                    var shadowOffset = {width: 0, height: -1};
                    var shadowSize = 1;
                    var strokeSize = 1;
                    this.enableShadow(shadowColor, shadowOffset, shadowSize);
                    this.enableOutline(strokeColor, strokeSize);
                    this.setAnchorPoint(cc.p(0, 0.5));
                    //cc.log('create new label', text);
                },
                initData: function (data) {
                    this.data = data;
                },
                getData: function () {
                    return this.data;
                },
                preProcessingTextData: function (data) {
                    var tag = "\<\/color\>";
                    if (data.indexOf(tag) > 0) {
                        //clear tag
                        //cc.log('raw data', data.replace("<", "..."));
                        data = data.replace(tag, "");
                        //get text content
                        var arr = data.split("\>");
                        var text = arr[1];
                        var color = arr[0].split("=")[1];
                        //cc.log('text exist color', color);
                        return {text: text, color: color};
                    } else {
                        //cc.log('normal text without color', data);
                        return data;
                    }
                },
                updateDisplay: function (data) {
                    var color = cc.color("#F9F21D");
                    var strInfo = this.preProcessingTextData(data);
                    if (strInfo.color !== undefined) {
                        this.setString(strInfo.text);
                        color = cc.color(strInfo.color);
                    } else {
                        this.setString(strInfo + "");
                    }
                    this.setColor(color);
                },
                unuse: function () {
                    this.data = null;
                    this.retain();//if in jsb
                    this.setVisible(false);
                    this.removeFromParent(false);
                },
                reuse: function (text) {
                    //cc.log('reuse label', text);
                    this.initData(text);
                    this.updateDisplay(text);
                    this.setVisible(true);
                }
            });
        }
        var pool = cc.pool;
        if (pool.hasObject(this.myLabel)) {
            myLb = pool.getFromPool(this.myLabel, text);
        } else {
            myLb = new this.myLabel(text);
        }
        return myLb;
    },
    getMoveLeftTime: function () {
        return 10;
    },
    getActionMoveLeft: function (obj, appearCallback, middleCallback, endCallback) {
        var ACTION_TIME = this.getMoveLeftTime();
        var ratio = 0.2;
        var min = 100;
        var x = gv.WIN_SIZE.width >> 1;
        var y = gv.WIN_SIZE.height >> 1;

        var delay = 0;
        var delta;

        if (obj) {
            if (obj instanceof Function) {
                middleCallback = obj;
            } else {
                obj.setOpacity(min);
                if (!obj['oldPos']) {
                    obj['oldPos'] = obj.getPosition();
                }
                x = obj['oldPos'].x;
                y = obj['oldPos'].y;

                var w = 0;
                if (obj.getContentSize) {
                    w = obj.getContentSize().width;
                    delta = (w + 5) * this.getMoveLeftTime() / x;
                }
                delay += delta;
            }
        }

        var moveAction_1 = cc.spawn(
            cc.moveTo(ACTION_TIME, 0, y),
            cc.sequence(
                cc.fadeTo(ACTION_TIME * ratio, 255),
                cc.delayTime(ACTION_TIME * (1 - ratio * 2)),
                cc.fadeTo(ACTION_TIME * ratio, min)
            ),
            cc.sequence(
                cc.delayTime(delay),
                cc.callFunc(function () {
                    Utility.executeCallback(appearCallback);
                    appearCallback = null;
                }),
                cc.delayTime(ACTION_TIME - delay)
            )
        );
        var moveAction_2 = cc.spawn(
            cc.moveTo(ACTION_TIME, -x, y),
            cc.fadeTo(ACTION_TIME, min * 0.5)
        );
        return cc.sequence(
            moveAction_1,
            cc.callFunc(function () {
                Utility.executeCallback(middleCallback);
                middleCallback = null;
            }.bind(obj)),
            moveAction_2,
            cc.callFunc(function (sender) {
                cc.pool.putInPool(sender);
                Utility.executeCallback(endCallback);
                endCallback = null;
            })
        );
    },

    isRequestShowContentTextAdvertise: function (eff) {
        if (eff !== undefined) {
            this._isRequestShowContentTextAdvertise = eff;
        }
        return this._isRequestShowContentTextAdvertise;
    },
    isListTextAvailable: function () {
        return this.getListAdvertiseTextQueue().length > 0 || (this.isRequestShowContentTextAdvertise() && this.getListTextContent().length > 0);
    },
    /**
     * @param {[]} content
     * @param startTime (seconds)
     * @param endTime (seconds)
     * @param numTimeShow (seconds): duration show text
     * @param loopTime (seconds): after loopTime, call show text advertise again
     * */
    showTextAdvertise: function (content, startTime, endTime, numTimeShow, loopTime) {
        content = content !== undefined ? content : gv.NEWS.content;
        startTime = startTime !== undefined ? startTime : gv.NEWS.startTime;
        endTime = endTime !== undefined ? endTime : gv.NEWS.endTime;
        numTimeShow = numTimeShow !== undefined ? +numTimeShow : +gv.NEWS.numTimeShow;
        loopTime = loopTime !== undefined ? loopTime : gv.NEWS.loopTime;
        this.setListTextContent(content);
        this.setNumTimeShow(numTimeShow);
        this.setLoopTimeShow(loopTime);
        this.isRequestShowContentTextAdvertise(true);
        this.setStartTimeShow(startTime);
        this.setEndTimeShow(endTime);
        if (GameUtil.checkAvailableTimeShowTextAdvertise(startTime, endTime) && this.isListTextAvailable()) {
            if (this.isShowingAdvertise) {
                //is showing, call again after loop time
                this.callFunctionWithDelay(this.getLoopTimeShow(), function () {
                    var guiLobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
                    if(guiLobby) {
                        this.setParentShow(guiLobby);
                        this.setGuiAdvertisePosition(this.getPositionForLobby());
                    }else{
                        this.setParentShow(null);
                    }
                    if (this.getParentShow()) {
                        this.showTextAdvertise(content, startTime, endTime, numTimeShow, loopTime);
                    }
                }.bind(this));
            } else {
                this.showNextText(function () {
                    this.isRequestShowContentTextAdvertise(false);
                    this.hideAdvertise();
                    this.callFunctionWithDelay(this.getLoopTimeShow(), function () {
                        var guiLobby = gv.guiMgr.getGuiById(GuiId.LOBBY);
                        if(guiLobby) {
                            this.setParentShow(guiLobby);
                            this.setGuiAdvertisePosition(this.getPositionForLobby());
                        }else{
                            this.setParentShow(null);
                        }
                        if (this.getParentShow()) {
                            this.showTextAdvertise(content, startTime, endTime, numTimeShow, loopTime);
                        }
                    }.bind(this));
                }.bind(this));
            }
        } else {
            //cc.log('can not show text advertise', content.length);
        }
    },
    setStartTimeShow: function (value) {
        this._startTimeShow = value;
    },
    getStartTimeShow: function () {
        if (!this._startTimeShow) {
            this._startTimeShow = 0;
        }
        return this._startTimeShow;
    },
    setEndTimeShow: function (value) {
        this._endTimeShow = value;
    },
    getEndTimeShow: function () {
        if (!this._endTimeShow) {
            this._endTimeShow = 0;
        }
        return this._endTimeShow;
    },
    setNumTimeShow: function (num) {
        this._numTimeShow = num;
    },
    getNumTimeShow: function () {
        if (!this._numTimeShow) {
            this._numTimeShow = 0;
        }
        return this._numTimeShow;
    },
    increaseCountNumTimeShow: function () {
        if (!this._countNumTimeShow) {
            this._countNumTimeShow = 0;
        }
        this._countNumTimeShow++;
    },
    setCountNumTimeShow: function (num) {
        this._countNumTimeShow = num;
    },
    getCountNumTimeShow: function () {
        if (!this._countNumTimeShow) {
            this._countNumTimeShow = 0;
        }
        return this._countNumTimeShow;
    },

    setLoopTimeShow: function (num) {
        this._loopTimeShow = num;
    },
    getLoopTimeShow: function () {
        if (!this._loopTimeShow) {
            this._loopTimeShow = 0;
        }
        return this._loopTimeShow;
    },

    increaseShowTextIndex: function () {
        if (!this._showTextIdx) {
            this._showTextIdx = 0;
        }
        this._showTextIdx = (this._showTextIdx + 1) % this.getListTextContent().length;
    },
    getShowTextIndex: function () {
        if (!this._showTextIdx) {
            this._showTextIdx = 0;
        }
        return this._showTextIdx;
    },
    showNextText: function (endShowCb) {
        var parentShow = this.getParentShow();
        //cc.log('can show text advertise');
        if (parentShow && this.isListTextAvailable()) {
            var list;
            var idx;
            var numShow;
            var strText;
            //check show text in queue
            if (this.getListAdvertiseTextQueue().length > 0) {
                //todo show text in queue
                list = this.getListAdvertiseTextQueue();
                var isCallCallback = list.length == 1;
                strText = list.shift() + "";
                if (!this.isShowingAdvertise && isCallCallback) {
                    //cc.log('hide advertise before');
                    this.hideAdvertise(true);
                    return this.showAdvertiseWithText(strText, endShowCb);//todo break
                } else {
                    //normal
                    //cc.log('hide advertise before');
                    this.hideAdvertise(true);
                    return this.showAdvertiseWithText(strText, this.showNextText.bind(this, endShowCb));//todo break
                }
            } else {
                //end queue, execute queue callback
                if (this.getShowQueueAdvertiseTextCallback()) {
                    Utility.executeCallback(this.getShowQueueAdvertiseTextCallback());
                    this.setShowQueueAdvertiseTextCallback(null);
                }
            }

            list = this.getListTextContent();
            idx = this.getShowTextIndex();
            numShow = this.getNumTimeShow();

            var len = list.length;
            if (idx < len && GameUtil.checkAvailableTimeShowTextAdvertise(this.getStartTimeShow(), this.getEndTimeShow())) {
                strText = list[idx] + "";
                if (idx == 0) {
                    //start text
                    if (this.getCountNumTimeShow() < numShow) {
                        this.increaseCountNumTimeShow();
                        //cc.log('hide advertise before');
                        this.hideAdvertise(true);
                        this.showAdvertiseWithText(strText, this.showNextText.bind(this, endShowCb));
                        //auto increase show index
                        this.increaseShowTextIndex();
                    } else {
                        //todo end show
                        Utility.executeCallback(endShowCb);
                        this.setCountNumTimeShow(0);
                        this.hideAdvertise();
                    }
                } else {
                    //normal text
                    //cc.log('hide advertise before');
                    this.hideAdvertise(true);
                    this.showAdvertiseWithText(strText, this.showNextText.bind(this, endShowCb));
                    //auto increase show index
                    this.increaseShowTextIndex();
                }
            } else {
                //cc.error('out of bound');
                Utility.executeCallback(endShowCb);
                this.hideAdvertise();
            }
        } else {
            //cc.error('parent show is not exist or is hidden');
            Utility.executeCallback(endShowCb);
            this.hideAdvertise();
        }
    },

    queueAdvertiseText: function (txt) {
        //cc.log('queueAdvertiseText', txt);
        if (!this.getShowQueueAdvertiseTextCallback()) {
            this.setShowQueueAdvertiseTextCallback(function () {
                if (gv.guiMgr.getGuiById(GuiId.LOBBY)) {
                    //init default value
                    this.setParentShow(gv.guiMgr.getGuiById(GuiId.LOBBY));
                    this.setGuiAdvertisePosition(this.getPositionForLobby());
                }
            }.bind(this));
        }

        var parent = gv.layerMgr.getLayerByIndex(LayerId.LAYER_LOADING);
        this.setParentShow(parent);
        //todo handle position
        if (gv.guiMgr.getGuiById(GuiId.LOBBY)) {
            this.setGuiAdvertisePosition(this.getPositionForLobby());
        } else {
            this.setGuiAdvertisePosition(this.getPositionTopCenter());
        }
        this._listTextQueue.push(txt);

        //delay action for prepare
        this.callFunctionWithDelay(0.5, this.showTextQueueImmediately.bind(this));
    },
    showTextQueueImmediately: function () {
        if (!this.isShowingAdvertise) {
            this.showNextText(function () {
                this.hideAdvertise();
                if (this.isListTextAvailable()) {
                    this.showTextQueueImmediately();
                }
            }.bind(this));
        } else if (!this.isListTextAvailable()) {
            this.hideAdvertise();
        }
    },
    getListAdvertiseTextQueue: function () {
        return this._listTextQueue;
    },
    clearQueueAdvertiseText: function () {
        //cc.log('clearQueueAdvertiseText');
        this._listTextQueue = [];
    },
    setShowQueueAdvertiseTextCallback: function (callback) {
        this._showQueueAdvertiseTextCallback = callback;
    },
    getShowQueueAdvertiseTextCallback: function () {
        return this._showQueueAdvertiseTextCallback;
    },
    callFunctionWithDelay: function (delay, funcObj) {
        try{
            setTimeout(funcObj, delay * 1000);
        }catch(ex){
            GameUtil.callFunctionWithDelay(delay, funcObj);
        }
    }
});

NotificationTextRun.getInstance = function () {
    if (!this._instance) {
        this._instance = new NotificationTextRun();
    }
    return this._instance;
};

