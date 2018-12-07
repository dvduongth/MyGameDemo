'use strict';
/**
 * Setting value is maybe can change
 * */
var Setting = {};
// ====================================================================================================
// Other stuff
Setting.NUMBER_OF_TANK = 4;
Setting.TANK_HEAVY_HP = 150;
Setting.TANK_MEDIUM_HP = 100;
Setting.TANK_LIGHT_HP = 50;
Setting.BASE_MAIN_HP = 300;
Setting.BASE_SIDE_HP = 200;
Setting.OBSTACLE_HP = 100;
Setting.MAX_SPEED = 3;
Setting.MAX_DELAY_SPAWN_BULLET = 1.5;
Setting.BULLET_SPEED = 4;
Setting.AIRSTRIKE_COUNTDOWN = 10;
Setting.BULLET_TANK_HEAVY_DAMAGE = 2;
Setting.BULLET_TANK_MEDIUM_DAMAGE = 12;
Setting.BULLET_TANK_LIGHT_DAMAGE = 20;
// ====================================================================================================
Setting.TIME_LOOP = 0.033;
Setting.TIME_LOOP_FRAME_RATE = 0.02;
Setting.TIME_LOOP_RENDER = 1/12;
Setting.SUDDEN_DEATH_DURATION = 30;//second
Setting.BATTLE_DURATION = 90;//second
// Map data 22x22, each block have the enum BLOCK_ in Enum.js
Setting.GAME_OBJECT_SIZE_W = 5;
Setting.GAME_OBJECT_SIZE_H = 5;
Setting.MAP_WATER_ALPHA = 0.3;
Setting.MAP_LIMIT_ROW_THROW_TANK = 6;
Setting.MAP_OFFSET_X = -100; // Reserved for screenshake
Setting.MAP_OFFSET_Y = -100; // Reserved for screenshake
Setting.MAP_W = 22;
Setting.MAP_H = 22;
Setting.MAP = [
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 4, 4, 3, 3, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 2, 2, 0, 0, 0, 3, 3, 4, 4, 3, 3, 0, 0, 0, 2, 2, 2, 0, 2],
    [2, 0, 2, 4, 4, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 4, 4, 2, 0, 2],
    [2, 0, 2, 4, 4, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 4, 4, 2, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 2],
    [2, 0, 3, 3, 3, 3, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 3, 3, 3, 3, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 2],
    [2, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 3, 3, 3, 3, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 3, 3, 3, 3, 0, 2],
    [2, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 0, 2, 4, 4, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 4, 4, 2, 0, 2],
    [2, 0, 2, 4, 4, 0, 0, 0, 3, 3, 3, 3, 3, 3, 0, 0, 0, 4, 4, 2, 0, 2],
    [2, 0, 2, 2, 2, 0, 0, 0, 3, 3, 4, 4, 3, 3, 0, 0, 0, 2, 2, 2, 0, 2],
    [2, 0, 0, 0, 0, 0, 0, 0, 3, 3, 4, 4, 3, 3, 0, 0, 0, 0, 0, 0, 0, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
];
// ====================================================================================================
