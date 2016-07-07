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

  findText(key) {
    return this.props.text.texts.find((text) => {
      return text.key === key;
    });
  }

  getMaxId(prefix) {
    const re = new RegExp('^' + prefix + '(\\d+)');
    return this.props.text.texts.map((text) => {
      return +(re.exec(text.key)[1]);
    }).reduce(function(x, y) {
      return (x > y) ? x : y;
    }, 0);
  }

  handleSelectText(key) {
    const text = this.findText(key);
    this.setState((state) => {
      if (text && (text.key !== state.edittingText.key ||
            text.key === state.draggingKey)) {
        state.edittingText = text;
      } else {
        state.edittingText = this.props.text.getDefaultParams();

        const re = new RegExp('^(\\D+-)\\d+');
        const prefix = re.exec(state.edittingText.key)[1];
        state.edittingText.key = prefix + (this.getMaxId(prefix) + 1);
      }
      state.draggingKey = null;
      return state;
    });
  }

  handleUpdateText(originalKey) {
    const text = this.state.edittingText;
    if (!text.key || !text.value) {
      return;
    }
    this.props.actions.updateText(text, originalKey);
    if (!this.findText(originalKey)) {
      var edittingText = this.props.text.getDefaultParams();

      const re = new RegExp('^(\\D+-)(\\d+)');
      const result = re.exec(text.key);
      edittingText.key = result[1] + (Math.max(this.getMaxId(result[1]), result[2]) + 1);
      this.setState({ edittingText: edittingText });
    }
  }

  handleUpdateTextParams(params, cb) {
    const originalKey = this.state.edittingText.key || params.key;
    this.setState({
      edittingText: _.extend({}, this.state.edittingText, params)
    }, () => {
      if (!!this.findText(originalKey)) {
        this.handleUpdateText(originalKey);
      } else if (_.isFunction(cb)) {
        cb();
      }
    });
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
            findText={this.findText.bind(this)}
            imageClassName="doc-image"
            textClassName="text-block"
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

