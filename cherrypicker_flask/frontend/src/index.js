/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';

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
            
            {/*<div className="container-card" id="roster">
                <h1 id="rosterText">Roster</h1>
                    <table id = "rosterTable">
                    <tr>
                        <td id ="Roster1"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text  alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"  >1</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster2"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"  >2</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster3"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >3</text>
                                </svg>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td id ="Roster4"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >4</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster5"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >5</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster6"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >6</text>
                                </svg>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td id ="Roster7"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >7</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster8"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >8</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster9"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >9</text>
                                </svg>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td id ="Roster10"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >10</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster11"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >11</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster12"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >12</text>
                                </svg>
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td id ="Roster13"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >13</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster14"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >14</text>
                                </svg>
                            </a>
                        </td>
                        <td id ="Roster15"><a className="neutral" data-player="0" data-playerID="00">
                                <svg height="15" width="90%" >
                                     <text alignmentBaseline="ideographic" x="50%" textAnchor="middle"  y="15"   >15</text>
                                </svg>
                            </a>
                        </td>
                    </tr>
                </table>
                <h1 id="rosterText">Calendar</h1>
                    <div id="calendar" width="500px"></div>
            </div>*/}
        </div>

        <div id = "row2">
            <div className="container-card">
                <ParallelCoordinates/>
                <div id="grid"></div>
            </div>
        </div>        
        
    </div>,
    document.getElementById('root')
);
