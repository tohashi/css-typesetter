import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import _ from 'lodash';

import TextStore from '../stores/textStore';
import SettingAction from '../actions/settingAction';

export default class Setting extends React.Component {
  get defaultTextParams() {
    return {
      x: 0,
      y: 0,
      value: '',
      key: '',
      fontSize: 12
    };
  }

  constructor() {
    super(...arguments);
    this.textChangeHandler = this.handleTextChange.bind(this);
    this.linkState = LinkedStateMixin.linkState;
    this.state = _.extend({
      texts: TextStore.texts
    }, this.defaultTextParams);
  }

  componentDidMount() {
    TextStore.addChangeListener(this.textChangeHandler);
  }

  componentWillUnmount() {
    TextStore.removeListener(this.textChangeHandler);
  }

  handleTextChange() {
    this.setState({ texts: TextStore.texts });
  }

  handleAddText() {
    SettingAction.add(_.pick.apply(_, [this.state].concat(Object.keys(this.defaultTextParams))));
  }

  render() {
    return (
      <div className="setting">
        <ul>
          <li>x<input valueLink={this.linkState('x')} /></li>
          <li>y<input valueLink={this.linkState('y')} /></li>
          <li>font-size<input valueLink={this.linkState('fontSize')} /></li>
          <li>value<input valueLink={this.linkState('value')} /></li>
          <li>key<input valueLink={this.linkState('key')} /></li>
        </ul>
        <button onClick={this.handleAddText.bind(this)}>add</button>
      </div>
    );
  }
}

