import React from 'react';
import rd3 from 'react-d3-library';
import Shotchart from './Shotchart.js';

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
        </div>
    )
  }
});