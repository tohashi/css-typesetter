import _ from 'lodash';
import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import { ActionTypes } from '../constants'

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

class TextStore extends EventEmitter {
  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

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
}

const instance = new TextStore();

instance.dispatchToken = Dispatcher.register((action) => {
  switch (action.actionType) {
  case ActionTypes.UPDATE_TEXT:
    updateTexts(action.params);
    instance.emitChange();
    break;
  case ActionTypes.REMOVE_TEXT:
    removeText(action.key);
    instance.emitChange();
    break;
  case ActionTypes.COPY_TEXT:
    const text = _.clone(instance.findText(action.key));
    text.key = uniqueKey(`${text.key}-`);
    updateTexts(text);
    instance.emitChange();
    break;
  case ActionTypes.UNDO:
    historyIdx -= 1;
    texts = _.cloneDeep(textsHistory[historyIdx]);
    instance.emitChange();
    return;
  case ActionTypes.REDO:
    historyIdx += 1;
    texts = _.cloneDeep(textsHistory[historyIdx]);
    instance.emitChange();
    return;
  case ActionTypes.IMPORT:
    let data = [];
    try {
      data = JSON.parse(action.json);
    } catch (e) {
      throw Error('parse error');
    }
    texts = data;
    instance.emitChange();
    break;
  }

  if (TextStore.redoable) {
    textsHistory.splice(historyIdx);
  }
  saveToLS();
  textsHistory.push(_.cloneDeep(texts));
  historyIdx = textsHistory.length - 1;
});

export default instance;

