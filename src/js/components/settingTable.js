import React from 'react';

export default class SettingTable extends React.Component {
  render() {
    const text = this.props.text;
    return (
      <table>
        <tbody>
          <tr>
            <td>class</td>
            <td><input type="text" name="key" value={text.key} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>value</td>
            <td><input type="text" name="value" value={text.value} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>x</td>
            <td><input type="number" name="x" value={text.x} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>y</td>
            <td><input type="number" name="y" value={text.y} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>width</td>
            <td><input type="number" name="width" value={text.width} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>height</td>
            <td><input type="number" name="height" value={text.height} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>font-size</td>
            <td><input type="number" name="fontSize" value={text.fontSize} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>scale</td>
            <td><input type="number" name="scale" value={text.scale} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>line-height</td>
            <td><input type="number" name="lineHeight" value={text.lineHeight} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>letter-spacing</td>
            <td><input type="text" name="letterSpacing" value={text.letterSpacing} onChange={this.props.handleChange} /></td>
          </tr>
          <tr>
            <td>text-align</td>
            <td>
              {(() => {
                return ['left', 'center', 'right'].map((type) => {
                  return (
                    <label key={type}>
                      <input type="radio" name="textAlign" value={type} onChange={this.props.handleChange} checked={text.textAlign === type} />
                      {type}
                    </label>
                  );
                });
              })()}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

