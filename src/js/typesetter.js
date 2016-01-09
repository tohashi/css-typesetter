import React from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TextAction from './actions/text';
import SettingAction from './actions/setting';
import Dropzone from 'react-dropzone';
import DocImage from './components/docImage';

class Typesetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingKey: null
    };
  }

  handleChangePreviewWidth(e) {
    const previewWidth = e.target.value - 0;
    this.props.actions.setPreviewWidth(previewWidth);
  }

  handleDrag(key) {
    if (this.state.draggingKey !== key) {
      this.setState({ draggingKey: key });
    }
  }

  handleStopDragging(key) {
    const params = {
      key,
      x: this.refs.docImage.refs[key].state.clientX,
      y: this.refs.docImage.refs[key].state.clientY
    }
    this.props.actions.updateText(params);
  }

  handleSelectText(key) {
    // TODO
  }

  handleImageLoaded(e, cb) {
    this.setState({
      imageWidth: e.target.width,
      imageHeight: e.target.height,
      previewHeight: Math.round((this.state.previewWidth / e.target.width) * e.target.height) || 0
    }, cb);
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

  render() {
    const { texts, setting, actions } = this.props;
    if (!setting.imagePath) {
      return (
        <div className="typesetter">
          <div className="doc-wrapper">
            <Dropzone className="image-dropzone" onDrop={actions.setImagePath}>
              <div>Try dropping an image here, or click to select an image to upload.</div>
            </Dropzone>
            <div>
              width: <input value={setting.previewWidth} onChange={this.handleChangePreviewWidth.bind(this)} />
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
            imagePath={setting.imagePath}
            previewWidth={setting.previewWidth}
            previewHeight={setting.previewHeight}
            imageWidth={setting.imageWidth}
            imageHeight={setting.imageHeight}
            text={{}}
            texts={texts}
            handleDrag={_.throttle(this.handleDrag.bind(this), 500)}
            handleStopDragging={this.handleStopDragging.bind(this)}
            handleSelectText={this.handleSelectText.bind(this)}
            handleImageLoaded={this.handleImageLoaded.bind(this)}
            handleUpdateText={this.handleUpdateText.bind(this)}
            handleUpdateTextParams={this.handleUpdateTextParams.bind(this)}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    texts: state.text.texts,
    setting: state.setting
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.extend({},
      TextAction,
      SettingAction
    ), dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Typesetter);

