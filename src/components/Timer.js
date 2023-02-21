import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';


const Timer = forwardRef((props, ref) => {

    const [timerFkt, setTimerFkt] = useState(null);
    const [endTime, setEndTime] = useState(-1);
    const [time, setTime] = useState(-1);
    const [displayTime, setDisplayTime] = useState("0:00");
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if(time>=0 && !timerFkt && !isPaused) {
            setTimerFkt(setTimeout(refreshTimer, 1000));
        }
    }, [timerFkt, endTime, time, displayTime, isPaused]);

    const showTimer = () => {
        return props.timer && props.timer > 0;
    }

    const getRelativeTime = absTime => {
        return absTime - Math.floor(new Date().getTime() / 1000);
    }

    useImperativeHandle(ref, () => ({
        triggerTimer(data) {
            if(!data) return;
            if(data.endTime) {
                const endTime = parseInt(data.endTime);
                const relativeTime = getRelativeTime(endTime);
                setEndTime(endTime);
                setTime(relativeTime);
                updateDisplayTime(relativeTime);
            }
            if(parseInt(data.endTime) !== -1) {
                if(data.pause) {
                    pauseTimer();
                } else if(!timerFkt) {
                    resumeTimer();
                }
            }
        }
    }));

    const refreshTimer = () => {
        if(time>=0) {
            let t = time-1;
            if(t>=0) {
                setTime(t);
                updateDisplayTime(t);
                setTimerFkt(null);
            } else {
                setEndTime(-1);
                setTime(-1);
                clearTimeout(timerFkt);
                setTimerFkt(null);
            }
        }
    }

    const updateDisplayTime = relativeTime => {
        let m = Math.floor(relativeTime/60);
        let s = relativeTime%60;
        setDisplayTime(m+":"+(s<10?"0":"")+s);
    }

    const pauseTimer = () => {
        setIsPaused(true);
        clearTimeout(timerFkt);
        setTimerFkt(null);
    }

    const resumeTimer = () => {
        setIsPaused(false);
        setTimerFkt(setTimeout(refreshTimer, 1000));
    }

    return (
        <div className={`timer ${isPaused?'timer-blinking':''}`}>
            {endTime!==-1 ? displayTime : ""}
        </div>
    );
});

export default Timer