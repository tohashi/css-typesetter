import Dispatcher from '../dispatcher';
import { ActionTypes } from '../constants'

export default {
  update(params) {
    Dispatcher.dispatch({
      actionType: ActionTypes.UPDATE_TEXT,
      params
    });
  },

  remove(key) {
    Dispatcher.dispatch({
      actionType: ActionTypes.REMOVE_TEXT,
      key
    });
  },

  copy(key) {
    Dispatcher.dispatch({
      actionType: ActionTypes.COPY_TEXT,
      key
    });
  },

  changeZoom(zoom) {
    Dispatcher.dispatch({
      actionType: ActionTypes.CHANGE_ZOOM,
      zoom
    });
  },

  undo() {
    Dispatcher.dispatch({
      actionType: ActionTypes.UNDO
    });
  },

  redo() {
    Dispatcher.dispatch({
      actionType: ActionTypes.REDO
    });
  },

  import(json) {
    Dispatcher.dispatch({
      actionType: ActionTypes.IMPORT,
      json
    });
  }
};

