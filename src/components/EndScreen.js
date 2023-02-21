import { getPlayerState } from "../tools/tools";

const EndScreen = props => {

    const isMod = () => {
        return getPlayerState()===props.PlayerStates?.MOD;
    }

    const closeEvent = () => {
        props.send('closeevent', null);
    }

    const renderPlayerItem = (a, i) => {
        let global = props.eventStatus?.globalScores?.[a.playerId] ?? '-';
        switch (i) {
            case 1:
                return(
                    <li className="first-player-item">
                        <div>{i+". "+a.username}</div>
                        <div>{global}</div>
                    </li>
                );
            case 2:
                return (
                    <li className="second-player-item">
                        <div>{i+". "+a.username}</div>
                        <div>{global}</div>
                    </li>
                );
            case 3:
                return (
                    <li className="third-player-item">
                        <div>{i+". "+a.username}</div>
                        <div>{global}</div>
                    </li>
                );
            default:
                return (
                    <li>
                        <div>{i+". "+a.username}</div>
                        <div>{global}</div>
                    </li>
                );
        }
    }
    
    return (
        <div className="end-grid">
            <div className="mod-title">
                <div className="game-title">
                    <h1>
                        {"Result"}
                    </h1>
                </div>
                {isMod()?
                    <div className="mod-menu-button-array-2">
                        <div className="mod-menu-button" onClick={closeEvent}>close Event</div>
                    </div>
                :''}
            </div>
            <div className="panel centered-panel">
                <ul className="small-list">
                    {props.eventPlayerList?.
                    filter(b => b.playerState === props.PlayerStates.PLAYER).
                    sort((b, c) => props.eventStatus?.globalScores?.[c.playerId] - props.eventStatus?.globalScores?.[b.playerId]).
                    map((a,i) => 
                        renderPlayerItem(a,i+1)
                    )}
                </ul>
            </div>
        </div>
    );
}

export default EndScreen