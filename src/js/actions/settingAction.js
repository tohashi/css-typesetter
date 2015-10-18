import Dispatcher from '../dispatcher';
import { ActionTypes } from '../constants'

export default {
  add(params) {
    Dispatcher.dispatch({
      actionType: ActionTypes.ADD_TEXT,
      params
    });
  }
};

