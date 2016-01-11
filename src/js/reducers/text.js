import _ from 'lodash';
import { ActionTypes } from '../constants';

function getDefaultParams() {
  return {
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
    texts: [],
    history: [],
    historyIdx: 0,
    undoable: false,
    redoable: false
  }
}

const initialState = getInitialState();

const reduce = (state, action) => {
  let texts = [];
  switch(action.type) {
  case ActionTypes.UPDATE_TEXT:
    const params = action.params;
    let added = true;
    texts = state.texts.map((text) => {
      if (text.key === params.key) {
        text = _.defaults(params, text);
        added = false;
      }
      return text;
    });
    if (added) {
      texts.push(params);
    }
    return _.extend({}, state, { texts });
  case ActionTypes.REMOVE_TEXT:
    texts = state.texts.filter((text) => {
      return text.key !== action.key;
    });
    return _.extend({}, state, { texts });
  case ActionTypes.COPY_TEXT:
    const text = _.cloneDeep(state.texts.find((text) => {
      return text.key === action.key;
    }));
    text.key = _.uniqueId(`${text.key}-`);
    texts = state.texts;
    texts.push(text);
    return _.extend({}, state, { texts });
  case ActionTypes.CLEAR_TEXTS:
    return _.extend({}, state, { texts });
  case ActionTypes.IMPORT_TEXTS:
    try {
      texts = JSON.parse(action.json);
    } catch (e) {
      throw Error('parse error');
    }
    return _.extend({}, state, { texts });
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

export default function texts(state = initialState, action) {
  return _.extend({}, reduce(state, action), {
    undoable: state.history.length > 1 && state.historyIdx > 0,
    redoable: state.historyIdx !== Math.max(state.history.length - 1, 0)
  });
}

