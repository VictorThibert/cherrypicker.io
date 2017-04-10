import React from 'react';
import rd3 from 'react-d3-library';
import Shotchart from './Shotchart.js';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import ChildTest from './ChildTest'

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
const RD3Component = rd3.Component;
let ref;

class SCWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {d3: ''};
    this.updateChild = this.updateChild.bind(this);
  }

  componentDidMount() {
    this.setState({d3: Shotchart().node});
  }

  updateChild() {
    // Explicitly updateChild the text input using the raw DOM API
    console.log(this.containerForRef)
    console.log(this.containerForRef2)
    this.containerForRef.randomFunction();
  }

  render() {
    return (
        <div>

          <ChildTest ref={(input) => { this.containerForRef2 = input; }}/>
          <RD3Component data={this.state.d3} test-prop={10} ref={(input) => { this.containerForRef = input; }}/>
          <div id="shot-sliders">
            <div className="shot-sliders">
              <Range defaultValue={[3, 30]} onChange={this.updateChild}/>
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
}

export default SCWrapper;