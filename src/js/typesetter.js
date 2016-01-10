import React from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TextAction from './actions/text';
import SettingAction from './actions/setting';
import HistoryAction from './actions/history';
import Dropzone from 'react-dropzone';
import DocImage from './components/docImage';
import SettingPanel from './components/settingPanel';

class Typesetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggingKey: null,
      edittingText: this.props.text.getDefaultParams()
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
    const { text, setting, actions } = this.props;
    const texts = text.texts;
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
            {...this.props}
            edittingText={this.state.edittingText}
            handleDrag={_.throttle(this.handleDrag.bind(this), 500)}
            handleSelectText={this.handleSelectText.bind(this)}
            handleUpdateText={this.handleUpdateText.bind(this)}
            handleUpdateTextParams={this.handleUpdateTextParams.bind(this)}
          />
          <SettingPanel
            {...this.props}
            edittingText={this.state.edittingText}
            imageClassName="doc-image"
            textClassName="text-block"
            handleSelectText={this.handleSelectText.bind(this)}
            handleUpdateText={this.handleUpdateText.bind(this)}
            handleInputChange={this.handleUpdateTextParams.bind(this)}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    text: state.text,
    setting: state.setting
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(_.extend({},
      TextAction,
      SettingAction,
      HistoryAction
    ), dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Typesetter);

