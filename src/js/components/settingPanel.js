import React from 'react';
import _ from 'lodash';
import TextStore from '../stores/textStore';
import TextAction from '../actions/textAction';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SettingTable from './settingTable';
import Publishing from './publishing';

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
    const params = {}
    params[e.target.name] = value
    this.props.handleInputChange(params);
  }

  handleClear() {
    TextAction.clear();
  }

  render() {
    const textList = (
      <div className="text-list">
        <p>texts</p>
        <ul>
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
            <Tab>parameters</Tab>
            <Tab>publishing</Tab>
          </TabList>
          <TabPanel className="tab-panel">
            <SettingTable
              text={this.props.text}
              handleChange={this.inputChangeHandler}
            />
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
            })()}
            {textList}
            <button onClick={this.handleClear.bind(this)}>clear</button>
          </TabPanel>
          <TabPanel className="tab-panel">
            <Publishing
              texts={this.props.texts}
              imageClassName={this.props.imageClassName}
              textClassName={this.props.textClassName}
              previewWidth={this.props.previewWidth}
              previewHeight={this.props.previewHeight}
            />
            {textList}
            <button onClick={this.handleClear.bind(this)}>clear</button>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

