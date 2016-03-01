import { ActionTypes } from '../constants'

export default {
  undo() {
    return { type: ActionTypes.UNDO }
  },

  redo() {
    return { type: ActionTypes.REDO }
  }
};

