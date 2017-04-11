/* eslint-disable */

import React from 'react';
import rd3 from 'react-d3-library';
import Shotchart from './Shotchart.js';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import d3 from 'd3'

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const RD3Component = rd3.Component;

class SCWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {d3: ''};
    this.slide = this.slide.bind(this);
    this.slider_ranges = {percentage: [0.0, 1.0], shot_attempts: [0, 50], distance: [0,30]}
  }

  componentDidMount() {
    let capsule = Shotchart()
    console.log("CAPSULE:",capsule)
    this.setState({d3: capsule.node, brushRefresh:capsule.brush});
  }
  
  slide(sliderType, range){
    switch (sliderType) {
      case "percentage": 
        this.slider_ranges.percentage[0] = range[0];
        this.slider_ranges.percentage[1] = range[1];
        break;
      case "shot_attempts": 
        this.slider_ranges.shot_attempts[0] = range[0];
        this.slider_ranges.shot_attempts[1] = range[1];
        break;
      case "distance": 
        this.slider_ranges.distance[0] = range[0];
        this.slider_ranges.distance[1] = range[1];
        break;
    }
    
    
    d3.selectAll(".hexagon")
      .classed("hidden", (d) => {
        return !( // hide if not in between the ranges
            d.totalMade/d.totalShot >= this.slider_ranges.percentage[0] && d.totalMade/d.totalShot <= this.slider_ranges.percentage[1] &&
            d.totalShot >= this.slider_ranges.shot_attempts[0] && d.totalShot <= this.slider_ranges.shot_attempts[1] &&
            d.distance >= this.slider_ranges.distance[0] && d.distance <= this.slider_ranges.distance[1]
          ) 
      });  
    this.state.brushRefresh() // triggers the selection % to refresh as sliders move 
  }    


  

  render() {
    return (
        <div>
          <RD3Component data={this.state.d3} test-prop={10} ref={(input) => { this.containerForRef = input; }}/>
          <div id="shot-sliders">
            <div className="shot-sliders">
              <Range min={0.0} max={1.0} defaultValue={[0.0, 1.0]} step={0.01} onChange={this.slide.bind(this, "percentage")}/>
            </div>
            <div className="shot-sliders">
              <Range min={0} max={120} defaultValue={[0, 120]} onChange={this.slide.bind(this, "shot_attempts")}/>
            </div>
            <div className="shot-sliders">
              <Range min={0} max={30} defaultValue={[0, 30]} onChange={this.slide.bind(this, "distance")}/>
            </div>
          </div>
            <div id="container-percentage"></div>
            <div id="container-labels">
              <div className="shot-labels">Percentage</div>
              <div className="shot-labels">Attempts</div>
              <div className="shot-labels">Distance</div>
            </div>
        </div>

    )
  }
}

export default SCWrapper;