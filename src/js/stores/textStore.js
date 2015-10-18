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

  get texts() {
    return texts;
  }
}

const instance = new TextStore();

instance.dispatchToken = Dispatcher.register((action) => {
  switch (action.actionType) {
  case ActionTypes.ADD_TEXT:
    updateTexts(action.params);
    instance.emitChange();
    break;
  }
});

export default instance;

