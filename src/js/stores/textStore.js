import _ from 'lodash';
import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import { ActionTypes } from '../constants'

const CHANGE_EVENT = 'change';

let texts = loadFromLS() || [];
let textsHistory = [[]];
let historyIdx = 0;

function updateTexts(params) {
  let added = true;
  texts = texts.map((text) => {
    if (text.id === params.id) {
      text = params;
      added = false;
    }
    return text;
  });
  if (added) {
    texts.push(params);
  }
}

function removeText(id) {
  texts = texts.filter((text) => {
    return text.id !== id;
  });
}

function calcZoom(value, zoom, fix = 0) {
  return Number(`${(Number(value) * zoom).toFixed(fix)}`);
}

function saveToLS() {
  localStorage.setItem('texts', JSON.stringify(texts));
}

function loadFromLS() {
  return JSON.parse(localStorage.getItem('texts'));
}

function uniqueId() {
  const id = _.uniqueId('text_');
  if (instance.exists(id)) {
    return uniqueId();
  }
  return id;
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

  findText(id) {
    const text = texts.find((text) => {
      return text.id === id;
    });
    return text;
  }

  exists(id) {
    return !!this.findText(id);
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
      id: _.uniqueId('text-'),
      x: 0,
      y: 0,
      width: 160,
      height: 20,
      value: '',
      key: '',
      fontSize: 12,
      scale: 1,
      lineHeight: null,
      letterSpacing: null,
      textAlign: 'left',
      split: false
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
    removeText(action.id);
    instance.emitChange();
    break;
  case ActionTypes.COPY_TEXT:
    const text = _.clone(instance.findText(action.id));
    text.key += `-${_.uniqueId()}`
    updateTexts(text);
    instance.emitChange();
    break;
  case ActionTypes.CHANGE_ZOOM:
    const zoom = action.zoom;
    texts = texts.map((text) => {
      return _.extend({}, text, {
        x: calcZoom(text.x, zoom),
        y: calcZoom(text.y, zoom),
        width: calcZoom(text.width, zoom),
        height: calcZoom(text.height, zoom),
        scale: calcZoom(text.scale, zoom, 4)
      });
    });
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

