import Dispatcher from '../dispatcher';
import { ActionTypes } from '../constants'

export default {
  update(params) {
    Dispatcher.dispatch({
      actionType: ActionTypes.UPDATE_TEXT,
      params
    });
  },

  remove(id) {
    Dispatcher.dispatch({
      actionType: ActionTypes.REMOVE_TEXT,
      id
    });
  },

  copy(id) {
    Dispatcher.dispatch({
      actionType: ActionTypes.COPY_TEXT,
      id
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

