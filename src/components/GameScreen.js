import React, { Component, useState, useEffect, useRef, createRef, forwardRef,useImperativeHandle, useReducer } from 'react';

import { useNavigate } from 'react-router-dom';

import DataPackage from '../tools/DataPackage';
import { getPlayerId, getPlayerState, getUsername, storePlayerId, storePlayerState, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';
import ChatComponent from './ChatComponent';
import MainButton from './MainButton';
import LobbyPlayerScreen from './LobbyPlayerScreen';
import LobbyModScreen from './LobbyModScreen';
import GameQueuePlayerScreen from './QueueGame/GameQueuePlayerScreen';
import GameQueueModScreen from './QueueGame/GameQueueModScreen';
import GameQuizMod from './QuizGame/GameQuizMod';
import GameQuizPlayer from './QuizGame/GameQuizPlayer';
import ScoreboardWindow from './ScoreboardWindow';
import ResultWindow from './ResultWindow';
import GameBingoMod from './BingoGame/GameBingoMod';
import GameBingoPlayer from './BingoGame/GameBingoPlayer';
import EndScreen from './EndScreen';

import closeIcon from '../assets/close.svg'
import GameModMenu from './GameModMenu';
import Timer from './Timer';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const GameScreen = forwardRef((props, ref) => {

    const navigate = useNavigate();

    const chatRef = useRef(null);
    const resultRef = useRef(null);
    const timerRef = useRef(null);

    const [showScoreboard, setShowScoreboard] = useState(false);

    const [result, setResult] = useState(null);

    useEffect(() => {
        if(!props.eventData) {
            navigate('/home');
        }
        document.addEventListener('keydown', keyDownEvents);
        document.addEventListener('keyup', keyUpEvents);
        return () => {
            document.removeEventListener('keydown', keyDownEvents);
            document.removeEventListener('keyup', keyUpEvents);
        }
    }, [showScoreboard, result]);

    useImperativeHandle(ref, () => ({
        triggerChat() {
            chatRef?.current.newMsg();
        },
        triggerResultScreen(resultData) {
            setResult(resultData);
            resultRef?.current.showWindow();
        },
        triggerTimer(timerData) {
            timerRef?.current.triggerTimer(timerData);
        }
    }));

    const keyDownEvents = k => {
        if(k.key === 'Tab') {
            k.preventDefault();
            setShowScoreboard(true);
            // console.log(showScoreboard);
        } else if(k.key === 'e') {
            // setShowScoreboard(false);
        }
    }

    const keyUpEvents = k => {
        if(k.key === 'Tab') {
            setShowScoreboard(false);
        }
    }

    const isMod = () => {
        return getPlayerState()===props.PlayerStates?.MOD;
    }

    const renderGameScreen = isMod => {
        let currentId = props.eventStatus?.gameStatus?.findIndex(a => a.current);
        if(currentId!==-1) {
            let type = props?.eventData?.games[currentId]?.type;
            switch (type) {
                case "queue":
                    if(isMod)
                        return (<GameQueueModScreen {...props}/>);
                    else
                        return (<GameQueuePlayerScreen {...props}/>);
                case "quiz":
                    if(isMod)
                        return(<GameQuizMod {...props}/>);
                    else
                        return (<GameQuizPlayer {...props}/>);
                case "bingo":
                    if(isMod)
                        return(<GameBingoMod {...props}/>)
                    else
                        return (<GameBingoPlayer {...props}/>);
                default:
                    return(
                        <div>
                            {"null"}
                        </div>
                    );
            }
        }


    }

    const renderScreenState = () => {
        
        if(props.eventStatus?.finished) {
            return (
                <EndScreen {...props} />
            );
        } else if(!!props.eventStatus?.gameStatus?.find(a => a.current)) {
            return renderGameScreen(isMod());
        } else {
            return (
                <div>
                    {isMod()?
                        <LobbyModScreen {...props}/>
                        
                    :
                        <LobbyPlayerScreen {...props}/>
                    }
                </div>
            );
        }
    }

    return (
        <div>
            {isMod()?
                <GameModMenu {...props}/>
            :null}
            {renderScreenState()}
            {showScoreboard?
                <ScoreboardWindow {...props}/>
            :''}
            <ResultWindow 
                username={result?.username}
                score={result?.score}
                change={result?.change}
                title={result?.title}
                msg={result?.msg}
                autoHide={true}
                ref={resultRef}
            />
            <ChatComponent 
                {...props}
                ref={chatRef}
                isMod={isMod()}
            />
            <Timer 
                {...props}
                ref={timerRef}
            />
        </div>
    );
});

export default GameScreen
