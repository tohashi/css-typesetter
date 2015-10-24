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
    this.linkState = LinkedStateMixin.linkState;
    this.state = _.clone(this.defaultTextParams);
  }

  handleAddText() {
    if (!this.state.key || !this.state.value) {
      return;
    }
    SettingAction.add(_.pick.apply(_, [this.state].concat(Object.keys(this.defaultTextParams))));
  }

  handleRemoveText(key) {
    SettingAction.remove(this.props.currentTextKey);
    this.props.handleSelectText(null);
  }

  handleSelectText(key) {
    this.props.handleSelectText(key);
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
        {(() => {
          if (!this.props.currentTextKey) {
            return (
              <button onClick={this.handleAddText.bind(this)}>add</button>
            );
          }
          return (
            <button onClick={this.handleRemoveText.bind(this)}>remove</button>
          );
        }())}

        <ul className="text-list">
          {(() => {
            return this.props.texts.map((text) => {
              let className = 'text-item'
              if (text.key === this.props.currentTextKey) {
                className += ' selected';
              }
              return (
                <li
                  className={className}
                  key={text.key}
                  onClick={this.handleSelectText.bind(this, text.key)} >
                  {text.key}
                </li>
              );
            });
          }())}
        </ul>
      </div>
    );
  }
}

