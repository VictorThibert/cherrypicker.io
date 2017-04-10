/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

import ParallelCoordinates from './components/ParallelCoordinatesWrapper'
import Shotchart from './components/ShotchartWrapper'

import './css/parallelcoordinates.css';
import './css/mainpage.css'
import './css/shotchart.css'


ReactDOM.render(
    <div id="main-container">
        <div className="container-card" id="row0">
        </div>

        <div id="row1">
        <div className="container-card" id="sub-container-shot">
            <Shotchart/>
            <div id="sub-container-percentage"></div>
            <div id="sub-container-sliders">
                <div id="sub-container-shot1"></div>
                <div id="sub-container-shot2"></div>
                <div id="sub-container-shot3"></div>
            </div>
            <div id="container-labels">
                <div className="shot-labels">Percentage</div>
                <div className="shot-labels">Volume</div>
                <div className="shot-labels">Distance</div>
            </div>
            </div>
            
            <div className="container-card" id="roster">
                <h1 id="rosterText">Calendar</h1>
                <div id="calendar" width="500px"></div>
            </div>
        </div>

        <div id="row2">
            <div className="container-card">
                <ParallelCoordinates testprop={1235}/>
            </div>
        </div>        
        
    </div>,
    document.getElementById('root')
);


