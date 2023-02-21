import MainButton from "./MainButton";

const LobbyModScreen = props => {

    const selectGame = gameId => {
        let es = props.eventStatus;
        if(es?.gameStatus?.[gameId]) {
            if(es.gameStatus[gameId].selected) {
                deselectAllGames();
                es.gameStatus[gameId].selected = false;
            } else {
                deselectAllGames();
                es.gameStatus[gameId].selected = true;
            }
            props.send('seteventstatus', es);
        }
    }

    const deselectAllGames = () => {
        let es = props.eventStatus;
        if(es) {
            es.gameStatus?.forEach(gs => {
                gs.selected = false;
            });
            props.send('seteventstatus', es);
        }
    }

    const startGame = () => {
        let es = props.eventStatus;
        if(getSelectedGame()) {
            es.gameStatus[getSelectedGameIndex()].current = true;
            setupPlayerProgress();
            deselectAllGames();
            props.send('seteventstatus', es);
        }
    }

    const toggleJoinable = () => {
        props.eventStatus.joinable = !props.eventStatus?.joinable;
        props.send('seteventstatus', props.eventStatus);
    }

    const setupPlayerProgress = () => {
        if(getSelectedGame()) {
            let pg = {};
            props.eventPlayerList.forEach(p => {
                if(p.playerState === props.PlayerStates.PLAYER) {
                    pg[p.playerId] = {
                        score: 0,
                        team: -1,
                        special: getGameSpecials(getSelectedGame())
                    }
                }
            });
            let es = props.eventStatus;
            es.gameStatus[getSelectedGameIndex()].playerProgress = pg;
            props.send('seteventstatus', es);
        }
    }

    const getGameSpecials = game => {
        if(!game?.content) return;
        return game.content.joker ? {joker: game.content.joker} : 0;
    }

    const getSelectedGame = () => {
        let id = getSelectedGameIndex();
        if(id!==-1) {
            return props.eventData?.games[id];
        }
        return null;
    }

    const getSelectedGameIndex = () => {
        return props.eventStatus?.gameStatus?.findIndex(g => g.selected);
    }

    const isDone = i => {
        return !!props.eventStatus?.gameStatus[i]?.done;
    }

    const closeEvent = () => {
        props.eventStatus.finished = true;
        props.send('seteventstatus', props.eventStatus); //deletes event

        // props.send('closeevent', null); //deletes event
    }

    return (
        <div className="lobby-mod-grid">
            <div className="mod-title">
                <div className="game-title">
                    <h1>
                        {props.eventData?.title}
                    </h1>
                </div>
                <div className="mod-menu-button-array-2">
                    <div className="mod-menu-button" onClick={closeEvent}>end Event</div>
                    <div className="mod-menu-button" onClick={toggleJoinable}>
                        {props.eventStatus?.joinable?"close joining phase":"open joining phase"}
                    </div>
                </div>
            </div>
            <div className="sidepanel panel double-r">
                <ul className="small-list">
                    {props.eventPlayerList?.filter(b => b.playerState === props.PlayerStates.MOD).map(a => 
                        <li className="scoreboard-item-mod">
                            <div>{a.username}</div>
                            <div></div>
                        </li>
                    )}
                    <div className="list-spacer"></div>
                    {props.eventPlayerList?.filter(b => b.playerState === props.PlayerStates.PLAYER).map(a => 
                        <li>
                            <div>{a.username}</div>
                            <div></div>
                        </li>
                    )}
                    <div className="list-spacer"></div>
                    {props.eventPlayerList?.filter(b => b.playerState === props.PlayerStates.SPECTATOR).map(a => 
                        <li className="scoreboard-item-spectator">
                            <div>{a.username}</div>
                            <div></div>
                        </li>
                    )}
                </ul>
            </div>
            <div className="panel">
                <ul className="large-list clickable-list">
                    {props.eventData?.games?.map((game, i) => 
                        <li onClick={() => selectGame(i)} className={isDone(i)?"locked":(getSelectedGameIndex()===i?"selected":"")}>
                            <div>{game.title}</div>
                            <div className="double-r rigth-element"></div>
                            <div>{game.description}</div>
                        </li>
                    )}
                </ul>
            </div>
            <div className="buttom-right-button">
                <MainButton 
                    text={"Start"}
                    className={getSelectedGameIndex()===-1?"locked":""}
                    onClick={startGame}
                />
            </div>
        </div>
    );
}

export default LobbyModScreen 