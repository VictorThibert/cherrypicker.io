import React from 'react';
import rd3 from 'react-d3-library';
import Shotchart from './Shotchart.js';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
let Range = createSliderWithTooltip(Slider.Range);
const RD3Component = rd3.Component;

export default React.createClass({

  getInitialState: function() {
    return {d3: ''}
  },

  componentDidMount: function() {
    this.setState({d3: Shotchart});
  },

  render: function() {
    return (
        <div>
          <RD3Component data={this.state.d3} test-prop={10}/>
          <div id="shot-sliders">
            <div className="shot-sliders">
              <Range defaultValue={[3, 30]}/>
            </div>
            <div className="shot-sliders">
              <Range defaultValue={[3, 78]}/>
            </div>
            <div className="shot-sliders">
              <Range defaultValue={[3, 100]}/>
            </div>
          </div>
        </div>
    )
  }
});