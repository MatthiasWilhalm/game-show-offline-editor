import { getPlayerId } from "../../tools/tools";
import QuestionComponent from "../QuestionComponent";
import TeamCreateWindow from "../TeamCreateWindow";
import BingoBoard from "./BingoBoard";

const GameBingoPlayer = props => {

    
    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);


    const updateStatus = s => {
        props.send('seteventstatus', s || props.eventStatus);
    }

    const showTeamScreen = () => {
        return !gameState.teamsCreated;
    }

    const getPlayersTeam = () => {
        return gameState?.playerProgress[getPlayerId()]?.team ?? -1;
    }

    const getPlayerlist = () => {
        let pl = JSON.parse(JSON.stringify(props.eventPlayerList?.filter(a => a.playerState === props.PlayerStates.PLAYER)));
        pl.map(a => {
            a.team = gameState?.playerProgress?.[a.playerId]?.team;
            return a;
        });
        return pl;
    }

    const isInRound = () => {
        return !!gameState.roundStatus.find(a => a.current);
    }

    const getCurrentQuestion = () => {
        let g = gameState.roundStatus.find(a => a.current);
        if(g) {
            return game.content.questions[g.roundId]?.question || null;
        }
        return null;
    }

    const isAskedPlayer = () => {
        let g = gameState.roundStatus.find(a => a.current);
        return g && g.currentTeam === getPlayersTeam();
    }

    const setSelection = value => {
        let ng = gameState.roundStatus.find(a => a.current);
        if(ng) {
            ng.teamsAnswer = value;
            console.log(ng.teamsAnswer);
            updateStatus();
        }
    }

    const getQuestionSelection = () => {
        return gameState.roundStatus.find(a => a.current)?.teamsAnswer ?? -1;
    }

    const renderSelect = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="game-title">
                    <h1>
                        {game?.title}
                    </h1>
                </div>
                <div></div>
                <BingoBoard isMod={false} game={game} gameState={gameState}></BingoBoard>
            </div>
        );
    }

    const renderRound = () => {
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
                        asking={isAskedPlayer()}
                        callback={isAskedPlayer()?setSelection:null}
                        selection={getQuestionSelection()}
                    />
                </div>
            </div>
        );
    }

    return (
        <div>
            {showTeamScreen()?
                <TeamCreateWindow 
                    eventPlayerList={getPlayerlist()}
                    isMod={false}
                    callback={() => null}
                />
            :
                ''
            }
            {isInRound()?
                renderRound()
            :
                renderSelect()
            }
        </div>
    );
}

export default GameBingoPlayer