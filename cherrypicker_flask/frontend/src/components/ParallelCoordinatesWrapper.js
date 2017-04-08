import React from 'react';
import rd3 from 'react-d3-library';
import Parallelcoordinates from './Parallelcoordinates.js';

const RD3Component = rd3.Component;

export default React.createClass({

  getInitialState: function() {
    return {d3: ''}
  },

  componentDidMount: function() {
    this.setState({d3: Parallelcoordinates});
  },

  render: function() {
    return (
      <div>
        <RD3Component data={this.state.d3} />
      </div>
    )
  }
});