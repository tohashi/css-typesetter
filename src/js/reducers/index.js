import { combineReducers } from 'redux';
import texts from './texts';
import setting from './setting';

const rootReducer = combineReducers({
  texts, setting
});

export default rootReducer;

