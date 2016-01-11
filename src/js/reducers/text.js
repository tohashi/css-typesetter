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
  switch(action.type) {
  case ActionTypes.UPDATE_TEXT:
    const params = action.params;
    let added = true;
    const texts = state.texts.map((text) => {
      if (text.key === params.key) {
        text = params;
        added = false;
      }
      return text;
    });
    if (added) {
      texts.push(params);
    }
    return _.extend({}, state, {
      texts: texts
    });
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

