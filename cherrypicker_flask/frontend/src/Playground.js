import React from 'react';

var MessageComponent = React.createClass({
  render() {
    return (
      <div>{"hello: " + this.props.message}</div>
    );
  }
});

export default MessageComponent