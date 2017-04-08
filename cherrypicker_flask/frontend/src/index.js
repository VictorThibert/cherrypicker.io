/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';

import Chart from './components/Chart'


// const mountingPoint = document.createElement('div');
// mountingPoint.className = 'react-app';
// document.body.appendChild(mountingPoint);
// ReactDOM.render(<Chart/>, mountingPoint);


ReactDOM.render(
    <div>
        <Chart/>
    </div>,
    document.getElementById('root')
);
