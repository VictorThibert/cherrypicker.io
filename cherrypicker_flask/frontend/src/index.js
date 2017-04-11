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
      <div className="container-card" id="container-shot">
        <Shotchart/>
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


