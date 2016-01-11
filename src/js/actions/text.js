import { ActionTypes } from '../constants'

export default {
  updateText(params) {
    return {
      type: ActionTypes.UPDATE_TEXT,
      params
    };
  },

  removeText(key) {
    // TODO
  },

  copyText(key) {
    // TODO
  },

  clearTexts() {
    // TODO
  },

  importTexts(json) {
    // TODO
  }
};

