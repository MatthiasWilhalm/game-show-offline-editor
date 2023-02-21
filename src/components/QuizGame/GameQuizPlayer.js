import { getPlayerId, getPlayerState } from "../../tools/tools";
import QuestionComponent from "../QuestionComponent";
import Scoreboard from "../Scoreboard";

const GameQuizPlayer = props => {
    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const updateStatus = () => {
        props.send('seteventstatus', props.eventStatus);
    }

    const isInRound = () => {
        return !!gameState.roundStatus.find(a => a.current);
    }

    const getCurrentQuestion = () => {
        let g = gameState.roundStatus.find(a => a.current);
        if(g) {
            return game.content.questions[g.roundId] || null;
        }
        return null;
    }

    const isAskedPlayer = () => {
        let g = gameState.roundStatus.find(a => a.current);
        return g && g.currentPlayerId === getPlayerId();
    }

    const isSpec = () => {
        return getPlayerState() === props.PlayerStates?.SPECTATOR;
    }

    const getAskedPlayer = () => {
        let g = gameState.roundStatus.find(a => a.current);
        if(g) {
            return props.eventPlayerList.find(a => a.playerId === g.currentPlayerId) || null;
        }
        return null;
    }

    const getPlayerGameState = playerId => {
        return gameState.playerProgress?.[playerId];
    }

    
    const getAvaiableJoker = playerId => {
        const playerState = getPlayerGameState(playerId);
        if(!playerState) return;
        return playerState.special.joker;
    }

    const setSelection = value => {
        let ng = gameState.playerProgress[getPlayerId()];
        if(ng) {
            ng.selection = value;
            console.log(ng.selection);
            updateStatus();
        }
    }

    const getQuestionSelection = () => {
        return gameState.playerProgress?.[gameState.roundStatus?.find(a => a.current)?.currentPlayerId]?.selection;
    }

    const getEstimateValue = () => {
        return gameState?.playerProgress?.[getPlayerId()]?.selection ?? -1;
    }

    const renderWaitingScreen = () => {
        return (
            <div className="lobby-grid">
                <div className="game-title">
                    <h1>
                        {game?.title}
                    </h1>
                </div>
                <div className="scoreboard-embedded">
                    <Scoreboard {...props}></Scoreboard>
                </div>
            </div>
        );
    }

    const renderQuestionScreen = () => {
        return (
            <div className="lobby-grid">
                <div className="game-title">
                    <h1>
                        {game?.title}
                    </h1>
                </div>
                <div className="question-container">
                    <QuestionComponent 
                        question={getCurrentQuestion()}
                        joker={getAvaiableJoker(getAskedPlayer()?.playerId)}
                        asking={isAskedPlayer()}
                        callback={isAskedPlayer()?setSelection:null}
                        selection={getQuestionSelection()}
                    />
                    {(!isAskedPlayer() && !isSpec())?
                        <div className="true-false-buttons">
                            <button className={getEstimateValue()===1?"selected":"right"} onClick={() => setSelection(1)}>true</button>
                            <button className={getEstimateValue()===0?"selecetd":"wrong"} onClick={() => setSelection(0)}>false</button>
                        </div>
                    :''}
                </div>                
            </div>
        );
    }

    return (
        <div>
            {isInRound()?
                renderQuestionScreen()
            :
                renderWaitingScreen()
            }
        </div>
    );
}

export default GameQuizPlayer