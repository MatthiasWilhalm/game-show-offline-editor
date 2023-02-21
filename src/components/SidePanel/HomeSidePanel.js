import React, { Component, useState, useEffect, useRef, createRef, forwardRef, useImperativeHandle, useReducer } from 'react';

import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";
import { getModerationEvent, storeModerationEvent } from '../../tools/tools';
import CenteredPane from '../GenericComponents/CenteredPane';
import MainButton from '../MainButton';
import SidePanel from './SidePanel';

const HomeSidePanel = forwardRef((props, ref) => {

    const [currentEvent, setCurrentEvent] = useState(null);

    const refUpload = createRef();

    useEffect(() => {
        setCurrentEvent(getModerationEvent());
    }, []);

    const uploadEvent = () => {
        refUpload.current.click();
    };

    const downloadEvent = () => {
        const element = document.createElement("a");
        const file = new Blob([JSON.stringify(currentEvent)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${currentEvent?.title?.replace(' ', '_') ?? 'event'}.json`;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }

    const getGamesCount = () => {
        return currentEvent ? currentEvent?.games?.length : 0;
    };

    const eventSelected = e => {
        let file = e.target.files[0];
        if(file) {
            let event = null;
            const reader = new FileReader();
            reader.addEventListener('load', ev => {
                try {
                    let result = ev.target.result;
                    event = JSON.parse(result);
                    console.log(event);
                    storeModerationEvent(event);
                    setCurrentEvent(getModerationEvent());
                } catch(err) {
                    console.log(err);
                }
            });
            reader.readAsText(file);
        }
    }

    const startEvent = () => {
        props.send('createandjoinevent', currentEvent);
    };

    const clearEvent = () => {
        storeModerationEvent(null);
        setCurrentEvent(null);
    };
    
    const renderContent = () => {
        return (
            <div className="side-panel-content">
                <CenteredPane
                    title={currentEvent ? currentEvent?.title : "No Event loaded"}
                    subtitle={currentEvent ? `${getGamesCount()} games` : ""}
                />
                {!currentEvent && <MainButton onClick={uploadEvent} text={"Upload Event"}/>}
                <Link to={"/editor"}>
                    <MainButton onClick={null} text={currentEvent ? "Edit Event" : "Create Event"}/>
                </Link>
                {currentEvent && <MainButton onClick={downloadEvent} text={"Download Event"}/>}
                {currentEvent && <MainButton onClick={clearEvent} text={"Clear Event"}/>}
                <div style={{display: "none"}}>
                    <input 
                        type="file"
                        ref={refUpload}
                        onChange={eventSelected}
                    ></input>
                </div>
            </div>
        );
    };

    const renderFooter = () => {
        return (
            <div className="side-panel-footer">
                {currentEvent && <MainButton text={"Start Event"} onClick={startEvent}/>}
                <MainButton text="Close" onClick={props.onClose}/>
            </div>
        );
    };

    return (
        <SidePanel
            {...props}
            content={renderContent()}
            footerOverride={renderFooter()}
        />
    );
});

export default HomeSidePanel