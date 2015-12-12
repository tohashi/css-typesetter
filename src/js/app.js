import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import _ from 'lodash';

import TextStore from './stores/textStore';
import TextAction from './actions/textAction';
import Setting from './components/setting';
import PublishArea from './components/publishArea';

class DocEditor extends React.Component {
  constructor() {
    super();
    this.textChangeHandler = this.handleTextChange.bind(this);
    this.state = {
      previewWidth: 720,
      previewHeight: 0,
      imageWidth: 0,
      imageHeight: 0,
      textParams: TextStore.defaultParams,
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
        previewHeight: Math.round((this.state.previewWidth / e.target.width) * e.target.height) || 0
      });
      this.drawCanvas(img);
    });
    TextStore.addChangeListener(this.textChangeHandler);
  }

  componentWillUnmount() {
    TextStore.removeListener(this.textChangeHandler);
  }

  drawCanvas(img) {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, this.state.imageWidth, this.state.imageHeight);
    const imageData = ctx.getImageData(0, 0, this.state.imageWidth, this.state.imageHeight);
    const data = imageData.data;
    const threshold = 230;
    const len = data.length

    const rectangles = [];
    const _rectangles = [];

    for (let i = 0; i < len; i += 4) {
      if (data[i + 3] > 0 && (data[i] + data[i + 1] + data[i + 2]) < (threshold * 3)) {
        data[i] = data[i + 1] = data[i + 2] = 0;
        data[i + 3] = 255;
      } else {
        data[i] = data[i + 1] = data[i + 2] = data[i + 3] = 255;
      }
    }
    this.setState({ imageData });
    // ctx.putImageData(imageData, 0, 0);
    ctx.clearRect(0, 0, this.state.imageWidth, this.state.imageHeight);
  }

  handleClickCanvas(e) {
    const rect = {};
    const zoom = this.state.previewWidth / this.state.imageWidth;
    const x = Math.round((e.pageX - 10) / zoom);
    const y = Math.round((e.pageY - 10) / zoom);
    const baseDataIdx = (x + y * this.state.imageWidth) * 4;
    const data = this.state.imageData.data;
    let dataIdx = baseDataIdx;
    let scanning = true;

    while (scanning) {
      let toX = data[dataIdx - 4] > 0;
      let toY = data[dataIdx - this.state.imageData.width * 4] > 0;
      let toD = data[dataIdx - 4 - this.state.imageData.width * 4] > 0;
      if (toD) {
        dataIdx = dataIdx - 4 - this.state.imageData.width * 4;
      } else if (toX) {
        dataIdx = dataIdx - 4;
      } else if (toY) {
        dataIdx = dataIdx - this.state.imageData.width * 4;
      } else {
        scanning = false;
      }
    }
    rect.x = (dataIdx / 4) % this.state.imageData.width;
    rect.y = Math.floor((dataIdx / 4) / this.state.imageData.width);

    dataIdx = baseDataIdx;
    scanning = true;
    while (scanning) {
      let toX = data[dataIdx + 4] > 0;
      let toY = data[dataIdx + this.state.imageData.width * 4] > 0;
      let toD = data[dataIdx + 4 + this.state.imageData.width * 4] > 0;
      if (toD) {
        dataIdx = dataIdx + 4 + this.state.imageData.width * 4;
      } else if (toX) {
        dataIdx = dataIdx + 4;
      } else if (toY) {
        dataIdx = dataIdx + this.state.imageData.width * 4;
      } else {
        scanning = false;
      }
    }

    rect.w = (dataIdx / 4) % this.state.imageData.width - rect.x;
    rect.h = Math.floor((dataIdx / 4) / this.state.imageData.width) - rect.y;
    console.log(rect);

    const ctx = this.refs.canvas.getContext('2d');
    ctx.strokeStyle = '#f00';
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.closePath();
  }

  isCurrentText(id) {
    return id === this.state.textParams.id;
  }

  handleTextChange() {
    const texts = TextStore.texts;
    const currentKey = this.state.textParams.id;
    const newTextParams = _.cloneDeep(TextStore.findText(currentKey)) ||
      this.state.textParams;

    this.setState({
      textParams: newTextParams,
      texts
    }, () => {
      texts.forEach((text) => {
        this.refs[text.id].setState({
          clientX: text.x,
          clientY: text.y
        });
      });
    });
  }

  handleStop(id) {
    const text = TextStore.findText(id);
    text.x = this.refs[id].state.clientX;
    text.y = this.refs[id].state.clientY;
    TextAction.update(text);
  }

  handleSelectText(id) {
    const text = TextStore.findText(id);
    this.setState((state) => {
      if (text) {
        state.textParams = text;
      } else {
        state.textParams = TextStore.defaultParams;
      }
      return state;
    });
  }

  handleInputChange(id, value) {
    this.setState((state) => {
      state.textParams[id] = value;
      return state;
    }, () => {
      if (TextStore.exists(this.state.textParams.id)) {
        this.handleUpdateText();
      }
    });
  }

  handleUpdateText() {
    const text = this.state.textParams;
    if (!text.key || !text.value) {
      return;
    }
    const exists = TextStore.exists(text.id);
    TextAction.update(text);
    if (!exists) {
      this.setState({ textParams: TextStore.defaultParams });
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

  createDraggableInner(text) {
    const textStyle = {
      width: text.width || 'auto',
      height: text.height || 'auto',
      fontSize: text.fontSize,
      transform: `scale(${text.scale})`,
      lineHeight: text.lineHeight ? `${text.lineHeight}px` : 'inherit',
      letterSpacing: text.letterSpacing ? `${text.letterSpacing}` : 'inherit',
      textAlign: text.textAlign
    };
    let className = 'draggable-text';
    if (this.isCurrentText(text.id)) {
      className += ' selected';
      textStyle.zIndex = 1;
    }
    if (text.split) {
      return (
        <ul
          className={className}
          style={textStyle}
          onClick={this.handleSelectText.bind(this, text.id)}
        >
          {(() => {
            return `${text.value}`.split('').map((char, i) => {
              return <li className="split-char" key={`${text.value}-${i}`}>{char}</li>;
            });
          })()}
        </ul>
      );
    }
    return (
      <div
        className={className}
        style={textStyle}
        onClick={this.handleSelectText.bind(this, text.id)}
      >
        {text.value}
      </div>
    );
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
            <canvas
              ref="canvas"
              width={this.state.imageWidth}
              height={this.state.imageHeight}
              style={{width: `${this.state.previewWidth}px`, height: `${this.state.previewHeight}px`}}
              onClick={this.handleClickCanvas.bind(this)}
            />
            {(() => {
              return this.state.texts.map((text, i) => {
                return (
                  <Draggable
                    ref={text.id}
                    key={text.id}
                    axis="both"
                    start={{ x: Number(text.x), y: Number(text.y) }}
                    moveOnStartChange={true}
                    onStop={this.handleStop.bind(this, text.id)}
                  >
                    {this.createDraggableInner(text)}
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

        <PublishArea texts={this.state.texts} />
      </div>
    );
  }
}

ReactDOM.render(<DocEditor />, document.getElementById('root'));

