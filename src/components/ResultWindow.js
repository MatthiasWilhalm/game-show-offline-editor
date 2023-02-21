import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const ResultWindow = forwardRef((props, ref) => {
    const [show, setShow] = useState(props.initShow);
    const [hiding, setHiding] = useState(false);

    const style = {

    }

    useEffect(() => {
        
    }, [show, hiding]);

    useImperativeHandle(ref, () => ({
        hideWindow() {
            hide();
        },
        showWindow() {
            if(!hiding) {
                setShow(true);
                if(props.autoHide)
                    setTimeout(() => hide(), 3000);
            }
        }
    }));

    const hide = () => {
        if(!hiding) {
            setTimeout(() => {
                setShow(false);
                setHiding(false);
            }, 250);
            setHiding(true);
        }
    }

    const renderScoreIcon = () => {
        if(props.change!==undefined) {
            if(props.change===0) {
                return null;
            } else if(props.change>0) {
                return (
                    <div className="got-score"></div>
                );
            } else {
                return (
                    <div className="lost-score"></div>
                );
            }
        }
        return null;
    }

    const getStyle = () => {
        return {"display": "none"}
    }

    return (
        <div className="window-bg" onClick={hide} style={show?null:getStyle()}>
            <h1 className={"result-window-title "+(hiding?"result-window-content-end":"")}>
                {props.title || "Round has ended"}
            </h1>
            <div className={"result-window "+(hiding?"result-window-end":"")}>
                <h3 className={hiding?"result-window-content-end":""}>
                    {props.username}
                </h3>
                <div className={"result-window-score "+(hiding?"result-window-content-end":"")}>
                    {props.score}
                    <div className="result-window-change">{(props.change>=0?"+":"")+props.change}</div>
                    {renderScoreIcon()}
                </div>
                <div className={"result-window-text "+(hiding?"result-window-content-end":"")}>
                    {props.msg}
                </div>
            </div>
        </div>
    );
});

export default ResultWindow