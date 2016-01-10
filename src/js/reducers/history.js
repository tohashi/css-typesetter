import _ from 'lodash';
import { ActionTypes } from '../constants';

function getInitialState() {
  return {
    history: [],
    historyIdx: []
  };
};

const initialState = getInitialState();

export default function history(state = initialState, action) {
  switch(action.type) {
  case ActionTypes.UNDO:
    return _.extend({}, state, {
      historyIdx: state.historyIdx - 1,
    });
  case ActionTypes.REDO:
    return _.extend({}, state, {
      historyIdx: state.historyIdx + 1
    });
  default:
    return state;
  }
}

