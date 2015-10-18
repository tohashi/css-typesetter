import React from 'react';

import TextStore from '../stores/textStore';
import SettingAction from '../actions/settingAction';

export default class Setting extends React.Component {
  constructor() {
    super(...arguments);
    this.textChangeHandler = this.handleTextChange.bind(this);
    this.state = { text: TextStore.texts };
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
    SettingAction.add(
      { key: 'draggable-3', x: 0, y: 0, value: 'test' }
    );
  }

  render() {
    return (
      <div className="setting">
        <ul>
          <li>x<input /></li>
          <li>y<input /></li>
          <li>value<input /></li>
          <li>class<input /></li>
        </ul>
        <button onClick={this.handleAddText.bind(this)}>add</button>
      </div>
    );
  }
}

