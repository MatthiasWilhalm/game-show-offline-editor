import { useEffect, useReducer, useState } from "react";
import randomIcon from "../assets/random.svg"
import MainButton from "./MainButton";

const TeamCreateWindow = props => {

    const reverseStyle = {
        "grid-template-columns": "20% 80%"
    };

    const switchTeam = playerId => {
        let pl = JSON.parse(JSON.stringify(props.eventPlayerList));        
        let p = pl.find(a => a.playerId === playerId);
        p.team = p.team===0?1:0;

        callbackPlayerlist(pl);
    }

    const callbackPlayerlist = list => {
        if(list)
            props.callback?.(list);
    }

    const shuffleTeams = () => {
        if(props.eventPlayerList) {
            let s = shuffle(props.eventPlayerList.length);
            let pl = JSON.parse(JSON.stringify(props.eventPlayerList));
            let toA = !!Math.round(Math.random());
            const odd = !!pl.length%2;
            s.forEach((si, i) => {
                if(!odd ? i<pl.length/2 : (toA ? i<Math.ceil(pl.length/2) : i<Math.floor(pl.length/2))) {
                    pl[si].team = 0;
                } else {
                    pl[si].team = 1;
                }
            });
            callbackPlayerlist(pl);
        }
    }

    /**
     * returns a array with number from 0 - max in a random order
     * @param {Number} max 
     * @returns {Array<Number>}
     */
    const shuffle = max => {
        let ret = [];
        let arr = [];
        for (let i = 0; i < max; i++) arr.push(i);
        while (max > 0) {
            let ran = parseInt(Math.random() * max);
            ret.push(arr.splice(ran, 1)[0]);
            max--;
        }
        return ret;
    }

    useEffect(() => {
        shuffleTeams();
    }, [])

    return (
        <div className="window-bg">
            <div className="team-create-window">
                <h1>create Teams</h1>
                <h2>Team A</h2>
                <div></div>
                <h2>Team B</h2>
                <div className="team-create-window-panel team-a">
                    <lu className="small-list">
                        {props.eventPlayerList?.filter(a => a.team === 0).map(a => 
                            <li>
                                <div>
                                    {a.username}
                                </div>
                                {props.isMod?
                                    <div 
                                        className="arrow-right arrow-right-click"
                                        onClick={() => switchTeam(a.playerId)}
                                    ></div>
                                :
                                    <div></div>
                                }
                            </li>
                        )}
                    </lu>
                </div>
                {props.isMod?
                    <div className="mod-menu-button" onClick={shuffleTeams}>
                        <img src={randomIcon}></img>
                    </div>
                :
                    <div></div>
                }
                <div className="team-create-window-panel team-b">
                    <lu className="small-list">
                        {props.eventPlayerList?.filter(a => a.team === 1).map(a =>
                            <li style={reverseStyle}>
                                {props.isMod?
                                    <div 
                                        className="arrow-left arrow-left-click"
                                        onClick={() => switchTeam(a.playerId)}
                                    ></div>
                                :
                                    <div></div>
                                }
                                <div>
                                    {a.username}
                                </div>
                            </li>
                        )}

                    </lu>
                </div>
            </div>
            {props.isMod?
                <div className="buttom-right-button">
                    <MainButton text="Start" onClick={props.confirmCallback}></MainButton>
                </div>
            :''}
        </div>
    );
}

export default TeamCreateWindow