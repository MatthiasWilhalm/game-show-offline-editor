import { Game } from "./Game";

/**
 * 
 * @param {String} title 
 * @param {Array<Game>} games 
 */
export function Event(title, games) {
    this.title = title;
    this.games = games;
    this.globalScores = new Map();
}