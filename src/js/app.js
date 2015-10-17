import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

class DocEditor extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      previewWidth: 720,
      previewHeight: 0
    }
  }

  componentDidMount() {
    const img = document.createElement('img');
    img.src = './src/img/sample.png';
    img.onload = ((e) => {
      this.setState({
        previewHeight: ((this.state.previewWidth/ e.target.width) * e.target.height) || 0
      });
    });
  }

  render() {
    const style = {
      width: `${this.state.previewWidth}px`,
      height: `${this.state.previewHeight}px`
    };

    return (
      <div>
        <div className="doc-image" style={style}>
          <Draggable
            axis="both"
            start={{ x: 0, y: 0 }}>

            <div>testtest</div>
          </Draggable>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<DocEditor />, document.getElementById('root'));

