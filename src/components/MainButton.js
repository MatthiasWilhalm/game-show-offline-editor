const MainButton = props => {
    return (
        <button 
            onClick={e => props.onClick?.(e)}
            className={"main-button "+(props.className ?? "")}
            style={props.style}
        >
            {props.text}
        </button>
    );
}

export default MainButton