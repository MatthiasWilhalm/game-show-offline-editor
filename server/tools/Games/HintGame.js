class HintGame {
    constructor(skipAfterOneTry, rounds) {
        this.skipAfterOneTry = skipAfterOneTry;
        this.rounds = rounds;
    }
}

class HintGameRounds {
    constructor(hints, answer) {
        this.hints = hints;
        this.answer = answer;
    }
}

class HintGameHint {
    constructor(hintId, text, url, urlType) {
        this.hintId = hintId;
        this.text = text;
        this.url = url;
        this.urlType = urlType;
        this.visible = false;
    }
}

class HintGameRoundStatus {
    constructor(isCurrent) {
        this.isCurrent = !!isCurrent;
        this.winner = null;
        this.HintGameHintStatus = []; // Array<Boolean>
    }
}

module.exports.HintGame = (skipAfterOneTry, rounds) => {
    return new HintGame(skipAfterOneTry, rounds);
}

module.exports.HintGameRounds = (hints, answer) => {
    return new HintGameRounds(hints, answer);
}

module.exports.HintGameHint = (text, url, urlType) => {
    return new HintGameHint(text, url, urlType);
}

module.exports.HintGameRoundStatus = () => {
    return new HintGameRoundStatus();
}