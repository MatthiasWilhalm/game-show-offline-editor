import useWebSocket from 'react-use-websocket';
import React, { Component, useState, useEffect, useRef, createRef, useReducer } from 'react';

import {
    BrowserRouter as Router,
    Routes,
    Route,
    Redirect,
    withRouter,
    useNavigate
} from "react-router-dom";
import DataPackage from '../tools/DataPackage';
import { getPlayerId, getUsername, storePlayerId, storePlayerState, storeUsername } from '../tools/tools';
import { Event } from '../tools/Event';
import { Game } from '../tools/Game';
import Home from './Home';
import GameScreen from './GameScreen';
import UiTest from './UiTest';
import Editor from './Editor';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const Main = () => {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Editor/>}></Route>
                <Route path="/editor" element={<Editor/>}></Route>
                <Route path="/uitest" element={<UiTest/>}></Route>
            </Routes>
        </div>
    );
}

export default Main
