import React from 'react';
import _ from 'lodash';
import TextStore from '../stores/textStore';
import TextAction from '../actions/textAction';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SettingTable from './settingTable';

export default class SettingPanel extends React.Component {
  constructor(props) {
    super(props);
    this.inputChangeHandler = this.handleInputChange.bind(this);
  }

  isCurrentText(key) {
    return key === this.props.text.key;
  }

  handleRemoveText(key) {
    TextAction.remove(this.props.text.key);
    this.props.handleSelectText(null);
  }

  handleCopyText(key) {
    TextAction.copy(this.props.text.key);
    this.props.handleSelectText(null);
  }

  handleSelectText(key) {
    this.props.handleSelectText(
      this.isCurrentText(key) ? null : key
    );
  }

  handleInputChange(e) {
    let value = e.target.value;
    let parsedValue = parseInt(value);
    if (e.type === 'number' && _.isNumber(parsedValue) &&
        !_.isNaN(parsedValue)) {
      value = parsedValue
    }
    this.props.handleInputChange(e.target.name, value);
  }

  render() {
    return (
      <div className="setting-panel">
        <div>
          {(() => {
            if (TextStore.undoable()) {
              return (
                <button onClick={this.props.handleUndo}>undo</button>
              );
            }
          })()}
          {(() => {
            if (TextStore.redoable()) {
              return (
                <button onClick={this.props.handleRedo}>redo</button>
              );
            }
          })()}
        </div>

        <Tabs selectedIndex={0}>
          <TabList>
            <Tab>auto</Tab>
            <Tab>manual</Tab>
          </TabList>
          <TabPanel>
            <SettingTable
              text={this.props.text}
              handleChange={this.inputChangeHandler}
            />
            {(() => {
              if (!TextStore.exists(this.props.text.key)) {
                return (
                  <button className="add-btn" onClick={this.props.handleUpdateText}>add</button>
                );
              }
              return (
                <div>
                  <button className="copy-btn" onClick={this.handleCopyText.bind(this)}>copy</button>
                  <button className="remove-btn" onClick={this.handleRemoveText.bind(this)}>remove</button>
                </div>
              );
            })()}
          </TabPanel>
          <TabPanel>
          </TabPanel>
        </Tabs>
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
          })()}
        </ul>
      </div>
    );
  }
}

