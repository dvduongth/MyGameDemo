'use strict';

var Setting = {};
// ====================================================================================================
// Other stuff
Setting.NUMBER_OF_TANK = 4;
Setting.BASE_MAIN_HP = 300;
Setting.BASE_SIDE_HP = 200;
Setting.OBSTACLE_HP = 100;
Setting.MAX_SPEED = 6;
Setting.MAX_DELAY_SPAWN_BULLET = 1;
Setting.BULLET_SPEED = 8;
Setting.AIRSTRIKE_COUNTDOWN = 10;
// ====================================================================================================
// Map data 22x22, each block have the enum BLOCK_ in Enum.js
Setting.MAP_W = 22;
Setting.MAP_H = 22;
Setting.MAP = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 2, 2, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 2, 2, 2, 0, 2],
    [2, 0, 2, 4, 4, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 4, 4, 2, 0, 2],
    [2, 0, 2, 4, 4, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 4, 4, 2, 0, 2],
    [2, 0, 0, 0, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2],
    [2, 3, 3, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 3, 3, 2],
    [2, 4, 4, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 4, 4, 2],
    [2, 4, 4, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 4, 4, 2],
    [2, 3, 3, 3, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 3, 3, 2],
    [2, 0, 0, 0, 0, 0, 0, 2, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 4, 4, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 4, 4, 2, 0, 2],
    [2, 0, 2, 4, 4, 0, 3, 3, 0, 0, 1, 1, 0, 0, 3, 3, 0, 4, 4, 2, 0, 2],
    [2, 0, 2, 2, 2, 0, 3, 3, 0, 0, 0, 0, 0, 0, 3, 3, 0, 2, 2, 2, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];
// ====================================================================================================
