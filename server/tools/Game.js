/**
 * 
 * @param {String} title 
 * @param {String} description 
 * @param {String} type 
 * @param {Boolean} useTeams 
 * @param {Object} content 
 */
class Game {
    constructor(title, description, type, useTeams, content) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.useTeams = useTeams;
        this.content = content;
    }
}

module.exports.Game = (title, description, type, useTeams, content) => {
    return new Game(title, description, type, useTeams, content);
}

// content queuegame: 
/*
* 
*
*/