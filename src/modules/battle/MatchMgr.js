"use strict";
/**
 * MatchMgr manage game logic
 * */
var MatchMgr = cc.Class.extend({
    _className: "MatchMgr",
    getClassName: function () {
        return this._className;
    },
    ctor: function () {
        this.setPauseGame(false);
        LogUtils.getInstance().log([this.getClassName(), "create success"]);
        return true;
    },
    setPauseGame: function (eff) {
        this._isPauseGame = eff;
    },
    isPauseGame: function () {
        return this._isPauseGame;
    },
    checkLogicWinKnockoutKillAllTank: function (id, team) {
        if (gv.engine.getBattleMgr().getPlayerMgr().isKnockoutKillAllTank(id)) {
            var teamWin = team == TEAM_1 ? TEAM_2 : TEAM_1;
            gv.engine.getBattleMgr().getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.setPauseGame(true);
            gv.engine.getBattleMgr().showWinGame();
        }
        gv.engine.getBattleMgr().getPlayerMgr().removeTankID(id);
    },
    checkLogicWinKnockoutKillMainBase: function (id, team) {
        if (gv.engine.getBattleMgr().getPlayerMgr().isKnockoutKillMainBase(id)) {
            var teamWin = team == TEAM_1 ? TEAM_2 : TEAM_1;
            gv.engine.getBattleMgr().getPlayerMgr().setTeamWin(teamWin);
            //todo show win
            this.setPauseGame(true);
            gv.engine.getBattleMgr().showWinGame();
        }
        gv.engine.getBattleMgr().getPlayerMgr().removeBaseID(id);
    },

    checkLogicCollisionTankWithBarrier: function (id) {
        var m = gv.engine.getBattleMgr().getBattleFactory().getMAPSprites();
        var curSpr = m[id];
        var sprObj, _id;
        for (var i in m) {
            _id = i + "";
            sprObj = m[_id];
            if (sprObj != null && _id != id) {
                //check collision with obstacle
                if (_id.indexOf(STRING_OBSTACLE) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with obstacle"]);
                        return true;
                    }
                }
                //check collision with base
                if (_id.indexOf(STRING_BASE) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with base"]);
                        return true;
                    }
                }
                //other tank
                if (_id.indexOf(STRING_TANK) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        //LogUtils.getInstance().log([this.getClassName(), "tank collision with other tank"]);
                        return true;
                    }
                }
            }
        }
        return false;
    },
    checkLogicCollisionBulletWithTarget: function (id) {
        return false;//todo test edit after
        var m = gv.engine.getBattleMgr().getBattleFactory().getMAPSprites();
        var curSpr = m[id];
        var tankGunID = curSpr.getTankGunID();
        var sprObj, _id;
        var isCollision = false;
        for (var i in m) {
            _id = i + "";
            sprObj = m[_id];
            if (sprObj != null && _id != id && _id != tankGunID) {
                //check collision with obstacle
                if (_id.indexOf(STRING_OBSTACLE) != -1 && sprObj.isBarrier()) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
                //check collision with base
                if (_id.indexOf(STRING_BASE) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
                //other tank
                if (_id.indexOf(STRING_TANK) != -1) {
                    if (Utility.getInstance().isCollisionOverLapObjectNode(sprObj, curSpr)) {
                        sprObj.hitBullet(curSpr.getDamageValue());
                        isCollision = true;
                    }
                }
            }
        }
        return isCollision;
    },
    getGameObjectInfoByWorldPosition: function (worldPos, skipObjectID) {
        var m = gv.engine.getBattleMgr().getBattleFactory().getMAPSprites();
        var target, _id;
        for (var i in m) {
            _id = i + "";
            target = m[_id];
            if (target != null && target.getID() != skipObjectID) {
                var locationInNode = target.convertToNodeSpace(worldPos);
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                var isCorrect = cc.rectContainsPoint(rect, locationInNode);
                if (isCorrect) {
                    return {
                        ID: target.getID(),
                        type: target.getType(),
                        gameObject: target
                    };
                }
            }
        }
        return null;
    },
    findSuitableLocationForThrowTank: function (tank) {
        var parent = tank.getParent();
        var nPos = tank.getPosition();
        var worldPos = parent.convertToWorldSpace(nPos);
        var existedObj = this.getGameObjectInfoByWorldPosition(worldPos, tank.getID());
        var tankSize = tank.getContentSize();
        if (!existedObj) {
            //available
            LogUtils.getInstance().log([this.getClassName(), "findSuitableLocationForThrowTank available"]);
            //check tank collision with barrier and move tank to road
            if (this.checkLogicCollisionTankWithBarrier(tank.getID())) {
                var wCollisionPos, wPos;
                //check collision up
                var upPos = cc.p(nPos.x, nPos.y + tankSize.height / 2);
                var wUpPos = parent.convertToWorldSpace(upPos);
                var objCollisionUp = this.getGameObjectInfoByWorldPosition(wUpPos, tank.getID());
                if (objCollisionUp != null) {
                    //move down
                    wCollisionPos = objCollisionUp.gameObject.getWorldPosition();
                    wPos = cc.p(wCollisionPos.x, wCollisionPos.y - objCollisionUp.gameObject.getContentSize().height / 2 - tankSize.height / 2);
                    nPos = parent.convertToNodeSpace(wPos);
                }
                //check collision left
                var leftPos = cc.p(nPos.x - tankSize.width / 2, nPos.y);
                var wleftPos = parent.convertToWorldSpace(leftPos);
                var objCollisionleft = this.getGameObjectInfoByWorldPosition(wleftPos, tank.getID());
                if (objCollisionleft != null) {
                    //move right
                    wCollisionPos = objCollisionleft.gameObject.getWorldPosition();
                    wPos = cc.p(wCollisionPos.x + objCollisionleft.gameObject.getContentSize().width / 2 + tankSize.width / 2, wCollisionPos.y);
                    nPos = parent.convertToNodeSpace(wPos);
                }
                //check collision right
                var rightPos = cc.p(nPos.x + tankSize.width / 2, nPos.y);
                var wrightPos = parent.convertToWorldSpace(rightPos);
                var objCollisionright = this.getGameObjectInfoByWorldPosition(wrightPos, tank.getID());
                if (objCollisionright != null) {
                    //move left
                    wCollisionPos = objCollisionright.gameObject.getWorldPosition();
                    wPos = cc.p(wCollisionPos.x - objCollisionright.gameObject.getContentSize().width / 2 - tankSize.width / 2, wCollisionPos.y);
                    nPos = parent.convertToNodeSpace(wPos);
                }
                //todo check conner top
                // top left
                var topLeftPos = cc.p(nPos.x - tankSize.width / 2, nPos.y + tankSize.height / 2);
                var wtopLeftPos = parent.convertToWorldSpace(topLeftPos);
                var objCollisiontopLeft = this.getGameObjectInfoByWorldPosition(wtopLeftPos, tank.getID());
                if (objCollisiontopLeft != null) {
                    //move bottom right
                    wCollisionPos = objCollisiontopLeft.gameObject.getWorldPosition();
                    wPos = cc.p(wCollisionPos.x + objCollisiontopLeft.gameObject.getContentSize().width / 2 + tankSize.width / 2, wCollisionPos.y - objCollisiontopLeft.gameObject.getContentSize().height / 2 - tankSize.height / 2);
                    nPos = parent.convertToNodeSpace(wPos);
                }
                // top right
                var topRightPos = cc.p(nPos.x + tankSize.width / 2, nPos.y + tankSize.height / 2);
                var wtopRightPos = parent.convertToWorldSpace(topRightPos);
                var objCollisiontopRight = this.getGameObjectInfoByWorldPosition(wtopRightPos, tank.getID());
                if (objCollisiontopRight != null) {
                    //move bottom left
                    wCollisionPos = objCollisiontopRight.gameObject.getWorldPosition();
                    wPos = cc.p(wCollisionPos.x - objCollisiontopRight.gameObject.getContentSize().width / 2 - tankSize.width / 2, wCollisionPos.y - objCollisiontopRight.gameObject.getContentSize().height / 2 - tankSize.height / 2);
                    nPos = parent.convertToNodeSpace(wPos);
                }

                //check collision down
                var downPos = cc.p(nPos.x, nPos.y - tankSize.height / 2);
                var wdownPos = parent.convertToWorldSpace(downPos);
                var objCollisiondown = this.getGameObjectInfoByWorldPosition(wdownPos, tank.getID());
                if (objCollisiondown != null) {
                    //move up
                    wCollisionPos = objCollisiondown.gameObject.getWorldPosition();
                    wPos = cc.p(wCollisionPos.x, wCollisionPos.y + objCollisiondown.gameObject.getContentSize().height / 2 + tankSize.height / 2);
                    nPos = parent.convertToNodeSpace(wPos);
                }

                //todo check conner bottom
                // bottom left
                var bottomLeftPos = cc.p(nPos.x - tankSize.width / 2, nPos.y - tankSize.height / 2);
                var wbottomLeftPos = parent.convertToWorldSpace(bottomLeftPos);
                var objCollisionbottomLeft = this.getGameObjectInfoByWorldPosition(wbottomLeftPos, tank.getID());
                if (objCollisionbottomLeft != null) {
                    //move top right
                    wCollisionPos = objCollisionbottomLeft.gameObject.getWorldPosition();
                    wPos = cc.p(wCollisionPos.x + objCollisionbottomLeft.gameObject.getContentSize().width / 2 + tankSize.width / 2, wCollisionPos.y + objCollisionbottomLeft.gameObject.getContentSize().height / 2 + tankSize.height / 2);
                    nPos = parent.convertToNodeSpace(wPos);
                }
                // bottom right
                var bottomRightPos = cc.p(nPos.x + tankSize.width / 2, nPos.y - tankSize.height / 2);
                var wbottomRightPos = parent.convertToWorldSpace(bottomRightPos);
                var objCollisionbottomRight = this.getGameObjectInfoByWorldPosition(wbottomRightPos, tank.getID());
                if (objCollisionbottomRight != null) {
                    //move top left
                    wCollisionPos = objCollisionbottomRight.gameObject.getWorldPosition();
                    wPos = cc.p(wCollisionPos.x - objCollisionbottomRight.gameObject.getContentSize().width / 2 - tankSize.width / 2, wCollisionPos.y + objCollisionbottomRight.gameObject.getContentSize().height / 2 + tankSize.height / 2);
                    nPos = parent.convertToNodeSpace(wPos);
                }
                //todo return
                return nPos;

            } else {
                return nPos;
            }
        } else {
            worldPos = this.breadthFirstSearch(existedObj.gameObject, tank);
            return parent.convertToNodeSpace(worldPos);
        }
    },
    breadthFirstSearch: function (currentNode, tank) {
        LogUtils.getInstance().log([this.getClassName(), "breadthFirstSearch"]);
        var _this = this;
        var size = tank.getContentSize();
        var MAX = 100;
        var queue = [];
        var result = [];//mang ket qua
        var count = 0;
        var nResult = 4;
        var finish = false;
        var costInfo = {
            up: {cost: 0, found: false},
            down: {cost: 0, found: false},
            left: {cost: 0, found: false},
            right: {cost: 0, found: false}
        };

        function getUp(node) {
            var nPos = node.getPosition();
            var nSize = node.getContentSize();
            var wPos = node.getParent().convertToWorldSpace(cc.p(nPos.x, nPos.y + nSize.height / 2 + size.height / 2));
            var obj = _this.getGameObjectInfoByWorldPosition(wPos, tank.getID());
            return {
                obj: obj,
                wPos: wPos
            };
        }

        function getDown(node) {
            var nPos = node.getPosition();
            var nSize = node.getContentSize();
            var wPos = node.getParent().convertToWorldSpace(cc.p(nPos.x, nPos.y - nSize.height / 2 - size.height / 2));
            var obj = _this.getGameObjectInfoByWorldPosition(wPos, tank.getID());
            return {
                obj: obj,
                wPos: wPos
            };
        }

        function getLeft(node) {
            var nPos = node.getPosition();
            var nSize = node.getContentSize();
            var wPos = node.getParent().convertToWorldSpace(cc.p(nPos.x - nSize.width / 2 - size.width / 2, nPos.y));
            var obj = _this.getGameObjectInfoByWorldPosition(wPos, tank.getID());
            return {
                obj: obj,
                wPos: wPos
            };
        }

        function getRight(node) {
            var nPos = node.getPosition();
            var nSize = node.getContentSize();
            var wPos = node.getParent().convertToWorldSpace(cc.p(nPos.x + nSize.width / 2 + size.width / 2, nPos.y));
            var obj = _this.getGameObjectInfoByWorldPosition(wPos, tank.getID());
            return {
                obj: obj,
                wPos: wPos
            };
        }

        function BFSAlgorithm(current) {
            //up
            var up;
            if (!costInfo.up.found) {
                up = getUp(current);
                if (up.obj == null) {
                    costInfo.up.found = true;
                    result.push({
                        cost: costInfo.up.cost,
                        wPos: up.wPos
                    });
                } else {
                    costInfo.up.cost++;
                    count++;
                    queue.push(up.obj.gameObject);
                }
            }
            //down
            var down;
            if (!costInfo.down.found) {
                down = getDown(current);
                if (down.obj == null) {
                    costInfo.down.found = true;
                    result.push({
                        cost: costInfo.down.cost,
                        wPos: down.wPos
                    });
                } else {
                    costInfo.down.cost++;
                    count++;
                    queue.push(down.obj.gameObject);
                }
            }
            //left
            var left;
            if (!costInfo.left.found) {
                left = getLeft(current);
                if (left.obj == null) {
                    costInfo.left.found = true;
                    result.push({
                        cost: costInfo.left.cost,
                        wPos: left.wPos
                    });
                } else {
                    costInfo.left.cost++;
                    count++;
                    queue.push(left.obj.gameObject);
                }
            }
            //right
            var right;
            if (!costInfo.right.found) {
                right = getRight(current);
                if (right.obj == null) {
                    costInfo.right.found = true;
                    result.push({
                        cost: costInfo.right.cost,
                        wPos: right.wPos
                    });
                } else {
                    costInfo.right.cost++;
                    count++;
                    queue.push(right.obj.gameObject);
                }
            }
        }
        //start
        BFSAlgorithm(currentNode);
        while (!finish && queue.length > 0) {
            var curNode = queue.shift();
            BFSAlgorithm(curNode);
            finish = (result.length >= nResult) || (count >= MAX);
        }
        var worldPos = cc.POINT_ZERO;
        var cost = MAX;
        result.forEach(function (r) {
            if (r.cost < cost) {
                cost = r.cost;
                worldPos = r.wPos;
            }
        });
        return worldPos;
    },
});