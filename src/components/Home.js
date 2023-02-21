import React, { Component, useState, useEffect, useRef, createRef, forwardRef, useImperativeHandle, useReducer } from 'react';

import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";
import DataPackage from '../tools/DataPackage';
import { getPlayerId, getUsername, storePlayerId, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';
import MainButton from './MainButton';

import iconUser from '../assets/user.svg';
import HomeSidePanel from './SidePanel/HomeSidePanel';
import EventSelectComponent from './EventSelectComponent/EventSelectComponent';

import logo from '../assets/favicon.png';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const Home = forwardRef((props, ref) => {

    const [newUsername, setNewUsername] = useState(getUsername());
    const [eventList, setEventList] = useState([]);
    const [showSidePanel, setShowSidePanel] = useState(false);

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    const refUpload = createRef();

    useEffect(() => {
        refresh();
    }, []);

    useImperativeHandle(ref, () => ({
        updateUsername() {
            setNewUsername(getUsername());
        },
        setEvents(eventList) {
            setEventList(eventList ?? []);
        }
    }));

    const refresh = () => {
        props.send('geteventlist', {});
    }

    const saveNewUsername = () => {
        if(newUsername!==getUsername()) {
            storeUsername(newUsername);
            forceUpdate();
            props.send('updateplayerdata', {oldPlayerId: getPlayerId(), username: getUsername()});
        }
    }

    const isUsernameSaveable = () => {
        return newUsername!=="" && newUsername !== getUsername();
    }

    const updateNewUsername = username => {
        if(username.length<=16) {
            setNewUsername(username);
        }
    }

    const joinEvent = eventId => {
        props.send('joinevent', {"eventId": eventId});
    }

    return (
        <div>
            <div className="change-username">
                <input value={newUsername} onChange={e => updateNewUsername(e.target.value)}></input>
                <button 
                    onClick={() => isUsernameSaveable()?saveNewUsername():null}
                    className={isUsernameSaveable()?"":"locked"}>
                        Update Username
                </button>
            </div>
            <div className="home-grid">
                <img src={logo} className="home-logo" alt="logo" />
                <div className='home-centerd-pane'>
                    <EventSelectComponent
                        eventList={eventList}
                        joinCallback={joinEvent}
                    />
                    <MainButton
                        text={"refresh"}
                        onClick={refresh}
                        style={{marginTop: '10px'}}
                    />
                </div>
            </div>
            <div className="buttom-right-button">
                <MainButton 
                    text={"Moderate Event"}
                    onClick={() => setShowSidePanel(!showSidePanel)}
                />
            </div>
            <HomeSidePanel 
                show={showSidePanel}
                onClose={() => setShowSidePanel(false)}
                send={props.send}
            />
        </div>
    );
});

export default Home
