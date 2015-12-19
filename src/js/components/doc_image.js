import React from 'react';
import Draggable from 'react-draggable';

export default class DocImage extends React.Component {
  get imageStyle() {
    return {
      width: `${this.state.previewWidth}px`,
      height: `${this.state.previewHeight}px`
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      previewWidth: 720,
      previewHeight: 0,
      imageWidth: 0,
      imageHeight: 0
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
  }

  drawCanvas(img) {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, this.state.imageWidth, this.state.imageHeight);
    const imageData = ctx.getImageData(0, 0, this.state.imageWidth, this.state.imageHeight);
    const data = imageData.data;
    const threshold = 230;
    const len = data.length

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

  scanEdgePoint(data, baseIdx, intervalX, intervalY) {
    let scanning = true;
    let edgeIdx = baseIdx;
    while (scanning) {
      if (data[edgeIdx + intervalX + intervalY] > 0) {
        edgeIdx += intervalX + intervalY;
      } else if (data[edgeIdx + intervalX] > 0) {
        edgeIdx += intervalX;
      } else if (data[edgeIdx + intervalY] > 0) {
        edgeIdx += intervalY;
      } else {
        scanning = false;
      }
    }
    return edgeIdx;
  }

  handleClickCanvas(e) {
    const rect = {};
    const zoom = this.state.previewWidth / this.state.imageWidth;
    const x = Math.round((e.pageX - 10) / zoom);
    const y = Math.round((e.pageY - 10) / zoom);
    const baseDataIdx = (x + y * this.state.imageWidth) * 4;
    const data = this.state.imageData.data;
    let scanning = true;

    let dataIdx = this.scanEdgePoint(data, baseDataIdx, -4, this.state.imageData.width * -4);
    rect.x = (dataIdx / 4) % this.state.imageData.width;
    rect.y = Math.floor((dataIdx / 4) / this.state.imageData.width);

    dataIdx = this.scanEdgePoint(data, baseDataIdx, 4, this.state.imageData.width * 4);
    rect.w = (dataIdx / 4) % this.state.imageData.width - rect.x;
    rect.h = Math.floor((dataIdx / 4) / this.state.imageData.width) - rect.y;

    const ctx = this.refs.canvas.getContext('2d');
    ctx.strokeStyle = '#f00';
    ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
    ctx.closePath();
    // TextAction.update(_.extend({}, this.state.textParams, {
    //   key: _.uniqueId('test'),
    //   x: rect.x * zoom,
    //   y: rect.y * zoom,
    //   width: rect.w * zoom,
    //   height: rect.h * zoom
    // }));
  }

  isCurrentText(id) {
    return id === this.props.text.id;
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
          onClick={this.props.handleSelectText.bind(this.props, text.id)}
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
        onClick={this.props.handleSelectText.bind(this.props, text.id)}
      >
        {text.value}
      </div>
    );
  }

  render() {
    return (
      <div className="doc-image" style={this.imageStyle}>
        <canvas
          ref="canvas"
          width={this.state.imageWidth}
          height={this.state.imageHeight}
          style={{width: `${this.state.previewWidth}px`, height: `${this.state.previewHeight}px`}}
          onClick={this.handleClickCanvas.bind(this)}
        />
        {(() => {
          return this.props.texts.map((text, i) => {
            return (
              <Draggable
                ref={text.id}
                key={text.id}
                axis="both"
                start={{ x: Number(text.x), y: Number(text.y) }}
                moveOnStartChange={true}
                onStop={this.props.handleStop.bind(this.props, text.id)}
              >
                {this.createDraggableInner(text)}
              </Draggable>
            );
          });
        })()}
      </div>
    );
  }
}
