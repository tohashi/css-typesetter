import React from 'react';
import _ from 'lodash';

import TextStore from '../stores/textStore';
import TextAction from '../actions/textAction';

export default class Setting extends React.Component {
  constructor() {
    super();
    this.inputChangeHandler = this.handleInputChange.bind(this);
    this.checkedHandler = this.handleChecked.bind(this);
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
    if (_.isNumber(parsedValue) &&
        !_.isNaN(parsedValue)) {
      value = parsedValue
    }
    this.props.handleInputChange(e.target.name, value);
  }

  handleChecked(e) {
    this.props.handleInputChange(e.target.name, e.target.checked);
  }

  render() {
    return (
      <div className="setting">
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
        <div>
          previewWidth<input defaultValue={this.props.previewWidth} />
          <button onClick={this.props.changePreviewWidth}>change</button>
        </div>
        <table>
          <tbody>
            <tr>
              <td>class</td>
              <td><input type="text" name="key" value={this.props.text.key} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>value</td>
              <td><input type="text" name="value" value={this.props.text.value} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>x</td>
              <td><input type="number" name="x" value={this.props.text.x} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>y</td>
              <td><input type="number" name="y" value={this.props.text.y} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>width</td>
              <td><input type="number" name="width" value={this.props.text.width} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>height</td>
              <td><input type="number" name="height" value={this.props.text.height} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>font-size</td>
              <td><input type="number" name="fontSize" value={this.props.text.fontSize} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>scale</td>
              <td><input type="number" name="scale" value={this.props.text.scale} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>line-height</td>
              <td><input type="number" name="lineHeight" value={this.props.text.lineHeight} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>letter-spacing</td>
              <td><input type="number" name="letterSpacing" value={this.props.text.letterSpacing} onChange={this.inputChangeHandler} /></td>
            </tr>
            <tr>
              <td>text-align</td>
              <td>
                {(() => {
                  return ['left', 'center', 'right'].map((type) => {
                    return (
                      <label key={type}>
                        <input type="radio" name="textAlign" value={type} onChange={this.inputChangeHandler} checked={this.props.text.textAlign === type} />
                        {type}
                      </label>
                    );
                  });
                })()}
              </td>
            </tr>
            <tr>
              <td>split</td>
              <td>
                <label>
                  <input type="checkbox" name="split" value={true} checked={this.props.text.split} onChange={this.checkedHandler} />
                  split
                </label>
              </td>
            </tr>
          </tbody>
        </table>
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

