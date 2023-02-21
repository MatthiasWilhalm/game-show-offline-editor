import { useState } from "react";
import MainButton from "../MainButton";
import QuestionComponent from "../QuestionComponent";
import TeamCreateWindow from "../TeamCreateWindow";
import BingoBoard from "./BingoBoard";

const GameBingoMod = props => {

    const game = props.eventData?.games[props.eventStatus?.gameStatus?.findIndex(g => g.current)];
    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const TeamNames = ["Team A", "Team B"];
    const TeamClasses = ["team-a", "team-b"];

    const [selectedTeam, setSelectedTeam] = useState(-1);
    const [selectedRound, setSelectedRound] = useState(-1);

    const updateStatus = s => {
        props.send('seteventstatus', s || props.eventStatus);
    }

    const showTeamScreen = () => {
        return !gameState.teamsCreated;
    }

    const teamWindowCallback = data => {
        if(data instanceof Array) {
            data.forEach(a => {
                if(gameState?.playerProgress?.[a.playerId]?.team!==undefined) {
                    gameState.playerProgress[a.playerId].team = a.team;
                    // delete a.team;
                }
            });
            updateStatus();
        }
    }

    const teamWindowConfirmCallback = () => {
        props.send('updateteams', getPlayerlist());
        gameState.teamsCreated = true;
        updateStatus();
    }

    const getPlayerlist = () => {
        let pl = JSON.parse(JSON.stringify(props.eventPlayerList?.filter(a => a.playerState === props.PlayerStates.PLAYER)));
        pl.map(a => {
            a.team = gameState?.playerProgress?.[a.playerId]?.team;
            return a;
        });
        return pl;
    }

    const getAvailableTeams = () => {
        let t = [];
        getPlayerlist().forEach(a => a.team!==undefined && a.team !==-1 ? t.push(a.team) : null);
        return [... new Set(t)];
    }

    const startRound = () => {
        if(isReady()) {
            let ngs = gameState.roundStatus;
            let oldRound = ngs?.find(a => a.roundId === selectedRound);
            if(!oldRound) {
                ngs.push({
                    roundId: selectedRound,
                    currentTeam: selectedTeam,
                    current: true,
                    teamsAnswer: null
                });
            } else {
                oldRound.current = true;
            }
            updateStatus();
        }
    }

    const selectTeam = teamId => {
        if(selectedTeam === teamId) {
            setSelectedTeam(-1);
        } else{
            setSelectedTeam(teamId);
        }
    }

    const selectRound = roundIndex => {
        console.log(roundIndex);
        if(roundIndex === selectedRound) {
            setSelectedRound(-1);
        } else {
            setSelectedRound(roundIndex);
        }
    }

    const isReady = () => {
        return selectedRound !== -1 && selectedTeam !== -1;
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

    const getCurrentTeam = () => {
        return gameState.roundStatus?.find(a => a.current)?.currentTeam ?? -1;
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

    const triggerCloseRound = () => {
        // let s = props.eventStatus.globalScores[getAskedPlayer().playerId];
        // let p = gameState.roundStatus.find(a => a.current)?.teamsAnswer;
        let s = [];
        console.log(getCurrentTeam());
        Object.keys(gameState.playerProgress).forEach(a => {
            console.log(gameState.playerProgress[a]);
            if(gameState.playerProgress[a].team === getCurrentTeam()) {
                console.log(a);
                s.push(gameState.playerProgress[a]);
            }
        });
        let c = 0;
        let correct = getCurrentQuestion()?.presetAnswers[getQuestionSelection()]?.correct;
        let displayScore = 0;
        if(correct) {
            c = game.content.scoreWin;
        } else {
            c = game.content.scoreLose;
        }
        if(s) {
            s.forEach(a => {
                if(a.score===undefined) {
                    a.score = c;
                } else {
                    a.score += c;
                }
                displayScore = a.score;
            });
        }
        updateStatus();
        updateSpecStatus(correct);
        triggerRoundWindow(displayScore, c);
        closeRound();
    }

    const updateSpecStatus = answerWasCorret => {
        Object.keys(gameState.playerProgress).filter(a => gameState.playerProgress[a].team !== getCurrentTeam()).forEach(a => {
            let b = gameState.playerProgress[a];
            if(!answerWasCorret) {
                if(b.score!==undefined)
                    b.score += game.content.scoreSpecWin;
                else 
                    b.score = game.content.scoreSpecWin;
            } else {
                if(b.score!==undefined)
                    b.score += game.content.scoreSpecLose;
                else 
                    b.score = game.content.scoreSpecLose;
            }
        });
        updateStatus();
    }

    const triggerRoundWindow = (score, change) => {
        props.send('triggerresultscreen', {username: TeamNames[getCurrentTeam()], score: score, change: change, msg: getCorrectAnswerAsString()});
    }

    const triggerGameEndWindow = (winnerUsername, score, change) => {
        props.send('triggerresultscreen', {username: winnerUsername, score: score, change: change, title: "winner of this game", msg: ""});
    }

    const getCorrectAnswerAsString = () => {
        let ret = "";
        getCurrentQuestion().presetAnswers.filter(a => a.correct).forEach(a => {
            ret+=a.text+"; ";
        });
        return ret;
    }

    const closeRound = () => {
        let ngs = gameState.roundStatus;
        let e = ngs.find(i => i.roundId === selectedRound);
        e.current = false;
        updateStatus();
    }

    const closeGame = () => {
        setWinner();
        gameState.current = false;
        gameState.done = true;
        updateStatus();
    }

    const generatePlayerArrayToString = player => {
        let ret = "";
        if(player instanceof Array && player.length) {
            player.forEach((a, i) => {
                ret += a.username;
                if(i<player.length-1)
                    ret += ", ";
            });
        }
        return ret;
    }

    const setWinner = () => {
        let winner = [];
        let maxScore = Number.MIN_SAFE_INTEGER;
        Object.keys(gameState.playerProgress).forEach(ps => {
            if(gameState.playerProgress[ps].score>maxScore)
                maxScore = gameState.playerProgress[ps].score;
        });
        Object.keys(gameState.playerProgress).forEach(ps => {
            if(gameState.playerProgress[ps].score===maxScore)
                winner.push(ps);
        });
        let gs = props.eventStatus.globalScores;
        let displayScore = "";
        winner.forEach(w => {
            if(gs[w]) {
                gs[w] += 1;
            } else {
                gs[w] = 1;
            }
            displayScore += gs[w]+"; ";
        });
        triggerGameEndWindow(generatePlayerArrayToString(props.eventPlayerList.filter(a => winner.includes(a.playerId))), displayScore, 1);
        updateStatus();
    }

    const renderSelect = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="mod-title">
                    <div className="game-title">
                        <h1>
                            {game?.title}
                        </h1>
                    </div>
                    <div className="mod-menu-button-array-2">
                        <div className="mod-menu-button" onClick={closeGame}>Lobby</div>
                    </div>
                </div>
                <div className="sidepanel panel double-r">
                    <ul className="small-list clickable-list">
                        {getAvailableTeams().map(a => 
                            <li onClick={() => selectTeam(a)} className={((a===selectedTeam?"selected-2 ":"")+TeamClasses[a])}>
                                <div>{TeamNames[a]}</div>
                                <div></div>
                            </li>
                        )}
                    </ul>
                </div>
                <BingoBoard 
                    isMod={true}
                    game={game}
                    gameState={gameState}
                    categoryCallback={selectRound}
                    selected={selectedRound}
                ></BingoBoard>
                <div></div>
                <div className="buttom-right-button">
                    <MainButton className={(!isReady())?"locked":""} text="Start" onClick={isReady()?startRound:null}></MainButton>
                </div>
            </div>
        );
    }

    const renderRound = () => {
        return (
            <div className="lobby-mod-grid">
                <div className="game-title">
                    <h1>
                        {game?.title}
                    </h1>
                </div>
                <div className="sidepanel panel double-r">
                    <ul className="small-list clickable-list">
                        {getAvailableTeams().map(a => 
                            <li className={((a===selectedTeam?"selected-2 ":"")+TeamClasses[a])}>
                                <div>{TeamNames[a]}</div>
                                <div></div>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="question-container">
                    <QuestionComponent 
                        question={getCurrentQuestion()}
                        asking={false}
                        callback={setSelection}
                        selection={getQuestionSelection()}
                    />
                </div>
                <div className="buttom-right-button">
                    <MainButton 
                        text={"show result"}
                        className={getQuestionSelection()===-1?'locked':''}
                        onClick={() => getQuestionSelection()===-1?null:triggerCloseRound()}
                    ></MainButton>
                </div>
            </div>
        );
    }

    return (
        <div>
            {showTeamScreen()?
                <TeamCreateWindow 
                    eventPlayerList={getPlayerlist()}
                    isMod={true}
                    callback={teamWindowCallback}
                    confirmCallback={teamWindowConfirmCallback}
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

export default GameBingoMod