import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Typesetter from './typesetter';
import store from './stores/store';

ReactDOM.render(
  (
    <Provider store={store}>
      <Typesetter />
    </Provider>
  ),
  document.getElementById('root')
);

