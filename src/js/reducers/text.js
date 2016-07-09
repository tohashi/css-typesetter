import _ from 'lodash';
import { ActionTypes } from '../constants';

function getDefaultParams(uniqueId) {
  return {
    key: (uniqueId || _.uniqueId)('text-'),
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
    texts: loadFromLS() || [],
    history: _.isEmpty(loadFromLS()) ? [] : [loadFromLS()],
    historyIdx: 0,
    undoable: false,
    redoable: false
  }
}

function saveToLS(texts) {
  localStorage.setItem('texts', JSON.stringify(texts));
}

function loadFromLS() {
  return JSON.parse(localStorage.getItem('texts'));
}

function isUndoable(historyIdx, history) {
  return history.length > 1 && historyIdx > 0;
}

function isRedoable(historyIdx, history) {
  return historyIdx !== Math.max(history.length - 1, 0);
}

const initialState = getInitialState();

export default function texts(state = initialState, action) {
  if (_.includes([ActionTypes.UNDO, ActionTypes.REDO], action.type)) {
    const historyIdx = action.type === ActionTypes.UNDO ?
      state.historyIdx - 1 : state.historyIdx + 1;
    return _.extend({}, state, {
      historyIdx,
      texts: _.cloneDeep(state.history[historyIdx]),
      undoable: isUndoable(historyIdx, state.history),
      redoable: isRedoable(historyIdx, state.history)
    });
  }

  let modifiedState = (() => {
    let texts = [];
    switch(action.type) {
    case ActionTypes.UPDATE_TEXT:
      const params = action.params;
      const originalKey = action.originalKey;
      let added = true;
      texts = state.texts.map((text) => {
        if (text.key === params.key || (originalKey && text.key === originalKey)) {
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
    }
  })();

  if (!modifiedState) {
    return state;
  }
  saveToLS(modifiedState.texts);
  modifiedState.history.push(_.cloneDeep(modifiedState.texts));
  modifiedState.historyIdx = modifiedState.history.length - 1;

  return _.extend({}, modifiedState, {
    undoable: isUndoable(modifiedState.historyIdx, modifiedState.history),
    redoable: isRedoable(modifiedState.historyIdx, modifiedState.history)
  });
}

