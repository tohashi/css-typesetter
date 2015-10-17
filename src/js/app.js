import React from 'react';
import ReactDOM from 'react-dom';

class DocEditor extends React.Component {
  render() {
    return (
      <div>
        editor
        <img src="./src/img/sample.png" />
      </div>
    );
  }
}

ReactDOM.render(<DocEditor />, document.getElementById('root'));

