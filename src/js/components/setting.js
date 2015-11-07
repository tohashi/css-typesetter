import React from 'react';

import TextStore from '../stores/textStore';
import TextAction from '../actions/textAction';

export default class Setting extends React.Component {
  constructor() {
    super();
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
    this.props.handleInputChange(e.target.name, e.target.value);
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
          </tbody>
        </table>
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

