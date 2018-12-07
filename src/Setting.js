'use strict';
/**
 * Setting value is maybe can change
 * */
var Setting = {};
// ====================================================================================================
//TIME
Setting.TIME_UPDATE_INTERVAL = 0.1;//second
Setting.TIME_LOOP_RENDER = 0.02;//second
Setting.LOOPS_SUDDEN_DEATH = 60; //count the loops in 2 minutes (2*60*1000)
Setting.LOOPS_MATCH_END = 150; //count the loops in 2m30s
// ====================================================================================================
// Map data 22x22, each block have the enum BLOCK_ in Enum.js
Setting.GAME_OBJECT_SIZE = 8;//number tile logic
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
//BASE
Setting.BASE_MAIN_HP = 300;
Setting.BASE_SIDE_HP = 200;
Setting.BASE_SIZE = 2;
// Other stuff
Setting.OBSTACLE_HP = 100;
// NUMBER
Setting.NUMBER_OF_TANK = 4;
//TANK HP
Setting.TANK_HEAVY_HP = 150;
Setting.TANK_MEDIUM_HP = 100;
Setting.TANK_LIGHT_HP = 80;
//TANK SPEED
// Move per loop
Setting.TANK_LIGHT_SPEED = Math.round(0.5 * Setting.GAME_OBJECT_SIZE);
Setting.TANK_MEDIUM_SPEED = Math.round(0.25 * Setting.GAME_OBJECT_SIZE);
Setting.TANK_HEAVY_SPEED = Math.round(0.2 * Setting.GAME_OBJECT_SIZE);
//DAMAGE
// Damage per shot
Setting.BULLET_TANK_HEAVY_DAMAGE = 8;
Setting.BULLET_TANK_MEDIUM_DAMAGE = 30;
Setting.BULLET_TANK_LIGHT_DAMAGE = 40;
//rateOfFire ROF Cooldown DPS(Damage per second)
// lower is better: number of loop for a tank to be able to shoot again
Setting.TANK_LIGHT_ROF = 20 / Setting.TIME_UPDATE_INTERVAL;    // DPS  = Dam * 10 / Cooldown   = 40 * 10 / 20    = 20;
Setting.TANK_MEDIUM_ROF = 10 / Setting.TIME_UPDATE_INTERVAL;   // DPS  = Dam * 10 / Cooldown   = 30 * 10 / 10    = 30;
Setting.TANK_HEAVY_ROF = 2 / Setting.TIME_UPDATE_INTERVAL;     // DPS  = Dam * 10 / Cooldown   = 8 * 10 / 2      = 40;
//BULLET SPEED
Setting.BULLET_TANK_HEAVY_SPEED = Math.round(0.8 * Setting.GAME_OBJECT_SIZE);
Setting.BULLET_TANK_MEDIUM_SPEED = Math.round(0.9 * Setting.GAME_OBJECT_SIZE);
Setting.BULLET_TANK_LIGHT_SPEED = Setting.GAME_OBJECT_SIZE;
//POWER UP
Setting.POWERUP_INTERVAL = 30 / Setting.TIME_UPDATE_INTERVAL;
Setting.POWERUP_DELAY = 10 / Setting.TIME_UPDATE_INTERVAL;
//AIR STRIKE
Setting.AIRSTRIKE_COUNTDOWN = 10 / Setting.TIME_UPDATE_INTERVAL;
Setting.AIRSTRIKE_DAMAGE = 60;
Setting.AIRSTRIKE_AOE = 3;
Setting.EMP_DURATION = 40 / Setting.TIME_UPDATE_INTERVAL;
Setting.EMP_AOE = 3;