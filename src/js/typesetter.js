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

  handleUpdateText() {
    // TODO
  }

  handleUpdateTextParams(params, cb) {
    // TODO
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
            actions={actions}
            setting={setting}
            text={{}}
            texts={texts}
            handleDrag={_.throttle(this.handleDrag.bind(this), 500)}
            handleSelectText={this.handleSelectText.bind(this)}
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
    texts: state.texts,
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

