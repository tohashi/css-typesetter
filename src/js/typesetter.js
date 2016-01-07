import React from 'react';
import _ from 'lodash';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TextAction from './actions/textAction';
import Dropzone from 'react-dropzone';

class Typesetter extends React.Component {
  handleDrop() {
  }

  handleChangePreviewWidth() {
  }

  render() {
    const { texts, setting, actions } = this.props;
    return (
      <div className="typesetter">
        <div className="doc-wrapper">
          <Dropzone className="image-dropzone" onDrop={this.handleDrop.bind(this)}>
            <div>Try dropping an image here, or click to select an image to upload.</div>
          </Dropzone>
          <div>
            width: <input value={setting.previewWidth} onChange={this.handleChangePreviewWidth.bind(this)} />
          </div>
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
    actions: _.extend({},
      bindActionCreators(TextAction, dispatch)
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Typesetter);

