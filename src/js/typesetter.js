import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TextAction from './actions/textAction';

class Typesetter extends React.Component {
  render() {
    const { texts, actions } = this.props;
    return (
      <div>texts</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    texts: state.texts
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TextAction, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Typesetter);

