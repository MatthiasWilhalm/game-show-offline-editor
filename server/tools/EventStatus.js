/**
 * @param{String} modId
 */
class EventStatus {
    constructor(modId) {
        this.modId = modId;
        this.joinable = true;
        this.finished = false;
        this.globalScores = {};
        this.gameStatus = []; // GameStatus
    }
    
    convertToObject() {
        function mapToObject(map) {
            let ret = {};
            if(map instanceof Map) {
              map.forEach((a, k) => {
                ret[k] = a;
              });
            }
            return ret;
        }

        let gs = mapToObject(this.globalScores);
        let status = {};
        this.gameStatus.forEach((a, key) => {
            status[key] = a;
            status[key].playerProgress = mapToObject(a.playerProgress);
        });
        return {modId: this.modId, globalScores: gs, gameStatus: status};
    }

}

/**
 * @param{Array<String>} teams
 */
class GameStatus {
    constructor(teams) {
        this.selected = false;
        this.current = false;
        this.done = false;
        this.teams = teams || [];
        this.playerProgress = {}; // playerId, PlayerProgress
        this.roundStatus = [];
    }
}

/**
 * 
 * @param {Number} score 
 * @param {Number} team 
 * @param {Number} special 
 */
 class PlayerProgress {
    constructor(score, team, special) {
        this.score = score;
        this.team = team;
        this.special = special;
    }
}

module.exports.EventStatus = (modId) => {
    return new EventStatus(modId);
}

module.exports.GameStatus = (teams) => {
    return new GameStatus(teams);
}

module.exports.PlayerProgress = (score, team, special) => {
    return new PlayerProgress(score, team, special);
}