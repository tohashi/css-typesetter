import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import TextStore from './stores/textStore';
import TextAction from './actions/textAction';
import DocImage from './components/doc_image';
import Setting from './components/setting';
import PublishArea from './components/publishArea';

class DocEditor extends React.Component {
  constructor(props) {
    super(props);
    this.textChangeHandler = this.handleTextChange.bind(this);
    this.state = {
      textParams: TextStore.defaultParams,
      texts: TextStore.texts
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
    const currentKey = this.state.textParams.id;
    const newTextParams = _.cloneDeep(TextStore.findText(currentKey)) ||
      this.state.textParams;

    this.setState({
      textParams: newTextParams,
      texts
    }, () => {
      texts.forEach((text) => {
        this.refs.docImage.refs[text.id].setState({
          clientX: text.x,
          clientY: text.y
        });
      });
    });
  }

  handleStop(id) {
    const text = TextStore.findText(id);
    text.x = this.refs.docImage.refs[text.id].state.clientX;
    text.y = this.refs.docImage.refs[text.id].state.clientY;
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

  render() {
    return (
      <div className="typesetter">
        <div className="doc-wrapper">
          <DocImage
            ref="docImage"
            text={this.state.textParams}
            texts={this.state.texts}
            handleStop={this.handleStop.bind(this)}
            handleSelectText={this.handleSelectText.bind(this)}
          />

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

