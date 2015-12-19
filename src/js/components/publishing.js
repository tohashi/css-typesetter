import React from 'react';
import _ from 'lodash';
import Modal from 'react-modal';
import TextStore from '../stores/textStore';
import TextAction from '../actions/textAction';

export default class Publishing extends React.Component {
  get modalStyle() {
    return {
      top:         '50%',
      left:        '50%',
      right:       'auto',
      bottom:      'auto',
      marginRight: '-50%',
      transform:   'translate(-50%, -50%)'
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      json: ''
    }
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
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
      <div>
        <button onClick={this.openModal.bind(this)}>show css</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal.bind(this)}
          style={this.modalStyle}
        >
          <div>
            <div>
              <pre>
                {"<div class=\"image\">\n"}
                  {this.props.texts.map((text) => {
                    return `  <div class=${`text-item ${text.key}`}>${text.value}</div>\n`;
                  })}
                {"</div>"}
              </pre>
            </div>
            <div>
              <pre>
{`.image {
  position: relative;
  .text-item {
    position: absolute;
    word-wrap: break-word;
    transform-origin: 0 0;
  }
`}
                {(() => {
                  return this.props.texts.map((text, i) => {
                    let css =`  .${text.key} {
    left: ${text.x}px;
    top: ${text.y}px;
    width: ${text.width}px;
    height: ${text.height}px;
    font-size: ${text.fontSize}px;`;
                    if (text.scale !== 1) {
                      css += `\n    transform: scale(${text.scale});`;
                    }
                    if (_.isNumber(text.lineHeight)) {
                      css += `\n    line-height: ${text.lineHeight}px;`;
                    }
                    if (_.isNumber(text.letterSpacing)) {
                      css += `\n    letter-spacing: ${text.letterSpacing}px;`;
                    }
                    if (text.textAlign != 'left') {
                      css += `\n    text-align: ${text.textAlign};`;
                    }
                    css += '\n  }\n';
                    return (
                      <span key={text.id}>
                        {css}
                      </span>
                    );
                  });
                })()}
                {'}'}
              </pre>
            </div>
          </div>
        </Modal>
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

