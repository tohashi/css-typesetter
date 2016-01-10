import { ActionTypes } from '../constants'

export default {
  updateText(params) {
    return {
      type: ActionTypes.UPDATE_TEXT,
      params
    };
  },

  removeText() {
    // TODO
  },

  copyText() {
    // TODO
  },

  clearTexts() {
    // TODO
  }
};

