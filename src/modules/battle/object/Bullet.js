"use strict";
var Bullet = cc.Sprite.extend({
    ctor: function (game, id, team) {
        // Identifier
        this.m_id = id;
        this.m_team = team;
        //super
        this._super();
        this.initBullet();
    },
    initBullet: function () {
        this.m_data = [];

        // Current state
        this.m_type = 0;
        this.m_x = -1;
        this.m_y = -1;
        this.m_direction = 0;
        this.m_live = false;
        this.m_hit = false;
    },

    // An array to contain state in the past
    DataAnchor: function () {
        var _t = {};
        _t.m_time = 0;
        _t.m_type = 0;
        _t.m_x = 0;
        _t.m_y = 0;
        _t.m_direction = 0;
        _t.m_live = false;
        _t.m_hit = false;
        return _t;
    },

    // Add a state in a specific time
    AddDataAnchor: function (time, type, x, y, dir, live, hit) {
        var tempAnchor = this.DataAnchor();
        tempAnchor.m_time = time;
        tempAnchor.m_type = type;
        tempAnchor.m_x = x;
        tempAnchor.m_y = y;
        tempAnchor.m_direction = dir;
        tempAnchor.m_live = live;
        tempAnchor.m_hit = hit;


        if (tempAnchor.m_hit) {
            /*if (tempAnchor.m_type == TANK_HEAVY) {
             game.SpawnExplosion (time, EXPLOSION_BULLET, tempAnchor.m_x, tempAnchor.m_y);
             }
             else {
             game.SpawnExplosion (time, EXPLOSION_CANNON, tempAnchor.m_x, tempAnchor.m_y);
             }*/
        }

        this.m_data.push(tempAnchor);
    },

    // Clone a new state, at a new time, but with old data like previous state
    // This process to make a contiuous timeline. You can think of it as a fake update
    // We won't do it if was updated by a real packet.
    AddIdleDataAnchor: function (time) {
        var previousAnchor = this.m_data[this.m_data.length - 1];

        if (previousAnchor) {
            var tempAnchor = this.DataAnchor();
            tempAnchor.m_time = time;
            tempAnchor.m_type = previousAnchor.m_type;
            tempAnchor.m_x = previousAnchor.m_x;
            tempAnchor.m_y = previousAnchor.m_y;
            tempAnchor.m_direction = previousAnchor.m_direction;
            tempAnchor.m_live = previousAnchor.m_live;
            this.m_data.push(tempAnchor);
        }
    },

    // Update function, called with a specific moment in the timeline
    // We gonna interpolate all state, based on the data anchors.
    Update: function (time) {
        var prevAnchor = null;
        var nextAnchor = null;

        for (var i = 0; i < this.m_data.length - 1; i++) {
            if (time >= this.m_data[i].m_time && time < this.m_data[i + 1].m_time) {
                prevAnchor = this.m_data[i];
                nextAnchor = this.m_data[i + 1];
                break;
            }
        }

        if (prevAnchor && nextAnchor) {
            if (prevAnchor.m_live == false) {
                this.m_x = nextAnchor.m_x;
                this.m_y = nextAnchor.m_y;
            }
            else {
                var interpolateFactor = (time - prevAnchor.m_time) / (nextAnchor.m_time - prevAnchor.m_time);
                this.m_x = prevAnchor.m_x + (nextAnchor.m_x - prevAnchor.m_x) * interpolateFactor;
                this.m_y = prevAnchor.m_y + (nextAnchor.m_y - prevAnchor.m_y) * interpolateFactor;
            }
            this.m_type = prevAnchor.m_type;
            this.m_direction = prevAnchor.m_direction;
            this.m_live = prevAnchor.m_live;
        }
        else {
            this.m_live = false;
        }
    },

    // Draw - obvious comment is obvious
    Draw: function () {
        if (this.m_live) {
            var angle = 0;
            if (this.m_direction == DIRECTION_UP) {
                angle = 0;
            }
            else if (this.m_direction == DIRECTION_RIGHT) {
                angle = 90;
            }
            else if (this.m_direction == DIRECTION_DOWN) {
                angle = 180;
            }
            else if (this.m_direction == DIRECTION_LEFT) {
                angle = 270;
            }
            /*g_graphicEngine.SetDrawModeAddActive (g_context, true);
             g_graphicEngine.Draw (g_context, imgBullet[this.m_type], 0, 0, BLOCK_SIZE, BLOCK_SIZE, this.m_x * BLOCK_SIZE + g_gsActionPhase.m_screenShakeX, this.m_y * BLOCK_SIZE + g_gsActionPhase.m_screenShakeY, BLOCK_SIZE, BLOCK_SIZE, 1, false, false, angle);
             g_graphicEngine.SetDrawModeAddActive (g_context, false);

             if (this.m_type == TANK_HEAVY) {
             whiteSmoke.Pause();
             }
             else {
             whiteSmoke.Resume();
             whiteSmoke.m_x = (this.m_x + 0.5) * BLOCK_SIZE;
             whiteSmoke.m_y = (this.m_y + 0.5) * BLOCK_SIZE;
             }*/
        }
        /*else {
         whiteSmoke.Pause();
         }*/
    }
});