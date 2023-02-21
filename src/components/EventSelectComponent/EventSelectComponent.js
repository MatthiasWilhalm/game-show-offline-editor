import React, { Component, useState, useEffect, useRef, createRef, forwardRef, useImperativeHandle, useReducer } from 'react';

import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";
import CenteredPane from '../GenericComponents/CenteredPane';
import './EventSelectComponent.css';
import arrow from '../../assets/arrow.svg';
import iconUser from '../../assets/user.svg';


const EventSelectComponent = forwardRef((props, ref) => {
    //props: eventList, joinCallback
    const { eventList, joinCallback } = props;
    const [selectedEventIndex, setSelectedEventIndex] = useState(0);

    const nextEvent = () => {
        if(hasNextEvent)
            setSelectedEventIndex(selectedEventIndex+1);
    };

    const prevEvent = () => {
        if(hasPrevEvent)
            setSelectedEventIndex(selectedEventIndex-1);
    };

    const hasEvents = () => !!eventList?.length;
    const hasNextEvent = () => hasEvents && (selectedEventIndex < eventList.length-1);
    const hasPrevEvent = () => hasEvents && (selectedEventIndex > 0);

    console.log('eventList', eventList);
    console.log(!hasNextEvent() && 'none');

    return (
        <div className='event-selector'>
            <div 
                className='event-select-arrow left'
                style={{opacity: !hasPrevEvent() ? '0' :''}}
                onClick={prevEvent}
            >
                <img src={arrow}/>
            </div>
            {hasEvents() ? 
                <CenteredPane
                    title={eventList[selectedEventIndex].title}
                    subtitle={eventList[selectedEventIndex].subtitle}
                    onClick={() => joinCallback(eventList[selectedEventIndex].eventId)}
                    overwriteStyle={{
                        cursor: 'pointer',
                        width: 'unset',
                        maxWidth: 'unset',
                        minWidth: 'unset',
                        height: '95%',
                    }}
                    children={
                        <div className='online-count'>
                            {eventList[selectedEventIndex].online}
                            <img src={iconUser}></img>
                        </div>
                    }
                />
            :
                <CenteredPane
                    title="no Event running"
                    overwriteStyle={{
                        width: 'unset',
                        maxWidth: 'unset',
                        minWidth: 'unset', 
                        height: '95%',

                    }}
                />
            }
            <div 
                className='event-select-arrow'
                style={{opacity: !hasNextEvent() ? '0' :''}}
                onClick={nextEvent}
            >
                <img src={arrow}/>
            </div>        
        </div>
    );
});

export default EventSelectComponent;