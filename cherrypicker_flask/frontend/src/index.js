/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router'

import Datagrid from './components/Datagrid'
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
            <div id="sub-container-labels">
                <div id="sub-container-label1">Percentage</div>
                <div id="sub-container-label2">Volume</div>
                <div id="sub-container-label3">Distance</div>
            </div>
            </div>
            
            <div className="container-card" id="roster">
                <h1 id="rosterText">Calendar</h1>
                    <div id="calendar" width="500px"></div>
            </div>
        </div>

        <div id="row2">
            <div className="container-card">
                <ParallelCoordinates/>
                <div id="datagrid">
                    <Datagrid/>
                </div>
            </div>
        </div>        
        
    </div>,
    document.getElementById('root')
);


