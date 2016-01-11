import React from 'react';
import Draggable from 'react-draggable';

export default class DocImage extends React.Component {
  componentWillReceiveProps(nextProps) {
    this.refs.draggable.setState({
      clientX: nextProps.start.x,
      clientY: nextProps.start.y
    });
  }

  render() {
    return (
      <Draggable ref="draggable" {...this.props}>
        {this.props.children}
      </Draggable>
    );
  }
}

