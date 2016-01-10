import { combineReducers } from 'redux';
import text from './text';
import setting from './setting';

const rootReducer = combineReducers({
  text, setting
});

export default rootReducer;

