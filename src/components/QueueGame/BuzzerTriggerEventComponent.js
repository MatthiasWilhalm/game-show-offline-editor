import { useEffect, useState } from "react";

const BuzzerTriggerEventComponent = props => {

    const [style, setStyle] = useState(null);

    useEffect(() => {
        setTimeout(() => setStyle({display: 'none'}), 3000);
    }, [style]);

    

    return (
        <div className="window-bg window-bg-animated" style={style}>
            <div className="buzzer-window">
                <h1>
                    {props.username+" has clicked"}
                </h1>
            </div>
        </div>
    );
}

export default BuzzerTriggerEventComponent