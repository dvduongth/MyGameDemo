"use strict";
/**
 * GameConstance value is can not change
 * */
// game state
var STATE_WAITING_FOR_PLAYERS = 0;
var STATE_TANK_PLACEMENT = 1;
var STATE_ACTION = 2;
var STATE_SUDDEN_DEATH = 3;
var STATE_FINISHED = 4;
// network
var PACKET_PROCESS_INTERVAL = 100;
// ========================================================
// Maps
var MAP_WATER_FRAME_NUMBER = 30;
var MAP_WATER_FRAME_DURATION = 60;
// Type
var BLOCK_GROUND = 0;
var BLOCK_WATER = 1;
var BLOCK_HARD_OBSTACLE = 2;
var BLOCK_SOFT_OBSTACLE = 3;
// ========================================================
// Tank
var TEAM_1 = 1;
var TEAM_2 = 2;
// Type
var TANK_LIGHT = 1;
var TANK_MEDIUM = 2;
var TANK_HEAVY = 3;
// Direction
var DIRECTION_UP = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_DOWN = 3;
var DIRECTION_LEFT = 4;
var DIRECTION_IDLE = 5;
// ========================================================
// Base
var BASE_MAIN = 1;
var BASE_SIDE = 2;
// ========================================================
// Power Up
var POWERUP_AIRSTRIKE = 1;
var POWERUP_EMP = 2;
// ========================================================
// Explosion
var EXPLOSION_TANK = 1;
var EXPLOSION_CANNON = 2;
var EXPLOSION_OBSTACLE = 3;
var EXPLOSION_EMP = 4;
var EXPLOSION_BULLET = 5;
var EXPLOSION_BULLET_6 = 6;
var EXPLOSION_CANNON_MUZZLE = 7;
var EXPLOSION_GUN_MUZZLE = 8;

// ========================================================
// Sound music
var SOUND_AIRSTRIKE = 1;
var SOUND_EMP = 2;
var SOUND_BULLETIMPACT = 3;
var SOUND_CANNONSHOT = 4;
var SOUND_GUNSHOT = 5;
var SOUND_EXPLOSION_1 = 6;
var SOUND_EXPLOSION_2 = 7;
var SOUND_EXPLOSION_3 = 8;
var SOUND_EXPLOSION_4 = 9;
// ========================================================
// ========================================================
// Match result
var MATCH_RESULT_NOT_FINISH = 0;
var MATCH_RESULT_TEAM_1_WIN = 1;
var MATCH_RESULT_TEAM_2_WIN = 2;
var MATCH_RESULT_DRAW = 3;
var MATCH_RESULT_BAD_DRAW = 4;
// ========================================================
// String
var STRING_OBSTACLE = "0";
var STRING_BASE = "1";
var STRING_TANK = "2";
var STRING_BULLET = "3";
var STRING_POWER_UP = "4";
var STRING_STRIKE = "5";
// ========================================================
// Scene Battle ZOrder
var ZORDER_BACK_GROUND = 0;
var ZORDER_MID_GROUND = 1;
var ZORDER_GROUND = 2;
var ZORDER_FORCE_GROUND = 3;
var ZORDER_SKY = 4;
// ========================================================
var NUMBER_STYLE = {
    style1: 1,
    style2: 2,
    style3: 3,
    style4: 4
};