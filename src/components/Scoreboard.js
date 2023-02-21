import trophyIcon from "../assets/trophy.svg"
import coinsIcon from "../assets/coins.svg"
import roundIcon from "../assets/round.svg"
import upIcon from "../assets/up.svg"
import downIcon from "../assets/down.svg"
import { getPlayerState } from "../tools/tools"

const Scoreboard = props => {

    const addGlobalScore = (playerId, amount) => {
        if(props.eventStatus?.globalScores?.[playerId]!==undefined) {
            props.eventStatus.globalScores[playerId]+=amount;
            props.send("seteventstatus", props.eventStatus);
        }
    }

    const addCoins = (playerId, amount) => {
        let p = props.eventStatus?.gameStatus?.find(b => b.current)?.playerProgress[playerId];
        if(p?.score !== undefined) {
            p.score+=amount;
            props.send("seteventstatus", props.eventStatus);
        }
    }

    const showRoundStatus = () => {
        return !!props.eventStatus?.gameStatus?.find(b => b.current)?.roundStatus?.[0]?.currentPlayerId;
    }

    const getRoundStatus = playerId => {
        let ret = 0;
        props.eventStatus?.gameStatus?.find(b => b.current)?.roundStatus?.forEach(a => {
            if(a.currentPlayerId === playerId)
                ret++;
        });
        return ret;
    }

    const renderPlayerItem = (a, i) => {
        let m = getPlayerState() === props.PlayerStates.MOD;
        let global = props.eventStatus?.globalScores?.[a.playerId] ?? '-';
        let coins = props.eventStatus.gameStatus?.find(b => b.current)?.playerProgress[a.playerId]?.score;
        let isInGame = coins!==undefined;

        return (
            <li className="scoreboard-item-player">
                <div>{i+". "+a.username}</div>
                <div className="scoreboard-score-data">
                    {m?
                        <button className="score-up" onClick={() => addGlobalScore(a.playerId, 1)}>
                            <img src={upIcon}></img>
                        </button>
                    :''}
                    <p>{global}</p>
                    <img className="scoreboard-score-data" src={trophyIcon}></img>
                    {m?
                        <button className="score-down" onClick={() => addGlobalScore(a.playerId, -1)}>
                            <img src={downIcon}></img>
                        </button>
                    :''}
                </div>
                {isInGame?
                    <div className="scoreboard-score-data">
                        {m?
                            <button className="score-up" onClick={() => addCoins(a.playerId, 1)}>
                                <img src={upIcon}></img>
                            </button>
                        :''}
                        <p>{coins}</p>
                        <img className="scoreboard-score-data" src={coinsIcon}></img>
                        {m?
                            <button className="score-down" onClick={() => addCoins(a.playerId, -1)}>
                                <img src={downIcon}></img>
                            </button>
                        :''}
                    </div>
                :''}
                {showRoundStatus()?
                    <div className="scoreboard-score-data">
                        <p>{getRoundStatus(a.playerId)}</p>
                        <img className="scoreboard-score-data" src={roundIcon}></img>
                    </div>
                :''}
            </li>
        );
    }

    const renderModItem = a => {
        return (
            <li className="scoreboard-item-mod">
                <div>{a.username}</div>
            </li>
        );
    }

    const renderSpectatorItem = a => {
        return (
            <li className="scoreboard-item-spectator">
                <div>{a.username}</div>
            </li>
        );
    }

    return (
        <div className="scoreboard">
            <h1>Scoreboard</h1>
            <ul>
                {props.eventPlayerList?.filter(b => b.playerState === props.PlayerStates.MOD).map(a => 
                    renderModItem(a)
                )}
                <div className="list-spacer"></div>
                {props.eventPlayerList?.
                filter(b => b.playerState === props.PlayerStates.PLAYER).
                sort((b, c) => props.eventStatus?.globalScores?.[c.playerId] - props.eventStatus?.globalScores?.[b.playerId]).
                map((a,i) => 
                    renderPlayerItem(a,i+1)
                )}
                <div className="list-spacer"></div>
                {props.eventPlayerList?.filter(b => b.playerState === props.PlayerStates.SPECTATOR).map(a => 
                    renderSpectatorItem(a)
                )}
            </ul>
        </div>
    );
}

export default Scoreboard