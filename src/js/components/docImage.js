import React from 'react';
import Draggable from 'react-draggable';

export default class DocImage extends React.Component {
  get imageStyle() {
    const setting = this.props.setting;
    return {
      width: `${setting.previewWidth}px`,
      height: `${setting.previewHeight}px`,
      backgroundImage: `url(${setting.imagePath})`
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      imageData: {}
    }
  }

  componentDidMount() {
    const img = document.createElement('img');
    img.src = this.props.setting.imagePath;
    img.onload = ((e) => {
      this.props.actions.setImageSize(img);
      this.drawCanvas(img);
    });
  }

  handleStopDragging(key) {
    const params = {
      key,
      x: this.refs[key].state.clientX,
      y: this.refs[key].state.clientY
    }
    this.props.actions.updateText(params);
  }

  drawCanvas(img) {
    const setting = this.props.setting;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, setting.imageWidth, setting.imageHeight);
    const imageData = ctx.getImageData(0, 0, setting.imageWidth, setting.imageHeight);
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
    ctx.clearRect(0, 0, setting.imageWidth, setting.imageHeight);
  }



handleClickCanvas(e) {
  const setting = this.props.setting;
  const rect = {};
  const zoom = setting.previewWidth / setting.imageWidth;
  const x = Math.round((e.pageX - 10) / zoom);
  const y = Math.round((e.pageY - 10) / zoom);
  const baseDataIdx = (x + y * setting.imageWidth) * 4;
  const imageData = this.state.imageData;
  const data = imageData.data;
  let scanning = true;

  let dataIdx = this.scanEdgePoint(data, baseDataIdx, -4, imageData.width * -4);
  rect.x = (dataIdx / 4) % imageData.width;
  rect.y = Math.floor((dataIdx / 4) / imageData.width);

  dataIdx = this.scanEdgePoint(data, baseDataIdx, 4, imageData.width * 4);
  rect.w = (dataIdx / 4) % imageData.width - rect.x;
  rect.h = Math.floor((dataIdx / 4) / imageData.width) - rect.y;

  this.props.handleUpdateTextParams({
    x: Math.round(rect.x * zoom),
    y: Math.round(rect.y * zoom),
    width: Math.round(rect.w * zoom),
    height: Math.round(rect.h * zoom)
  }, this.props.handleUpdateText);
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

  isCurrentText(key) {
    return key === this.props.edittingText.key;
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
    if (this.isCurrentText(text.key)) {
      className += ' selected';
      textStyle.zIndex = 1;
    }
    return (
      <div
        className={className}
        style={textStyle}
        onClick={this.props.handleSelectText.bind(this.props, text.key)}
      >
        {text.value}
      </div>
    );
  }

  render() {
    const setting = this.props.setting;
    return (
      <div className="doc-image" style={this.imageStyle}>
        <canvas
          className="doc-image-canvas"
          ref="canvas"
          width={setting.imageWidth}
          height={setting.imageHeight}
          style={{width: `${setting.previewWidth}px`, height: `${setting.previewHeight}px`}}
          onClick={this.handleClickCanvas.bind(this)}
        />
        {(() => {
          return this.props.text.texts.map((text, i) => {
            return (
              <Draggable
                ref={text.key}
                key={text.key}
                axis="both"
                start={{ x: Number(text.x), y: Number(text.y) }}
                moveOnStartChange={true}
                onDrag={this.props.handleDrag.bind(this.props, text.key)}
                onStop={this.handleStopDragging.bind(this.props, text.key)}
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
