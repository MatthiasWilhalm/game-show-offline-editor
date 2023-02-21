/**
 * 
 * @param {String} title 
 * @param {String} description 
 * @param {String} type 
 * @param {Boolean} useTeams 
 * @param {Object} content 
 */
export function Game(title, description, type, useTeams, content) {
    this.title = title;
    this.description = description;
    this.type = type;
    this.useTeams = useTeams;
    this.content = content;
    this.playerProgress = new Map();
    this.teams = [];
}

/**
 * 
 * @param {Number} score 
 * @param {Number} team 
 * @param {Number} special 
 */
export function PlayerProgress(score, team, special) {
    this.score = score;
    this.team = team;
    this.special = special;
}