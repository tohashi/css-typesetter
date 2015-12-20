import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import TextStore from './stores/textStore';
import TextAction from './actions/textAction';
import Dropzone from 'react-dropzone';
import DocImage from './components/docImage';
import SettingPanel from './components/settingPanel';

class Typesetter extends React.Component {
  constructor(props) {
    super(props);
    this.textChangeHandler = this.handleTextChange.bind(this);
    this.state = {
      previewWidth: 720,
      previewHeight: 0,
      imageWidth: 0,
      imageHeight: 0,
      textParams: TextStore.defaultParams,
      texts: TextStore.texts,
      imageUrl: null,
      draggingKey: null
    }
  }

  componentDidMount() {
    TextStore.addChangeListener(this.textChangeHandler);
  }

  componentWillUnmount() {
    TextStore.removeListener(this.textChangeHandler);
  }

  handleTextChange() {
    const texts = TextStore.texts;
    const currentKey = this.state.textParams.key;
    const newTextParams = _.cloneDeep(TextStore.findText(currentKey)) ||
      this.state.textParams;

    this.setState({
      textParams: newTextParams,
      texts
    }, () => {
      texts.forEach((text) => {
        this.refs.docImage.refs[text.key].setState({
          clientX: text.x,
          clientY: text.y
        });
      });
    });
  }

  handleDrag(key) {
    if (this.state.draggingKey !== key) {
      this.setState({ draggingKey: key });
    }
  }

  handleStopDragging(key) {
    const text = TextStore.findText(key);
    text.x = this.refs.docImage.refs[text.key].state.clientX;
    text.y = this.refs.docImage.refs[text.key].state.clientY;
    TextAction.update(text);
  }

  handleSelectText(key) {
    const text = TextStore.findText(key);
    this.setState((state) => {
      if (text && (text.key !== state.textParams.key || text.key === state.draggingKey)) {
        state.textParams = text;
      } else {
        state.textParams = TextStore.defaultParams;
      }
      state.draggingKey = null;
      return state;
    });
  }

  handleUpdateTextParams(params, cb) {
    this.setState((state) => {
      _.extend(state.textParams, params);
      return state;
    }, () => {
      if (TextStore.exists(this.state.textParams.key)) {
        this.handleUpdateText();
      } else if (_.isFunction(cb)) {
        cb();
      }
    });
  }

  handleUpdateText() {
    const text = this.state.textParams;
    if (!text.key || !text.value) {
      return;
    }
    const exists = TextStore.exists(text.key);
    TextAction.update(text);
    if (!exists) {
      this.setState({ textParams: TextStore.defaultParams });
    }
  }

  handleChangePreviewWidth(e) {
    const previewWidth = e.target.value - 0;
    this.setState({ previewWidth });
  }

  handleImageLoaded(e, cb) {
    this.setState({
      imageWidth: e.target.width,
      imageHeight: e.target.height,
      previewHeight: Math.round((this.state.previewWidth / e.target.width) * e.target.height) || 0
    }, cb);
  }

  handleUndo() {
    TextAction.undo();
  }

  handleRedo() {
    TextAction.redo();
  }

  handleDrop(files) {
    const file = files[0];
    if (!/image/.test(file.type)) {
      return;
    }
    this.setState({
      imageUrl: file.preview
    });
  }

  render() {
    if (!this.state.imageUrl) {
      return (
        <div className="typesetter">
          <div className="doc-wrapper">
            <Dropzone onDrop={this.handleDrop.bind(this)}>
              <div>Try dropping an image here, or click to select an image to upload.</div>
            </Dropzone>
            <div>
              width: <input value={this.state.previewWidth} onChange={this.handleChangePreviewWidth.bind(this)} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="typesetter">
        <div className="doc-wrapper">
          <DocImage
            ref="docImage"
            imageUrl={this.state.imageUrl}
            previewWidth={this.state.previewWidth}
            previewHeight={this.state.previewHeight}
            imageWidth={this.state.imageWidth}
            imageHeight={this.state.imageHeight}
            text={this.state.textParams}
            texts={this.state.texts}
            handleDrag={_.throttle(this.handleDrag.bind(this), 500)}
            handleStopDragging={this.handleStopDragging.bind(this)}
            handleSelectText={this.handleSelectText.bind(this)}
            handleImageLoaded={this.handleImageLoaded.bind(this)}
            handleUpdateText={this.handleUpdateText.bind(this)}
            handleUpdateTextParams={this.handleUpdateTextParams.bind(this)}
          />
          <SettingPanel
            text={this.state.textParams}
            texts={this.state.texts}
            imageClassName="doc-image"
            textClassName="text-block"
            previewWidth={this.state.previewWidth}
            previewHeight={this.state.previewHeight}
            handleUndo={this.handleUndo.bind(this)}
            handleRedo={this.handleRedo.bind(this)}
            handleInputChange={this.handleUpdateTextParams.bind(this)}
            handleUpdateText={this.handleUpdateText.bind(this)}
            handleSelectText={this.handleSelectText.bind(this)}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Typesetter />, document.getElementById('root'));

