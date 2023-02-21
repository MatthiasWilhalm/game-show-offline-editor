import Scoreboard from "./Scoreboard";

const ScoreboardWindow = props => {


    return (
        <div className="window-bg">
            <Scoreboard {...props}></Scoreboard>
        </div>
    );
}

export default ScoreboardWindow