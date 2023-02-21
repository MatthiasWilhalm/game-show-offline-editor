import React, { Component, useState, useEffect, useRef, createRef, forwardRef, useImperativeHandle, useReducer } from 'react';

import {
    BrowserRouter as Router,
    Link,
    useHistory
} from "react-router-dom";
import MainButton from '../MainButton';

const CenteredPane = forwardRef((props, ref) => {

    const { title, subtitle, children, overwriteStyle, onClick } = props;


    console.log('overwriteStyle', overwriteStyle);
    return (
        <div 
            style={overwriteStyle}
            className="centered-pane"
            onClick={onClick}
        >
            {title && <h1>{title}</h1>}
            {subtitle && <h3>{subtitle}</h3>}
            {children}
        </div>
    );
});

export default CenteredPane;