import { EventEmitter } from 'events';
import Dispatcher from '../dispatcher';
import { ActionTypes } from '../constants'

const CHANGE_EVENT = 'change';

let texts = [];

function updateTexts(params) {
  texts = texts.map((text) => {
    if (text.key === params.key) {
      text = params;
      params = null;
    }
    return text;
  });
  if (params) {
    texts.push(params);
  }
}

function removeText(key) {
  texts = texts.filter((text) => {
    return text.key !== key;
  });
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

  get texts() {
    return texts;
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
  }

});

export default instance;

