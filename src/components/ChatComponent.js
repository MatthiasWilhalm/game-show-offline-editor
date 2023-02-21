import useToggle from "../tools/useToggle";
import chatIcon from "../assets/chat.svg";
import closeIcon from "../assets/close.svg";
import sendIcon from "../assets/send.svg";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { getPlayerId, getPlayerState, getUsername } from "../tools/tools";

const ChatComponent = forwardRef((props, ref) => {

    const ShowStates = {
        INIT: "init",
        SHOW: "show",
        HIDE: "hide"
    };

    const TeamNames = ["Team A", "Team B"];

    const maxMsgLength = 200;

    const [showState, setShowState] = useState(ShowStates.INIT);
    const [currentMsg, setCurrentMsg] = useState("");
    const [isUnRead, setUnRead] = useState(false);
    const [chatroom, setChatroom] = useState(-1);

    const inputRef = useRef(null);
    const logRef = useRef(null);

    const gameState = props.eventStatus?.gameStatus?.find(g => g.current);

    const isSpec = () => {
        return getPlayerState() === props.PlayerStates?.SPECTATOR;
    }

    useEffect(() => {
        document.addEventListener('keydown', keyDownEvent);
        return () => {
            document.removeEventListener('keydown', keyDownEvent);
        }
    }, [showState, currentMsg, isUnRead]);

    const keyDownEvent = k => {
        switch (k.key) {
            case 'Enter':
                if(showState!==ShowStates.SHOW)
                    toggleShow();
                else if(showState===ShowStates.SHOW)
                    sendMsg();
                break;
            case 'Escape':
                if(showState===ShowStates.SHOW)
                    setShowState(ShowStates.HIDE);
                break;
            default:
                break;
        }
    }

    const toggleShow = () => {
        if(showState!==ShowStates.SHOW) {
            setUnRead(false);
            inputRef?.current.focus();
            setShowState(ShowStates.SHOW);
        } else {
            setShowState(ShowStates.HIDE);
        }
    }

    const triggerUnRead = () => {
        if(showState!==ShowStates.SHOW)
            setUnRead(true);
    }

    const sendMsg = () => {
        if(currentMsg!=="" && showState===ShowStates.SHOW) {
            props.send('chat', {username: getUsername(), type: null, text: currentMsg, usercolor: '', team: chatroom});
            setCurrentMsg("");
        }
    }

    const setMsg = txt => {
        if(showState===ShowStates.SHOW && (txt.length < maxMsgLength || txt.length < currentMsg)) {
            setCurrentMsg(txt);
        }
    }

    const getPlayerlist = () => {
        let pl = JSON.parse(JSON.stringify(props.eventPlayerList?.filter(a => a.playerState === props.PlayerStates.PLAYER)));
        pl.map(a => {
            a.team = gameState?.playerProgress?.[a.playerId]?.team;
            return a;
        });
        return pl;
    }

    /**
     * -1 = Global
     * 0 = Team A
     * 1 = Team B
     * @param {Number} team 
     * @returns 
     */
    const getChat = team => {
        return props.chat.filter(a => a.team === team);
    }

    const getTeamFromPlayer = () => {
        return getPlayerlist()?.find(a => a.playerId === getPlayerId())?.team ?? -1;
    }

    const getAvailableTeams = () => {
        let t = [];
        getPlayerlist().forEach(a => a.team!==undefined && a.team !==-1 ? t.push(a.team) : null);
        return [... new Set(t)];
    }

    const acceptJoinRequest = (chatIndex, playerId) => {
        console.log(props.chat[chatIndex].text);
        props.chat[chatIndex].text = 1;
        props.setChat(props.chat);
        props.send('forcejoinevent', {playerId: playerId});
    }

    const denyJoinRequest = chatIndex => {
        props.chat[chatIndex].text = -1;
        props.setChat(props.chat);
    }

    const leaveEvent = () => {
        props.send('leaveevent', null);
        props.leaveEvent();
    }

    /**
     * 
     * @param {HTMLElement} e 
     */
    const updateScrollbar = () => {
        let e = logRef.current;
        e.scrollTop = e.scrollHeight - e.clientHeight;

    }

    useImperativeHandle(ref, () => ({
        newMsg() {
            // updateScrollbar();
            triggerUnRead();
        }
    }));

    const renderTeamList = team => {
        let t = getTeamFromPlayer();
        if(gameState?.teamsCreated && ((props.isMod && getAvailableTeams().length>0) || t === team)) {
            return (
                <li 
                    onClick={() => setChatroom(team)}
                    className={chatroom===team?"selected":""}
                >
                    {TeamNames[team]}
                </li>
            );
        } else return null;
    }

    const renderChatMsg = (msg, reversedIndex) => {
        const index = getChat(chatroom).length - reversedIndex - 1;
        switch (msg.type) {
            case 'cmd':
                return (
                    <div className="chat-item">
                        <div><i>{msg.text}</i></div>
                    </div>
                );                
            case 'playrequest':
                if(props.isMod)
                    return (
                        <div className="chat-item">
                            <div>{msg.username+" wants to play"}</div>
                            {msg.text===1?
                                <div>{"request accepted"}</div>
                            :(msg.text===-1?
                                <div>{"request denyed"}</div>                                
                            :
                                <div className="chat-item-button-array">
                                    <button className="right" onClick={() => acceptJoinRequest(index, msg.text)}>Accept</button>
                                    <button className="wrong" onClick={() => denyJoinRequest(index)}>Deny</button>
                                </div>
                            )}
                        </div>
                    );
                else return null;
            default:
                return (
                    <div className="chat-item">
                        <div>{msg.username+": "+msg.text}</div>
                    </div>
                );
        }
    }

    return(
        <div className={"chat chat-state-"+showState}>
            <div className="chat-header">
                <div className="chat-button" onClick={toggleShow}>
                    {isUnRead?<div className="chat-unread"></div>:''}
                    <img src={(showState===ShowStates.SHOW)?closeIcon:chatIcon}></img>
                </div>
                {(showState===ShowStates.SHOW)?
                    <div className="chat-button-right" onClick={leaveEvent}>
                        Leave Event
                    </div>
                :""}
            </div>
            <div className="chat-main">
                <ul className="chat-tabs">
                    <li onClick={() => setChatroom(-1)} className={chatroom===-1?"selected":""}>Global</li>
                    {renderTeamList(0)}
                    {renderTeamList(1)}
                </ul>
                <div className="chat-msgs" ref={logRef}>
                    {props.chat?
                        getChat(chatroom).reverse().map((a, i) => 
                            renderChatMsg(a, i)
                        )
                    :""}
                </div>
                <div className="chat-textfield">
                    <input 
                        placeholder="message..."
                        value={currentMsg}
                        onChange={e => setMsg(e.target.value)}
                        ref={inputRef}
                        disabled={isSpec()}
                    ></input>
                    <button onClick={sendMsg}>
                        <img src={sendIcon}></img>
                    </button>
                </div>
            </div>
        </div>
    );
});

export default ChatComponent