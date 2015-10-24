import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import _ from 'lodash';

import Setting from './components/setting';
import TextStore from './stores/textStore';
import SettingAction from './actions/settingAction';

class DocEditor extends React.Component {
  get defaultTextParams() {
    return {
      x: 0,
      y: 0,
      value: '',
      key: '',
      fontSize: 12
    };
  }

  constructor() {
    super(...arguments);
    this.textChangeHandler = this.handleTextChange.bind(this);
    this.state = {
      previewWidth: 720,
      previewHeight: 0,
      currentTextKey: null,
      textParams: _.clone(this.defaultTextParams),
      texts: TextStore.texts
    }
  }

  componentDidMount() {
    const img = document.createElement('img');
    img.src = './src/img/sample.png';
    img.onload = ((e) => {
      this.setState({
        previewHeight: ((this.state.previewWidth/ e.target.width) * e.target.height) || 0
      });
    });
    TextStore.addChangeListener(this.textChangeHandler);
  }

  componentWillUnmount() {
    TextStore.removeListener(this.textChangeHandler);
  }

  handleTextChange() {
    this.setState({ texts: TextStore.texts });
  }

  handleStop(key) {
    this.setState((state) => {
      state.texts = state.texts.map((text) => {
        if (text.key === key) {
          text.x = this.refs[key].state.clientX;
          text.y = this.refs[key].state.clientY;
        }
        return text;
      })
      return state;
    })
  }

  handleSelectText(key) {
    const text = TextStore.findText(key);
    this.setState((state) => {
      if (text) {
        state.currentTextKey = key;
        state.textParams = text;
      } else {
        state.currentTextKey = null;
        state.textParams = {};
      }
      return state;
    });
  }

  handleInputChange(key, value) {
    this.setState((state) => {
      state.textParams[key] = _.isNaN(parseInt(value)) ? value : parseInt(value);
      return state;
    });
    if (this.props.currentTextKey) {
      this.handleUpdateText();
    }
  }

  handleUpdateText() {
    const text = this.state.textParams;
    if (!text.key || !text.value) {
      return;
    }
    SettingAction.update(text);
    this.setState({ textParams: _.clone(this.defaultTextParams) });
  }

  render() {
    const imageStyle = {
      width: `${this.state.previewWidth}px`,
      height: `${this.state.previewHeight}px`
    };

    return (
      <div className="doc-style-editor">
        <div className="doc-wrapper">
          <div className="doc-image" style={imageStyle}>
            {(() => {
              return this.state.texts.map((text, i) => {
                const textStyle = {
                  fontSize: `${text.fontSize}px`
                };
                let className = 'draggable-text';
                if (text.key === this.state.currentTextKey) {
                  className += ' selected';
                }

                return (
                  <Draggable
                    ref={text.key}
                    key={text.key}
                    axis="both"
                    start={{ x: text.x, y: text.y }}
                    moveOnStartChange={true}
                    onStop={this.handleStop.bind(this, text.key)}>
                    <div
                      className={className}
                      style={textStyle}
                      onClick={this.handleSelectText.bind(this, text.key)} >
                      {text.value}
                    </div>
                  </Draggable>
                );
              });
            })()}
          </div>

          <Setting
            text={this.state.textParams}
            texts={this.state.texts}
            currentTextKey={this.state.currentTextKey}
            handleInputChange={this.handleInputChange.bind(this)}
            handleUpdateText={this.handleUpdateText.bind(this)}
            handleSelectText={this.handleSelectText.bind(this)} />
        </div>

        <div className="result">
          {(() => {
            return this.state.texts.map((text, i) => {
              return (
                <p key={text.key}>{`.${text.key} { left: ${text.x}px; top: ${text.y}px; }`}</p>
              );
            });
          })()}
        </div>

      </div>
    );
  }
}

ReactDOM.render(<DocEditor />, document.getElementById('root'));

