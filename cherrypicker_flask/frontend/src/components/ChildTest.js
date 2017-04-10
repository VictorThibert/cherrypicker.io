import React from 'react';

class ChildTest extends React.Component {
  randomFunction() {
    console.log('clicked');
  }

  render() {
    return (
      <h1>Hello</h1>
    );
  }
}

export default ChildTest