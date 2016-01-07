import _ from 'lodash';
import { ActionTypes } from '../constants';

function getInitialState() {
  return {
    previewWidth: 720,
    previewHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    imagePath: null,
    draggingKey: null
  };
};

const initialState = getInitialState();

export default function setting(state = initialState, action) {
  switch(action.type) {
  case ActionTypes.SET_IMAGE_PATH:
    return _.extend({}, state, {
      imagePath: action.path
    });
  case ActionTypes.SET_PREVIEW_WIDTH:
    return _.extend({}, state, {
      previewWidth: action.previewWidth
    });
  default:
    return state;
  }
}

