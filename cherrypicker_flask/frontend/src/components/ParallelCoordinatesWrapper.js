import React from 'react';
import rd3 from 'react-d3-library';
import ParallelCoordinates from './ParallelCoordinates.js';
import Datagrid from './Datagrid.js'

const RD3Component = rd3.Component;

class PCWrapper extends React.Component {

  constructor(props){
    console.log("PCWrapper props:", props);
    super(props);
    this.state = {d3: ''};
  }

  componentDidMount() {
    this.setState({d3: ParallelCoordinates().node});
  }

  randomize(){
    let rand = Math.floor((Math.random() * 10) );
    this.setState({d3: ParallelCoordinates("161061274" + rand).node});
  }

  render(){ 
    console.log("State before render: ", this.state.d3)
    return (
      <div>
        <button onClick={() => this.randomize()}>Randomize this shit + {Math.floor(10*Math.random())}</button>
        <RD3Component data={this.state.d3} />
        <div id="datagrid">
          <Datagrid/>
        </div>
      </div>
    )
  }

}


export default PCWrapper