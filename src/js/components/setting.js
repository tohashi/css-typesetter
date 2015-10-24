import React from 'react';
import LinkedStateMixin from 'react-addons-linked-state-mixin';

import TextStore from '../stores/textStore';
import SettingAction from '../actions/settingAction';

export default class Setting extends React.Component {
  constructor() {
    super(...arguments);
    this.linkState = LinkedStateMixin.linkState;
    this.inputChangeHandler = this.handleInputChange.bind(this);
  }

  isCurrentText(key) {
    return key === this.props.text.key;
  }

  handleRemoveText(key) {
    SettingAction.remove(this.props.text.key);
    this.props.handleSelectText(null);
  }

  handleCopyText(key) {
    SettingAction.copy(this.props.text.key);
    this.props.handleSelectText(null);
  }

  handleSelectText(key) {
    this.props.handleSelectText(
      this.isCurrentText(key) ? null : key
    );
  }

  handleInputChange(e) {
    this.props.handleInputChange(e.target.name, e.target.value);
  }

  render() {
    return (
      <div className="setting">
        <div>
          previewWidth<input value={this.props.previewWidth} onChange={this.props.changePreviewWidth} />
        </div>
        <ul>
          <li>x<input name="x" value={this.props.text.x} onChange={this.inputChangeHandler} /></li>
          <li>y<input name="y" value={this.props.text.y} onChange={this.inputChangeHandler} /></li>
          <li>width<input name="width" value={this.props.text.width} onChange={this.inputChangeHandler} /></li>
          <li>height<input name="height" value={this.props.text.height} onChange={this.inputChangeHandler} /></li>
          <li>font-size<input name="fontSize" value={this.props.text.fontSize} onChange={this.inputChangeHandler} /></li>
          <li>value<input name="value" value={this.props.text.value} onChange={this.inputChangeHandler} /></li>
          <li>key<input name="key" value={this.props.text.key} onChange={this.inputChangeHandler} /></li>
        </ul>
        {(() => {
          if (!TextStore.exists(this.props.text.key)) {
            return (
              <button onClick={this.props.handleUpdateText}>add</button>
            );
          }
          return (
            <div>
              <button onClick={this.handleCopyText.bind(this)}>copy</button>
              <button onClick={this.handleRemoveText.bind(this)}>remove</button>
            </div>
          );
        }())}

        <ul className="text-list">
          {(() => {
            return this.props.texts.map((text) => {
              let className = 'text-item'
              if (this.isCurrentText(text.key)) {
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

