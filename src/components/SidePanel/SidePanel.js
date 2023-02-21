import React, { Component, useState, useEffect, useRef, createRef, forwardRef, useImperativeHandle, useReducer } from 'react';

import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";
import MainButton from '../MainButton';

const SidePanel = forwardRef((props, ref) => {

    return (
        <div className="side-panel" style={{right: props.show ? 0 : '-350px'}}>

            {props.content}

            <div className="side-panel-footer">
                {props.footerOverride ? props.footerOverride : (
                    <MainButton
                        text="Close"
                        onClick={props.onClose}
                    />
                )}
            </div>

        </div>
    );
});

export default SidePanel