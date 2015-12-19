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

  isCurrentText(id) {
    return id === this.props.text.id;
  }

  handleRemoveText(id) {
    TextAction.remove(this.props.text.id);
    this.props.handleSelectText(null);
  }

  handleCopyText(id) {
    TextAction.copy(this.props.text.id);
    this.props.handleSelectText(null);
  }

  handleSelectText(id) {
    this.props.handleSelectText(
      this.isCurrentText(id) ? null : id
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

  handleSelect() {
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

        <Tabs onSlect={this.handleSelect.bind(this)} selectedIndex={0}>
          <TabList>
            <Tab>parameters</Tab>
            <Tab>publishing</Tab>
          </TabList>
          <TabPanel>
            <SettingTable
              text={this.props.text}
              handleChange={this.inputChangeHandler}
            />
            {(() => {
              if (!TextStore.exists(this.props.text.id)) {
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
            <Publishing
              texts={this.props.texts}
              imageClassName={this.props.imageClassName}
              textClassName={this.props.textClassName}
              previewWidth={this.props.previewWidth}
              previewHeight={this.props.previewHeight}
            />
          </TabPanel>
        </Tabs>
        <ul className="text-list">
          {(() => {
            return this.props.texts.map((text) => {
              let className = 'text-item'
              if (this.isCurrentText(text.id)) {
                className += ' selected';
              }
              return (
                <li
                  className={className}
                  key={text.id}
                  onClick={this.handleSelectText.bind(this, text.id)} >
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

