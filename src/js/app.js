import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import _ from 'lodash';

import Setting from './components/setting';
import TextStore from './stores/textStore';
import TextAction from './actions/textAction';

class DocEditor extends React.Component {
  get defaultTextParams() {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      value: '',
      key: '',
      fontSize: 12,
      scale: 1
    };
  }

  constructor() {
    super(arguments);
    this.textChangeHandler = this.handleTextChange.bind(this);
    this.state = {
      previewWidth: 720,
      previewHeight: 0,
      imageWidth: 0,
      imageHeight: 0,
      textParams: _.clone(this.defaultTextParams),
      texts: TextStore.texts
    }
  }

  componentDidMount() {
    const img = document.createElement('img');
    img.src = './src/img/sample.png';
    img.onload = ((e) => {
      this.setState({
        imageWidth: e.target.width,
        imageHeight: e.target.height,
        previewHeight: ((this.state.previewWidth / e.target.width) * e.target.height) || 0
      });
    });
    TextStore.addChangeListener(this.textChangeHandler);
  }

  componentWillUnmount() {
    TextStore.removeListener(this.textChangeHandler);
  }

  isCurrentText(key) {
    return key === this.state.textParams.key;
  }

  handleTextChange() {
    this.setState({ texts: TextStore.texts });
  }

  handleStop(key) {
    const text = TextStore.findText(key);
    text.x = this.refs[key].state.clientX;
    text.y = this.refs[key].state.clientY;
    TextAction.update(text);
  }

  handleSelectText(key) {
    const text = TextStore.findText(key);
    this.setState((state) => {
      if (text) {
        state.textParams = text;
      } else {
        state.textParams = _.clone(this.defaultTextParams);
      }
      return state;
    });
  }

  handleInputChange(key, value) {
    this.setState((state) => {
      state.textParams[key] = value;
      return state;
    }, () => {
      if (TextStore.exists(this.state.textParams.key)) {
        this.handleUpdateText();
      }
    });
  }

  handleUpdateText() {
    const text = _.clone(this.state.textParams);
    if (!text.key || !text.value) {
      return;
    }
    const exists = TextStore.exists(text.key);
    TextAction.update(text);
    if (!exists) {
      this.setState({ textParams: _.clone(this.defaultTextParams) });
    }
  }

  changePreviewWidth(e) {
    const previewWidth = e.target.parentElement.querySelector('input').value - 0
    const prevZoom = this.state.previewWidth / this.state.imageWidth;
    const nextZoom = previewWidth / this.state.imageWidth;
    this.setState({
      previewWidth,
      previewHeight: nextZoom * this.state.imageHeight 
    });
    TextAction.changeZoom(1 / (prevZoom / nextZoom));
  }

  handleUndo() {
    TextAction.undo();
  }

  handleRedo() {
    TextAction.redo();
  }

  render() {
    const imageStyle = {
      width: `${this.state.previewWidth}px`,
      height: `${this.state.previewHeight}px`
    };

    return (
      <div className="doc-style-editor">
        <div className="doc-wrapper">
          <div className="doc-image" style={imageStyle}>
            {(() => {
              return this.state.texts.map((text, i) => {
                const textStyle = {
                  width: text.width || 'auto',
                  height: text.height || 'auto',
                  fontSize: `${text.fontSize}px`,
                  transform: `scale(${text.scale})`
                };
                let className = 'draggable-text';
                if (this.isCurrentText(text.key)) {
                  className += ' selected';
                  textStyle.zIndex = 1;
                }

                return (
                  <Draggable
                    ref={text.key}
                    key={text.key}
                    axis="both"
                    start={{ x: Number(text.x), y: Number(text.y) }}
                    moveOnStartChange={true}
                    onStop={this.handleStop.bind(this, text.key)}>
                    <div
                      className={className}
                      style={textStyle}
                      onClick={this.handleSelectText.bind(this, text.key)} >
                      {text.value}
                    </div>
                  </Draggable>
                );
              });
            })()}
          </div>

          <Setting
            text={this.state.textParams}
            texts={this.state.texts}
            previewWidth={this.state.previewWidth}
            handleUndo={this.handleUndo.bind(this)}
            handleRedo={this.handleRedo.bind(this)}
            changePreviewWidth={this.changePreviewWidth.bind(this)}
            handleInputChange={this.handleInputChange.bind(this)}
            handleUpdateText={this.handleUpdateText.bind(this)}
            handleSelectText={this.handleSelectText.bind(this)} />
        </div>

        <div className="result">
          {(() => {
            return this.state.texts.map((text, i) => {
              return (
                <p key={text.key}>{`.${text.key} { left: ${text.x}px; top: ${text.y}px; width: ${text.width}px; height: ${text.height}; font-size: ${text.fontSize}px; transform: scale(${text.scale}); }`}</p>
              );
            });
          })()}
        </div>

      </div>
    );
  }
}

ReactDOM.render(<DocEditor />, document.getElementById('root'));

