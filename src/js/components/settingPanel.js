import React from 'react';
import _ from 'lodash';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SettingTable from './settingTable';
import Publishing from './publishing';

export default class SettingPanel extends React.Component {
  constructor(props) {
    super(props);
    this.inputChangeHandler = this.handleInputChange.bind(this);
  }

  isCurrentText(key) {
    return key === this.props.edittingText.key;
  }

  handleRemoveText(key) {
    this.props.actions.removeText(this.props.edittingText.key);
    this.props.handleSelectText(null);
  }

  handleCopyText(key) {
    this.props.actions.copyText(this.props.edittingText.key);
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
    this.props.handleUpdateTextParams(params);
  }

  render() {
    const text = this.props.text;
    const texts = text.texts;
    const actions = this.props.actions;
    const textList = (
      <div className="text-list">
        <p>texts</p>
        <ul>
          {(() => {
            return texts.map((text, i) => {
              let className = 'text-item'
              if (this.isCurrentText(text.key)) {
                className += ' selected';
              }
              return (
                <li
                  className={className}
                  key={`${text.key}_${i}`}
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
            if (text.undoable) {
              return (
                <button onClick={actions.undo}>undo</button>
              );
            }
          })()}
          {(() => {
            if (text.redoable) {
              return (
                <button onClick={actions.redo}>redo</button>
              );
            }
          })()}
        </div>

        <Tabs selectedIndex={0}>
          <TabList>
            <Tab>params</Tab>
            <Tab>items</Tab>
            <Tab>publishing</Tab>
          </TabList>
          <TabPanel className="tab-panel">
            <SettingTable
              text={this.props.edittingText}
              handleChange={this.inputChangeHandler}
            />
            {(() => {
              if (!this.props.findText(this.props.edittingText.key)) {
                return (
                  <button onClick={this.props.handleUpdateText}>add</button>
                );
              }
              return (
                <div>
                  <button onClick={this.handleCopyText.bind(this)}>copy</button>
                  <button onClick={this.handleRemoveText.bind(this)}>remove</button>
                  <button onClick={this.handleSelectText.bind(this, null)}>deselect</button>
                </div>
              );
            })()}
          </TabPanel>
          <TabPanel className="tab-panel">
            {textList}
            <button onClick={actions.clearTexts}>clear</button>
          </TabPanel>
          <TabPanel className="tab-panel">
            <Publishing
              actions={actions}
              texts={texts}
              imageClassName={this.props.imageClassName}
              textClassName={this.props.textClassName}
              previewWidth={this.props.setting.previewWidth}
              previewHeight={this.props.setting.previewHeight}
            />
            {textList}
            <button onClick={actions.clearTexts}>clear</button>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

