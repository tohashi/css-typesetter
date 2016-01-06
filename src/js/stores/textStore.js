import _ from 'lodash';
import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import { ActionTypes } from '../constants';
import { Store } from 'flux/utils';

const CHANGE_EVENT = 'change';

let texts = loadFromLS() || [];
let textsHistory = [_.cloneDeep(texts)];
let historyIdx = 0;

function updateTexts(params) {
  let added = true;
  texts = texts.map((text) => {
    if (text.key === params.key) {
      text = params;
      added = false;
    }
    return text;
  });
  if (added) {
    texts.push(params);
  }
}

function removeText(key) {
  texts = texts.filter((text) => {
    return text.key !== key;
  });
}

function saveToLS() {
  localStorage.setItem('texts', JSON.stringify(texts));
}

function loadFromLS() {
  return JSON.parse(localStorage.getItem('texts'));
}

function uniqueKey(prefix) {
  const key = _.uniqueId(prefix);
  if (instance.exists(key)) {
    return uniqueKey(`${key}-`);
  }
  return key;
}

class TextStore extends Store {
  findText(key) {
    const text = texts.find((text) => {
      return text.key === key;
    });
    return text;
  }

  exists(key) {
    return !!this.findText(key);
  }

  undoable() {
    return textsHistory.length > 1 && historyIdx > 0;
  }

  redoable() {
    return historyIdx !== Math.max(textsHistory.length - 1, 0);
  }

  get texts() {
    return texts;
  }

  get defaultParams() {
    return {
      key: uniqueKey('text-'),
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
  }

  __onDispatch(action) {
    switch (action.actionType) {
    case ActionTypes.UPDATE_TEXT:
      updateTexts(action.params);
      break;
    case ActionTypes.REMOVE_TEXT:
      removeText(action.key);
      break;
    case ActionTypes.COPY_TEXT:
      const text = _.clone(instance.findText(action.key));
      text.key = uniqueKey(`${text.key}-`);
      updateTexts(text);
      break;
    case ActionTypes.IMPORT:
      let data = [];
      try {
        data = JSON.parse(action.json);
      } catch (e) {
        throw Error('parse error');
      }
      texts = data;
      break;
    case ActionTypes.CLEAR:
      texts = [];
      break;
    case ActionTypes.UNDO:
      historyIdx -= 1;
      texts = _.cloneDeep(textsHistory[historyIdx]);
      this.__emitChange();
      return;
    case ActionTypes.REDO:
      historyIdx += 1;
      texts = _.cloneDeep(textsHistory[historyIdx]);
      this.__emitChange();
      return;
    default:
      return;
    }
    this.__emitChange();
    saveToLS();
    textsHistory.push(_.cloneDeep(texts));
    historyIdx = textsHistory.length - 1;
  }
}

const instance = new TextStore(Dispatcher);

export default instance;

