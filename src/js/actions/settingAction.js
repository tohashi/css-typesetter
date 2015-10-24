import Dispatcher from '../dispatcher';
import { ActionTypes } from '../constants'

export default {
  add(params) {
    Dispatcher.dispatch({
      actionType: ActionTypes.ADD_TEXT,
      params
    });
  },

  remove(key) {
    Dispatcher.dispatch({
      actionType: ActionTypes.REMOVE_TEXT,
      key
    })
  }
};

