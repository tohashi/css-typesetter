import React from 'react';

export default class PublishArea extends React.Component {
  render() {
    return (
      <div className="result">
        {(() => {
          return this.props.texts.map((text, i) => {
            return (
              <p key={text.key}>
                {
                  `.${text.key} {
                    left: ${text.x}px;
                    top: ${text.y}px;
                    width: ${text.width}px;
                    height: ${text.height};
                    font-size: ${text.fontSize}px;
                    transform: scale(${text.scale});
                  }`
                }
              </p>
            );
          });
        })()}
      </div>
    );
  }
}

