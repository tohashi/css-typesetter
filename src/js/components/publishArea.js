import React from 'react';
import _ from 'lodash';
import TextStore from '../stores/textStore';
import TextAction from '../actions/textAction';

export default class PublishArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      json: ''
    }
  }

  handleInput(e) {
    this.setState({
      json: e.target.value
    });
  }

  handleImport() {
    TextAction.import(this.state.json);
  }

  handleExport() {
    this.setState({
      json: JSON.stringify(TextStore.texts)
    });
  }

  render() {
    return (
      <div className="result">
        {(() => {
          return this.props.texts.map((text, i) => {
            let css = `.${text.key} {
                      left: ${text.x}px;
                      top: ${text.y}px;
                      width: ${text.width}px;
                      height: ${text.height};
                      font-size: ${text.fontSize}px;`

            if (text.scale !== 1) {
              css += ` transform: scale(${text.scale});`;
            }
            if (_.isNumber(text.lineHeight)) {
              css += ` line-height: ${text.lineHeight}px;`;
            }
            if (_.isNumber(text.letterSpacing)) {
              css += ` letter-spacing: ${text.letterSpacing}px;`;
            }
            if (text.textAlign != 'left') {
              css += ` text-align: ${text.textAlign};`;
            }
            css += ' }';
            return (
              <p key={text.id}>
                {css}
              </p>
            );
          });
        })()}

        <div className="json-export">
          <div>
            <button onClick={this.handleImport.bind(this)}>import</button>
            <button onClick={this.handleExport.bind(this)}>export</button>
          </div>
          <textarea value={this.state.json} onChange={this.handleInput.bind(this)} />
        </div>
      </div>
    );
  }
}

