import {
    Routes,
    Route,
    Navigate 
} from "react-router-dom";

import Editor from './Editor';


//const client = new W3CWebSocket('ws://127.0.0.1:3001');
/**
 * Hauptsächlich für das Routen zuständig
 */
const Main = () => {
    return (
        <div>
            <Routes>
                <Route exact path="/" element={<Navigate replace to="/editor"/>}></Route>
                <Route path="/editor" element={<Editor/>}></Route>
            </Routes>
        </div>
    );
}

export default Main
