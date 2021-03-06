var Enum = require("./../Config/Enum");
var Setting = require("./../Config/Setting");
var Network = require("./../Network");

module.exports = function PowerUp (game, id) {
	var instance = this;
	// Position
	this.m_id = id;
	this.m_x = 0;
	this.m_y = 0;
	this.m_type = 0;
	this.m_active = 0;
    
	// Need to update or not
	this.m_dirty = false;
	
	var spawnPoint = Setting.POWERUP_SPAWN_POINT;
	var spawnType = [Enum.POWERUP_AIRSTRIKE, Enum.POWERUP_EMP];
	
	this.Spawn = function () {
		// Get available spawning point
		var availableSpawnPoint = [];
		for (var i=0; i<spawnPoint.length; i++) {
			var takeThisPoint = true;
			for (var j=0; j<game.m_powerUps.length; j++) {
				if (game.m_powerUps[j].m_x == spawnPoint[i][0] && game.m_powerUps[j].m_y == spawnPoint[i][1]) {
					takeThisPoint = false;
					break;
				}
			}
			
			if (takeThisPoint) {
				availableSpawnPoint.push (spawnPoint[i]);
			}
		}
		
		// If there are free slots, random from those slots
		if (availableSpawnPoint.length > 0) {
			var slot = (Math.random() * availableSpawnPoint.length) >> 0;
			instance.m_x = availableSpawnPoint[slot][0];
			instance.m_y = availableSpawnPoint[slot][1];
			
			// Get a random type
			instance.m_type = spawnType[(Math.random() * spawnType.length) >> 0];
			
			// Mark to announce its appearance
			instance.m_active = 1;
			instance.m_dirty = true;
		}
	};
    
    this.CheckForCollision = function () {
        // Check collision with any tanks.
        for (var i=0; i < game.m_tanks[Enum.TEAM_1].length; i++) {
            var tempTank = game.m_tanks[Enum.TEAM_1][i]; 
			if (tempTank == null || tempTank.m_HP == 0) continue;
            if (Math.abs(instance.m_x - tempTank.m_x) < 1 && Math.abs(instance.m_y - tempTank.m_y) < 1) {
				instance.m_active = 0;
				instance.m_dirty = true;
				instance.m_x = -1;
				instance.m_y = -1;
				
				game.AcquirePowerup (Enum.TEAM_1, instance.m_type);
                
                return;
            }
        }
		
        for (var i=0; i < game.m_tanks[Enum.TEAM_2].length; i++) {
            var tempTank = game.m_tanks[Enum.TEAM_2][i]; 
			if (tempTank == null || tempTank.m_HP == 0) continue;
            if (Math.abs(instance.m_x - tempTank.m_x) < 1 && Math.abs(instance.m_y - tempTank.m_y) < 1) {
				instance.m_active = 0;
				instance.m_dirty = true;
				instance.m_x = -1;
				instance.m_y = -1;
                
				game.AcquirePowerup (Enum.TEAM_2, instance.m_type);
				
                return;
            }
        }		
    };
	
	this.Update = function() {
		if (instance.m_active == 1) {
			instance.CheckForCollision();
		}
	};
    
	this.ToPacket = function(forceUpdate) {
		var packet = "";
		if (instance.m_dirty || forceUpdate) {
			packet += Network.EncodeUInt8(Enum.COMMAND_UPDATE_POWERUP);
			packet += Network.EncodeUInt8(instance.m_id);
            packet += Network.EncodeUInt8(instance.m_active);
			packet += Network.EncodeUInt8(instance.m_type);
			packet += Network.EncodeFloat32(instance.m_x);
			packet += Network.EncodeFloat32(instance.m_y);

			instance.m_dirty = false;
		}
		
		return packet;
	};
};
