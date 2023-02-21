import { useState, forwardRef, useEffect } from 'react';
import menuIcon from "../assets/menu.svg";


const GameModMenu = forwardRef((props, ref) => {

    const ShowStates = {
        INIT: "init",
        SHOW: "show",
        HIDE: "hide"
    };

    const TimerStates = {
        STOP: "stop",
        RUNNING: "running",
        PAUSED: "paused"
    }

    const [min, setMin] = useState(2);
    const [sec, setSec] = useState(0);
    const [state, setState] = useState(ShowStates.INIT);
    const [timerState, setTimerState] = useState(TimerStates.STOP);
    const [currentEndTime, setCurrentEndTime] = useState(0);


    useEffect(() => {
    
      return () => {}
    }, [state, timerState, min, sec]);
    

    const getTime = () => {
        return parseInt(sec) + parseInt(min)*60;
    }

    const getAbsoluteEndTime = () => {
        return Math.floor(new Date().getTime() / 1000) + getTime();
    }

    const setSecs = s => {
        if(s >= 60) {
            setSec(s%60);
            setMin(min+Math.floor(s/60));
        } else {
            setSec(s);
        }
    }

    const toggleState = () => {
        setState(state === ShowStates.SHOW ? ShowStates.HIDE : ShowStates.SHOW);
    }

    const startTimer = () => {
        console.log(timerState);
        if(timerState === TimerStates.STOP) {
            setTimerState(TimerStates.RUNNING);
            const time = getAbsoluteEndTime();
            setCurrentEndTime(time);
            props.send('timer', {endTime: time});
        } else if (timerState === TimerStates.RUNNING) {
            pauseTimer();
        } else if (timerState === TimerStates.PAUSED) {
            resumeTimer();
        }
    }

    const pauseTimer = () => {
        setTimerState(TimerStates.PAUSED);
        props.send('timer', {pause: true});
    }

    const resumeTimer = () => {
        setTimerState(TimerStates.RUNNING);
        props.send('timer', {pause: false});
    }
    
    const resetTimer = () => {
        setTimerState(TimerStates.STOP);
        props.send('timer', {endTime: -1, pause: false});
    }

    return (
        <div className={"mod-toggle-menu "+"mod-toggle-menu-"+state}>
            <div className="mod-toggle-menu-menu">
                <div className="mod-toggle-menu-element">
                    <label>Timer</label>
                    {timerState===TimerStates.PAUSED?
                        <button 
                            onClick={resetTimer}
                        >
                            Reset
                        </button>
                    :null}
                    <button 
                        onClick={startTimer}
                    >
                        {timerState===TimerStates.RUNNING?'Pause':'Start'}
                    </button>
                    <input 
                        placeholder="Min..."
                        value={min}
                        onChange={e => setMin(e.target.value)}
                        type="number"
                        step={1}
                        min={0}
                    ></input>
                    <input
                        placeholder="Sec..."
                        value={sec}
                        onChange={e => setSecs(e.target.value)}
                        type="number"
                        step={10}
                        min={0}
                    ></input>
                </div>
                <hr/>
            </div>
            <div 
                className="mod-toggle-menu-header"
                onClick={toggleState}
            >
                <img src={menuIcon}></img>
            </div>
        </div>
    );
});

export default GameModMenu