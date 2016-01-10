import _ from 'lodash';
import { ActionTypes } from '../constants';

function uniqueKey(prefix) {
  const key = _.uniqueId(prefix);
  if (instance.exists(key)) {
    return uniqueKey(`${key}-`);
  }
  return key;
}

function getDefaultParams() {
  return {
    // TODO uniqueKey
    key: _.uniqueId('text-'),
    x: 0,
    y: 0,
    width: 160,
    height: 20,
    value: 'test',
    fontSize: 12,
    scale: 1,
    lineHeight: null,
    letterSpacing: null,
    textAlign: 'left'
  };
};

function getInitialState() {
  return {
    getDefaultParams,
    texts: [getDefaultParams()],
    history: [],
    historyIdx: 0,
    undoable: false,
    redoable: false
  }
}

const initialState = getInitialState();

export default function texts(state = initialState, action) {
  switch(action.actionType) {
  case ActionTypes.ADD_TEXT:
    state.texts.push(_.defaults(action.params, getDefaultTextParams()));
    state.history.push(state.texts);
    return state;
  case ActionTypes.UNDO:
    state.historyIdx -= 1;
    state.texts = _.cloneDeep(history[state.historyIdx]);
    return state;
  case ActionTypes.REDO:
    state.historyIdx += 1;
    state.texts = _.cloneDeep(history[state.historyIdx]);
    return state;
  default:
    return state;
  }
}

