import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

import Setting from './components/setting';
import TextStore from './stores/textStore';

class DocEditor extends React.Component {
  constructor() {
    super(...arguments);
    this.textChangeHandler = this.handleTextChange.bind(this);
    this.state = {
      previewWidth: 720,
      previewHeight: 0,
      texts: TextStore.texts
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
    TextStore.addChangeListener(this.textChangeHandler);
  }

  componentWillUnmount() {
    TextStore.removeListener(this.textChangeHandler);
  }

  handleTextChange() {
    this.setState({ texts: TextStore.texts });
  }

  handleStop(key) {
    this.setState({
      texts: this.state.texts.map((text) => {
        if (text.key === key) {
          text.x = this.refs[key].state.clientX;
          text.y = this.refs[key].state.clientY;
        }
        return text;
      })
    })
  }
  render() {
    const style = {
      width: `${this.state.previewWidth}px`,
      height: `${this.state.previewHeight}px`
    };

    return (
      <div>
        <div className="doc-style-editor">
          <div className="doc-image" style={style}>
            {(() => {
              return this.state.texts.map((text, i) => {
                return (
                  <Draggable
                    ref={text.key}
                    key={text.key}
                    axis="both"
                    start={{ x: text.x, y: text.y }}
                    moveOnStartChange={true}
                    onStop={this.handleStop.bind(this, text.key)}>
                    <div>{text.value}</div>
                  </Draggable>
                );
              });
            })()}
          </div>

          <Setting />
        </div>

        <div className="result">
          {(() => {
            return this.state.texts.map((text, i) => {
              return (
                <p key={text.key}>{`.${text.key} { left: ${text.x}px; top: ${text.y}px; }`}</p>
              );
            });
          })()}
        </div>

      </div>
    );
  }
}

ReactDOM.render(<DocEditor />, document.getElementById('root'));

