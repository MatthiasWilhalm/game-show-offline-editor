import { useState } from "react";
import { getPlayerId, getPlayerState, getUsername, storePlayerState } from "../tools/tools";
import MainButton from "./MainButton";

const LobbyPlayerScreen = props => {

    const [cooldownOnRequest, setCooldownOnRequest] = useState(false);

    const getSelectedGameIndex = () => {
        return props.eventStatus?.gameStatus?.findIndex(g => g.selected);
    }

    const getSelectedGame = () => {
        let id = getSelectedGameIndex();
        if(id!==-1) {
            console.log(props.eventData?.games[id]);
            return props.eventData?.games[id];
        }
        return null;
    }

    const getModName = () => {
        return props.eventPlayerList?.find(a => a.playerId === props.eventStatus.modId)?.username; 
    }

    const changeToSpectator = () => {
        props.send('updateplayerdata', {oldPlayerId: getPlayerId(), playerState: props.PlayerStates.SPECTATOR});
        storePlayerState(props.PlayerStates.SPECTATOR);
    }

    const requestToPlay = () => {
        props.send('chat', {username: getUsername(), type: 'playrequest', text: getPlayerId(), usercolor: '', team: -1});
        setCooldownOnRequest(true);
        setTimeout(() => setCooldownOnRequest(false), 5000);
    }


    return (
        <div className="lobby-grid">
            <div></div>
            <div className="lobby-screen">
                <h1>{props.eventData?.title}</h1>
                <h2>{getSelectedGame()?.title ?? "Game starts soon..."}</h2>
                <p>{getSelectedGame()?.description ?? ""}</p>
                <h3>{"Host: "+getModName()}</h3>
                <p>{props.eventPlayerList?.length+" online"}</p>
            </div>
            <div className="buttom-right-button">
                {(getPlayerState() === props.PlayerStates.PLAYER+'')?
                    <MainButton 
                        text={"switch to spectator"}
                        onClick={changeToSpectator}
                    ></MainButton>
                :
                    <MainButton 
                        text={"request to play"}
                        onClick={cooldownOnRequest?null:requestToPlay}
                        className={cooldownOnRequest?'locked':''}
                    ></MainButton>
                }
            </div>
        </div>
    );
}

export default LobbyPlayerScreen